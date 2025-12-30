import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.sessionTerm.findMany({
      include: {
        _count: {
          select: { exams: true },
        },
      },
      orderBy: [
        { session: 'desc' },
        { term: 'asc' },
      ],
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { session: academicSession, term } = await request.json();

    // Check if session/term combo already exists
    const existing = await prisma.sessionTerm.findFirst({
      where: {
        session: academicSession,
        term,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This session and term combination already exists' },
        { status: 400 }
      );
    }

    const newSession = await prisma.sessionTerm.create({
      data: {
        session: academicSession,
        term,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
