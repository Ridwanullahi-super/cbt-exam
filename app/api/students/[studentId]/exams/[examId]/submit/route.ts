import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ studentId: string; examId: string }> }
) {
  try {
    const body = await request.json();
    const { attemptId, answers, autoSubmitted } = body;
    const { studentId, examId: examIdParam } = await params;

    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const examId = parseInt(examIdParam);

    // Get exam with questions and correct answers
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const examQuestion = exam.questions.find(
        (eq: any) => eq.question.id === answer.questionId
      );

      if (examQuestion) {
        const isCorrect = examQuestion.question.correct === answer.selected;
        if (isCorrect) correctAnswers++;

        answerRecords.push({
          attemptId,
          questionId: answer.questionId,
          selected: answer.selected,
          isCorrect,
          mark: isCorrect ? 1 : exam.negativeMarking ? -0.25 : 0,
        });
      }
    }

    // Save answers
    await prisma.answer.createMany({
      data: answerRecords,
    });

    // Calculate final score
    const totalQuestions = exam.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Update attempt
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        submittedAt: new Date(),
        autoSubmitted,
        score,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json({
      score,
      correctAnswers,
      totalQuestions,
    });
  } catch (error) {
    console.error('Failed to submit exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
