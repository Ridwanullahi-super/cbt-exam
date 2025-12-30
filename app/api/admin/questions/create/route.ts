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
      text,
      subject,
      topic,
      difficulty,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      correct,
    } = body;

    // Validate required fields
    if (!text || !subject || !optionA || !optionB || !optionC || !optionD || !correct) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        text,
        subject,
        topic: topic || null,
        difficulty: difficulty || null,
        optionA,
        optionB,
        optionC,
        optionD,
        optionE: optionE || null,
        correct,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
