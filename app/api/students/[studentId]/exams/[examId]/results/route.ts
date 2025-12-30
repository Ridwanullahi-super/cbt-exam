import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string; examId: string }> }
) {
  try {
    const { studentId, examId: examIdParam } = await params;
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const examId = parseInt(examIdParam);
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: {
        title: true,
        passMark: true,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Get all attempts for this student and exam
    const attempts = await prisma.attempt.findMany({
      where: {
        examId,
        studentId: student.id,
        status: 'SUBMITTED',
      },
      include: {
        answers: true,
        exam: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const formattedAttempts = attempts.map((attempt: any) => ({
      id: attempt.id,
      score: attempt.score || 0,
      submittedAt: attempt.submittedAt,
      autoSubmitted: attempt.autoSubmitted,
      correctAnswers: attempt.answers.filter((a: any) => a.isCorrect).length,
      totalQuestions: attempt.exam.questions.length,
    }));

    return NextResponse.json({
      examTitle: exam.title,
      passMark: exam.passMark,
      attempts: formattedAttempts,
    });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
