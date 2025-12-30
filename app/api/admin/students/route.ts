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

    const students = await prisma.student.findMany({
      include: {
        attempts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedStudents = students.map((student) => ({
      id: student.id,
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      classLevel: student.classLevel,
      email: student.email,
      attemptCount: student.attempts.length,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
