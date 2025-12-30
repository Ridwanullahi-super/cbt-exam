import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, firstName, lastName, classLevel, section, admissionNo, dob, parentContact, email } = body;

    // Check if student ID already exists
    const existing = await prisma.student.findUnique({
      where: { studentId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 400 }
      );
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        studentId,
        firstName,
        lastName: lastName || null,
        classLevel,
        section: section || null,
        admissionNo: admissionNo || null,
        dob: dob ? new Date(dob) : null,
        parentContact: parentContact || null,
        email: email || null,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
