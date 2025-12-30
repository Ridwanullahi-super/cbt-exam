import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const student = await prisma.student.findUnique({
      where: { studentId },
      select: {
        id: true,
        classLevel: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get published exams for this student's class level that are scheduled
    const now = new Date();
    const exams = await prisma.exam.findMany({
      where: {
        published: true,
        classLevel: student.classLevel,
        scheduledAt: {
          lte: now, // Only show exams that are scheduled for now or in the past
        },
      },
      include: {
        questions: true,
        attempts: {
          where: { studentId: student.id },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    const formattedExams = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      durationMin: exam.durationMin,
      questionCount: exam.questions.length,
      passMark: exam.passMark,
      scheduledAt: exam.scheduledAt,
      attempts: exam.attempts.length,
      maxAttempts: exam.allowedAttempts,
    }));

    return NextResponse.json(formattedExams);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
