import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, questionId } = await params;
    const examQuestionId = parseInt(questionId);

    await prisma.examQuestion.delete({
      where: { id: examQuestionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove question from exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
