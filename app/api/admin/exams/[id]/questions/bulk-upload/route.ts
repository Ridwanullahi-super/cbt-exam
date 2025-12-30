import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

interface QuestionData {
  text: string;
  subject: string;
  classLevel: string | null;
  term: number | null;
  topic: string | null;
  difficulty: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  correct: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const examId = parseInt(id);

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { id: true, classLevel: true },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileContent = await file.text();
    
    // Parse CSV
    const lines = fileContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: 'File is empty or invalid' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const questions: QuestionData[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length < headers.length) {
        errors.push(`Line ${i + 1}: Incomplete data`);
        continue;
      }

      const question: any = {};
      headers.forEach((header, index) => {
        question[header] = values[index]?.trim().replace(/^"|"$/g, '') || null;
      });

      // Validate required fields
      if (!question.text || !question.subject || !question.optionA || 
          !question.optionB || !question.optionC || !question.optionD || !question.correct) {
        errors.push(`Line ${i + 1}: Missing required fields`);
        continue;
      }

      // Validate correct answer
      const validOptions = ['A', 'B', 'C', 'D', 'E'];
      if (!validOptions.includes(question.correct.toUpperCase())) {
        errors.push(`Line ${i + 1}: Invalid correct answer (must be A, B, C, D, or E)`);
        continue;
      }

      // Convert term to number
      if (question.term) {
        question.term = parseInt(question.term);
      }

      questions.push({
        text: question.text,
        subject: question.subject,
        classLevel: question.classLevel || exam.classLevel || null,
        term: question.term || null,
        topic: question.topic || null,
        difficulty: question.difficulty || null,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        optionE: question.optionE || null,
        correct: question.correct.toUpperCase(),
      });
    }

    if (questions.length === 0) {
      return NextResponse.json({ 
        error: 'No valid questions found in file',
        details: errors.length > 0 ? errors.slice(0, 5) : undefined
      }, { status: 400 });
    }

    // Get the current max order for the exam
    const maxOrder = await prisma.examQuestion.findFirst({
      where: { examId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    let currentOrder = (maxOrder?.order ?? 0);

    // Create questions and add to exam in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdQuestions = [];
      
      for (const questionData of questions) {
        // Create the question
        const question = await tx.question.create({
          data: questionData,
        });

        // Add to exam
        currentOrder++;
        await tx.examQuestion.create({
          data: {
            examId,
            questionId: question.id,
            order: currentOrder,
          },
        });

        createdQuestions.push(question);
      }

      return createdQuestions;
    });

    return NextResponse.json({ 
      success: true, 
      count: result.length,
      message: `Successfully uploaded and added ${result.length} questions to the exam`,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload questions. Please check your file format.',
      details: error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}

// Helper function to parse CSV line handling quoted values with commas
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}
