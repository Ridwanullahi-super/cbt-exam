'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  durationMin: number;
  questionCount: number;
  passMark: number | null;
  scheduledAt: string | null;
  attempts: number;
  maxAttempts: number;
}

interface StudentInfo {
  studentId: string;
  name: string;
  classLevel: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      router.push('/student/login');
      return;
    }

    fetchStudentData(studentId);
    fetchExams(studentId);
  }, [router]);

  const fetchStudentData = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
      } else {
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentName');
        router.push('/student/login');
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    }
  };

  const fetchExams = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/exams`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    router.push('/student/login');
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {student.name} ({student.classLevel})
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">ID: {student.studentId}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Available Exams</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.filter(e => e.attempts < e.maxAttempts).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.filter(e => e.attempts >= e.maxAttempts).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Total Attempts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.reduce((sum, e) => sum + e.attempts, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Exams */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Exams</h2>
          <div className="space-y-4">
            {exams.filter(e => e.attempts < e.maxAttempts).length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium mb-2">No scheduled exams available</p>
                <p className="text-gray-400 text-sm">Check back later or contact your teacher for more information</p>
              </div>
            ) : (
              exams
                .filter(e => e.attempts < e.maxAttempts)
                .map((exam) => (
                  <div key={exam.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                        {exam.description && (
                          <p className="text-gray-600 mb-3">{exam.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>⏱️ {exam.durationMin} minutes</span>
                          <span>❓ {exam.questionCount} questions</span>
                          {exam.passMark && <span>✅ Pass: {exam.passMark}%</span>}
                          <span>📝 Attempts: {exam.attempts}/{exam.maxAttempts}</span>
                        </div>
                      </div>

                      <Link
                        href={`/student/exam/${exam.id}`}
                        className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Start Exam
                      </Link>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Completed Exams */}
        {exams.filter(e => e.attempts >= e.maxAttempts).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Exams</h2>
            <div className="space-y-4">
              {exams
                .filter(e => e.attempts >= e.maxAttempts)
                .map((exam) => (
                  <div key={exam.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>⏱️ {exam.durationMin} minutes</span>
                          <span>❓ {exam.questionCount} questions</span>
                          <span>📝 Attempts: {exam.attempts}/{exam.maxAttempts}</span>
                        </div>
                      </div>

                      <Link
                        href={`/student/results/${exam.id}`}
                        className="ml-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        View Results
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
