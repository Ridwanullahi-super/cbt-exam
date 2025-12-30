import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json();

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        classLevel: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      studentId: student.studentId,
      name: `${student.firstName} ${student.lastName || ''}`.trim(),
      classLevel: student.classLevel,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
