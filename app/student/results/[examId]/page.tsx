'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Attempt {
  id: number;
  score: number;
  submittedAt: string;
  autoSubmitted: boolean;
  correctAnswers: number;
  totalQuestions: number;
}

interface ExamResult {
  examTitle: string;
  passMark: number | null;
  attempts: Attempt[];
}

export default function StudentResultsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [results, setResults] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      router.push('/student/login');
      return;
    }

    fetchResults(studentId);
  }, [examId, router]);

  const fetchResults = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/exams/${examId}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert('Failed to load results');
        router.push('/student/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      alert('An error occurred');
      router.push('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const latestAttempt = results.attempts[0];
  const passed = results.passMark ? latestAttempt.score >= results.passMark : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/student/dashboard"
            className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-600">{results.examTitle}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Latest Result Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Score</h2>
            <div
              className={`text-6xl font-bold mb-4 ${
                passed === true
                  ? 'text-green-600'
                  : passed === false
                  ? 'text-red-600'
                  : 'text-indigo-600'
              }`}
            >
              {latestAttempt.score.toFixed(1)}%
            </div>
            
            {passed !== null && (
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  passed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {passed ? '✓ Passed' : '✗ Failed'}
                {results.passMark && ` (Pass Mark: ${results.passMark}%)`}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestAttempt.correctAnswers}/{latestAttempt.totalQuestions}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(latestAttempt.submittedAt).toLocaleString()}
                </p>
                {latestAttempt.autoSubmitted && (
                  <p className="text-xs text-orange-600 mt-1">(Auto-submitted)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Attempts */}
        {results.attempts.length > 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Attempts ({results.attempts.length})
            </h3>
            <div className="space-y-3">
              {results.attempts.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Attempt #{results.attempts.length - index}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(attempt.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {attempt.score.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {attempt.correctAnswers}/{attempt.totalQuestions} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/student/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
