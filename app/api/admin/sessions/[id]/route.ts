import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const sessionId = parseInt(id);

    // Check if there are exams associated
    const sessionTerm = await prisma.sessionTerm.findUnique({
      where: { id: sessionId },
      include: {
        _count: {
          select: { exams: true },
        },
      },
    });

    if (!sessionTerm) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (sessionTerm._count.exams > 0) {
      return NextResponse.json(
        { error: 'Cannot delete session with associated exams' },
        { status: 400 }
      );
    }

    await prisma.sessionTerm.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
