import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exams = await prisma.exam.findMany({
      include: {
        questions: true,
        attempts: true,
        sessionTerm: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedExams = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      classLevel: exam.classLevel,
      durationMin: exam.durationMin,
      published: exam.published,
      scheduledAt: exam.scheduledAt,
      questionCount: exam.questions.length,
      attemptCount: exam.attempts.length,
    }));

    return NextResponse.json(formattedExams);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
