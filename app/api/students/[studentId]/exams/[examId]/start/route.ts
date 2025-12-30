import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
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
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: { order: 'asc' },
        },
        attempts: {
          where: { studentId: student.id },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check if student has reached max attempts
    if (exam.attempts.length >= exam.allowedAttempts) {
      return NextResponse.json(
        { error: 'Maximum attempts reached' },
        { status: 403 }
      );
    }

    // Create new attempt
    const attempt = await prisma.attempt.create({
      data: {
        examId: exam.id,
        studentId: student.id,
        status: 'IN_PROGRESS',
      },
    });

    // Format questions (remove correct answers)
    const formattedQuestions = exam.questions.map((eq: any) => ({
      id: eq.question.id,
      text: eq.question.text,
      optionA: eq.question.optionA,
      optionB: eq.question.optionB,
      optionC: eq.question.optionC,
      optionD: eq.question.optionD,
      optionE: eq.question.optionE,
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      exam: {
        id: exam.id,
        title: exam.title,
        durationMin: exam.durationMin,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    console.error('Failed to start exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
