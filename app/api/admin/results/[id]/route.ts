import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const attemptId = parseInt(id);

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
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
            questions: {
              include: {
                question: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        answers: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const totalQuestions = attempt.exam.questions.length;
    const percentage = (attempt.score! / totalQuestions) * 100;
    const passed = attempt.exam.passMark ? percentage >= attempt.exam.passMark : false;

    const result = {
      id: attempt.id,
      student: attempt.student,
      exam: attempt.exam,
      score: attempt.score,
      totalQuestions,
      percentage,
      passed,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      autoSubmitted: attempt.autoSubmitted,
      answers: attempt.answers,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch result details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
