import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      classLevel,
      durationMin,
      passMark,
      allowedAttempts,
      randomize,
      shuffleOptions,
      negativeMarking,
      showResultsImmediately,
      published,
      scheduledAt,
    } = body;

    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || null,
        classLevel,
        durationMin,
        passMark: passMark || null,
        allowedAttempts: allowedAttempts || 1,
        randomize: randomize || false,
        shuffleOptions: shuffleOptions !== undefined ? shuffleOptions : true,
        negativeMarking: negativeMarking || false,
        showResultsImmediately: showResultsImmediately !== undefined ? showResultsImmediately : true,
        published: published || false,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Failed to create exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
