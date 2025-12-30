import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Admin accounts
  console.log('Creating admin accounts...');
  
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'Super Administrator',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✓ Super Admin created:', superAdmin.email);

  const examAdmin = await prisma.admin.upsert({
    where: { email: 'examadmin@school.com' },
    update: {},
    create: {
      email: 'examadmin@school.com',
      name: 'Exam Administrator',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'EXAM_ADMIN',
    },
  });
  console.log('✓ Exam Admin created:', examAdmin.email);

  // Create Student accounts
  console.log('\nCreating student accounts...');

  const students = [
    // JSS1 Students
    {
      studentId: 'STU2024001',
      firstName: 'Chinedu',
      lastName: 'Okafor',
      classLevel: 'JSS1',
      section: 'A',
      admissionNo: 'ADM/2024/001',
      email: 'chinedu.okafor@student.school.com',
    },
    {
      studentId: 'STU2024002',
      firstName: 'Aisha',
      lastName: 'Ibrahim',
      classLevel: 'JSS1',
      section: 'A',
      admissionNo: 'ADM/2024/002',
      email: 'aisha.ibrahim@student.school.com',
    },
    {
      studentId: 'STU2024003',
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      classLevel: 'JSS1',
      section: 'B',
      admissionNo: 'ADM/2024/003',
    },
    // JSS2 Students
    {
      studentId: 'STU2024004',
      firstName: 'Fatima',
      lastName: 'Mohammed',
      classLevel: 'JSS2',
      section: 'A',
      admissionNo: 'ADM/2024/004',
    },
    {
      studentId: 'STU2024005',
      firstName: 'Emmanuel',
      lastName: 'Nwosu',
      classLevel: 'JSS2',
      section: 'A',
      admissionNo: 'ADM/2024/005',
    },
    // JSS3 Students
    {
      studentId: 'STU2024006',
      firstName: 'Blessing',
      lastName: 'Eze',
      classLevel: 'JSS3',
      section: 'A',
      admissionNo: 'ADM/2024/006',
    },
    {
      studentId: 'STU2024007',
      firstName: 'Abdullahi',
      lastName: 'Musa',
      classLevel: 'JSS3',
      section: 'B',
      admissionNo: 'ADM/2024/007',
    },
    // SS1 Students
    {
      studentId: 'STU2024008',
      firstName: 'Chioma',
      lastName: 'Okonkwo',
      classLevel: 'SS1',
      section: 'A',
      admissionNo: 'ADM/2024/008',
    },
    {
      studentId: 'STU2024009',
      firstName: 'Ibrahim',
      lastName: 'Bello',
      classLevel: 'SS1',
      section: 'A',
      admissionNo: 'ADM/2024/009',
    },
    // SS3 Students
    {
      studentId: 'STU2024010',
      firstName: 'Funmilayo',
      lastName: 'Adeleke',
      classLevel: 'SS3',
      section: 'A',
      admissionNo: 'ADM/2024/010',
      email: 'funmilayo.adeleke@student.school.com',
    },
    {
      studentId: 'STU2024011',
      firstName: 'Yusuf',
      lastName: 'Ahmed',
      classLevel: 'SS3',
      section: 'A',
      admissionNo: 'ADM/2024/011',
      email: 'yusuf.ahmed@student.school.com',
    },
    {
      studentId: 'STU2024012',
      firstName: 'Ngozi',
      lastName: 'Okoro',
      classLevel: 'SS3',
      section: 'B',
      admissionNo: 'ADM/2024/012',
    },
  ];

  for (const studentData of students) {
    const student = await prisma.student.upsert({
      where: { studentId: studentData.studentId },
      update: {},
      create: studentData,
    });
    console.log(`✓ Student created: ${student.studentId} - ${student.firstName} ${student.lastName} (${student.classLevel})`);
  }

  // Create Session/Term
  console.log('\nCreating session/term...');
  const sessionTerm = await prisma.sessionTerm.upsert({
    where: { id: 1 },
    update: {},
    create: {
      session: '2024/2025',
      term: 1,
    },
  });
  console.log('✓ Session/Term created: 2024/2025 - First Term');

  // Create sample questions
  console.log('\nCreating sample questions...');

  const mathQuestions = [
    {
      text: 'What is the value of 12 + 15?',
      subject: 'Mathematics',
      topic: 'Addition',
      difficulty: 'Easy',
      optionA: '25',
      optionB: '27',
      optionC: '28',
      optionD: '30',
      correct: 'B',
    },
    {
      text: 'Solve for x: 2x + 5 = 15',
      subject: 'Mathematics',
      topic: 'Algebra',
      difficulty: 'Medium',
      optionA: '5',
      optionB: '7',
      optionC: '10',
      optionD: '8',
      correct: 'A',
    },
    {
      text: 'What is the area of a rectangle with length 8cm and width 5cm?',
      subject: 'Mathematics',
      topic: 'Geometry',
      difficulty: 'Easy',
      optionA: '13 cm²',
      optionB: '26 cm²',
      optionC: '40 cm²',
      optionD: '45 cm²',
      correct: 'C',
    },
    {
      text: 'What is 25% of 200?',
      subject: 'Mathematics',
      topic: 'Percentages',
      difficulty: 'Easy',
      optionA: '25',
      optionB: '40',
      optionC: '50',
      optionD: '75',
      correct: 'C',
    },
    {
      text: 'If a triangle has angles 60° and 80°, what is the third angle?',
      subject: 'Mathematics',
      topic: 'Geometry',
      difficulty: 'Medium',
      optionA: '30°',
      optionB: '40°',
      optionC: '50°',
      optionD: '60°',
      correct: 'B',
    },
  ];

  const englishQuestions = [
    {
      text: 'Choose the correct spelling:',
      subject: 'English',
      topic: 'Spelling',
      difficulty: 'Easy',
      optionA: 'Recieve',
      optionB: 'Receive',
      optionC: 'Recive',
      optionD: 'Receeve',
      correct: 'B',
    },
    {
      text: 'What is the plural of "child"?',
      subject: 'English',
      topic: 'Grammar',
      difficulty: 'Easy',
      optionA: 'Childs',
      optionB: 'Childes',
      optionC: 'Children',
      optionD: 'Childrens',
      correct: 'C',
    },
    {
      text: 'Identify the verb in this sentence: "The cat sleeps on the mat."',
      subject: 'English',
      topic: 'Grammar',
      difficulty: 'Easy',
      optionA: 'cat',
      optionB: 'sleeps',
      optionC: 'on',
      optionD: 'mat',
      correct: 'B',
    },
    {
      text: 'What type of word is "quickly"?',
      subject: 'English',
      topic: 'Parts of Speech',
      difficulty: 'Medium',
      optionA: 'Noun',
      optionB: 'Verb',
      optionC: 'Adjective',
      optionD: 'Adverb',
      correct: 'D',
    },
    {
      text: 'Choose the sentence with correct punctuation:',
      subject: 'English',
      topic: 'Punctuation',
      difficulty: 'Medium',
      optionA: 'I went to the store and bought bread milk and eggs',
      optionB: 'I went to the store and bought bread, milk, and eggs.',
      optionC: 'I went to the store and bought bread milk and eggs.',
      optionD: 'I went to the store and bought, bread milk and eggs.',
      correct: 'B',
    },
  ];

  const createdQuestions = [];

  for (const q of mathQuestions) {
    const question = await prisma.question.create({ data: q });
    createdQuestions.push(question);
    console.log(`✓ Question created: ${question.subject} - ${question.text.substring(0, 50)}...`);
  }

  for (const q of englishQuestions) {
    const question = await prisma.question.create({ data: q });
    createdQuestions.push(question);
    console.log(`✓ Question created: ${question.subject} - ${question.text.substring(0, 50)}...`);
  }

  // Create sample exams
  console.log('\nCreating sample exams...');

  // JSS1 Math Exam (scheduled for now - accessible)
  const jss1MathExam = await prisma.exam.create({
    data: {
      title: 'JSS1 First Term Mathematics Exam',
      description: 'First term examination covering basic arithmetic and introduction to algebra',
      classLevel: 'JSS1',
      sessionTermId: sessionTerm.id,
      durationMin: 45,
      published: true,
      scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Scheduled yesterday
      randomize: true,
      shuffleOptions: true,
      passMark: 50,
      allowedAttempts: 1,
    },
  });

  // Add questions to JSS1 Math exam
  for (let i = 0; i < 5; i++) {
    if (mathQuestions[i]) {
      await prisma.examQuestion.create({
        data: {
          examId: jss1MathExam.id,
          questionId: createdQuestions[i].id,
          order: i + 1,
        },
      });
    }
  }
  console.log(`✓ Exam created: ${jss1MathExam.title} (${jss1MathExam.classLevel})`);

  // SS3 English Exam (scheduled for now - accessible)
  const ss3EnglishExam = await prisma.exam.create({
    data: {
      title: 'SS3 Final English Language Test',
      description: 'Comprehensive English language assessment for SS3 students',
      classLevel: 'SS3',
      sessionTermId: sessionTerm.id,
      durationMin: 60,
      published: true,
      scheduledAt: new Date(), // Scheduled now
      randomize: false,
      shuffleOptions: true,
      passMark: 60,
      allowedAttempts: 2,
    },
  });

  // Add questions to SS3 English exam
  for (let i = 0; i < 5; i++) {
    if (englishQuestions[i]) {
      await prisma.examQuestion.create({
        data: {
          examId: ss3EnglishExam.id,
          questionId: createdQuestions[i + 5].id,
          order: i + 1,
        },
      });
    }
  }
  console.log(`✓ Exam created: ${ss3EnglishExam.title} (${ss3EnglishExam.classLevel})`);

  // JSS2 Exam (NOT scheduled yet - not accessible to students)
  const jss2Exam = await prisma.exam.create({
    data: {
      title: 'JSS2 Mathematics Mid-Term Test',
      description: 'Mid-term assessment for JSS2 Mathematics',
      classLevel: 'JSS2',
      sessionTermId: sessionTerm.id,
      durationMin: 40,
      published: true,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Scheduled in 7 days
      randomize: true,
      shuffleOptions: true,
      passMark: 50,
      allowedAttempts: 1,
    },
  });
  console.log(`✓ Exam created (future): ${jss2Exam.title} (${jss2Exam.classLevel})`);

  console.log('\n✅ Database seeding completed successfully!\n');
  
  console.log('📋 Login Credentials:\n');
  console.log('ADMIN ACCOUNTS:');
  console.log('  Super Admin:');
  console.log('    Email: admin@school.com');
  console.log('    Password: Admin@123\n');
  console.log('  Exam Admin:');
  console.log('    Email: examadmin@school.com');
  console.log('    Password: Admin@123\n');
  
  console.log('STUDENT ACCOUNTS (No password required - use Student ID):');
  console.log('  JSS1: STU2024001, STU2024002, STU2024003');
  console.log('  JSS2: STU2024004, STU2024005');
  console.log('  JSS3: STU2024006, STU2024007');
  console.log('  SS1: STU2024008, STU2024009');
  console.log('  SS3: STU2024010, STU2024011, STU2024012\n');
  
  console.log('SCHEDULED EXAMS:');
  console.log('  ✓ JSS1 students can access: JSS1 First Term Mathematics Exam');
  console.log('  ✓ SS3 students can access: SS3 Final English Language Test');
  console.log('  ⏳ JSS2 exam scheduled for future (not yet accessible)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
