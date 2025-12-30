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

    const [totalStudents, totalExams, totalQuestions, activeExams] = await Promise.all([
      prisma.student.count(),
      prisma.exam.count(),
      prisma.question.count(),
      prisma.exam.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      totalStudents,
      totalExams,
      totalQuestions,
      activeExams,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
