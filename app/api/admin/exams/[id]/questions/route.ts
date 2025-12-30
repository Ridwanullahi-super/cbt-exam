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
    const examId = parseInt(id);

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: {
        title: true,
        classLevel: true,
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({
      examTitle: exam.title,
      classLevel: exam.classLevel,
      questions: exam.questions,
    });
  } catch (error) {
    console.error('Failed to fetch exam questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const examId = parseInt(id);
    const { questionId } = await request.json();

    // Check if question already exists in exam
    const existing = await prisma.examQuestion.findFirst({
      where: {
        examId,
        questionId,
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Question already added to exam' }, { status: 400 });
    }

    // Get the current max order
    const maxOrder = await prisma.examQuestion.findFirst({
      where: { examId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (maxOrder?.order ?? 0) + 1;

    const examQuestion = await prisma.examQuestion.create({
      data: {
        examId,
        questionId,
        order: newOrder,
      },
      include: {
        question: true,
      },
    });

    return NextResponse.json(examQuestion);
  } catch (error) {
    console.error('Failed to add question to exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
