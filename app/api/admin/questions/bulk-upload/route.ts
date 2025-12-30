import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length < headers.length) continue;

      const question: any = {};
      headers.forEach((header, index) => {
        question[header] = values[index]?.trim().replace(/^"|"$/g, '') || null;
      });

      // Validate required fields
      if (!question.text || !question.subject || !question.optionA || 
          !question.optionB || !question.optionC || !question.optionD || !question.correct) {
        continue;
      }

      // Convert term to number
      if (question.term) {
        question.term = parseInt(question.term);
      }

      questions.push({
        text: question.text,
        subject: question.subject,
        classLevel: question.classLevel || null,
        term: question.term || null,
        topic: question.topic || null,
        difficulty: question.difficulty || null,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        optionE: question.optionE || null,
        correct: question.correct,
      });
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No valid questions found in file' }, { status: 400 });
    }

    // Bulk insert questions
    const result = await prisma.question.createMany({
      data: questions,
      skipDuplicates: true,
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `Successfully uploaded ${result.count} questions`
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload questions. Please check your file format.' 
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
