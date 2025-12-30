import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const attempts = await prisma.attempt.findMany({
      where: {
        status: 'SUBMITTED',
      },
      include: {
        student: {
          select: {
            studentId: true,
            firstName: true,
            lastName: true,
            classLevel: true,
          },
        },
        exam: {
          select: {
            title: true,
            durationMin: true,
            passMark: true,
          },
        },
        answers: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const results = attempts.map((attempt) => {
      const totalQuestions = attempt.answers.length;
      const correctAnswers = attempt.answers.filter((ans) => ans.isCorrect).length;
      const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const passMark = attempt.exam.passMark || 50;
      const passed = percentage >= passMark;

      // Calculate time taken in minutes
      const timeTaken = attempt.submittedAt && attempt.startedAt
        ? Math.round((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000)
        : 0;

      return {
        id: attempt.id,
        student: attempt.student,
        exam: attempt.exam,
        score: correctAnswers,
        totalQuestions,
        percentage,
        passed,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeTaken,
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
