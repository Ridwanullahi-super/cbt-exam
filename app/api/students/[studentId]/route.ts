import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const student = await prisma.student.findUnique({
      where: { studentId },
      select: {
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
