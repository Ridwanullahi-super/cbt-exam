'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Answer {
  questionId: number;
  selected: string;
  isCorrect: boolean;
  mark: number;
}

interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correct: string;
}

interface Result {
  id: number;
  student: {
    studentId: string;
    firstName: string;
    lastName: string | null;
    classLevel: string;
  };
  exam: {
    title: string;
    durationMin: number;
    passMark: number | null;
    questions: Array<{
      question: Question;
    }>;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string | null;
  autoSubmitted: boolean;
  answers: Answer[];
}

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [params.id]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/admin/results/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to fetch result:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOptionLabel = (option: string) => {
    const labels: { [key: string]: string } = {
      A: 'A',
      B: 'B',
      C: 'C',
      D: 'D',
      E: 'E',
    };
    return labels[option] || option;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Result Not Found</h2>
          <Link href="/admin/results" className="text-indigo-600 hover:text-indigo-500">
            ← Back to Results
          </Link>
        </div>
      </div>
    );
  }

  const timeTaken = result.submittedAt
    ? Math.floor((new Date(result.submittedAt).getTime() - new Date(result.startedAt).getTime()) / 60000)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/results" className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Results
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Exam Result Details</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student & Exam Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">
                    {result.student.firstName} {result.student.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                  <dd className="text-sm text-gray-900">{result.student.studentId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Class</dt>
                  <dd className="text-sm text-gray-900">{result.student.classLevel}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Exam Title</dt>
                  <dd className="text-sm text-gray-900">{result.exam.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Taken</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(result.startedAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="text-sm text-gray-900">
                    {result.exam.durationMin} minutes (Used: {timeTaken} min)
                  </dd>
                </div>
                {result.autoSubmitted && (
                  <div>
                    <dd className="text-sm text-amber-600 font-medium">⚠️ Auto-submitted (Time expired)</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Score</div>
            <div className="text-3xl font-bold text-gray-900">
              {result.score}/{result.totalQuestions}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Percentage</div>
            <div className="text-3xl font-bold text-gray-900">{result.percentage.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Pass Mark</div>
            <div className="text-3xl font-bold text-gray-900">
              {result.exam.passMark ? `${result.exam.passMark}%` : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="text-2xl font-bold">
              {result.passed ? (
                <span className="text-green-600">PASSED</span>
              ) : (
                <span className="text-red-600">FAILED</span>
              )}
            </div>
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Answer Review</h2>
          <div className="space-y-6">
            {result.exam.questions.map((item, index) => {
              const answer = result.answers.find((a) => a.questionId === item.question.id);
              const question = item.question;

              return (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 ${
                    answer?.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Question {index + 1}</span>
                      {answer?.isCorrect ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          ✗ Wrong
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4">{question.text}</p>

                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D', 'E'].map((option) => {
                      const optionKey = `option${option}` as keyof Question;
                      const optionText = question[optionKey];
                      if (!optionText) return null;

                      const isCorrect = question.correct === option;
                      const isSelected = answer?.selected === option;

                      return (
                        <div
                          key={option}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'border-green-500 bg-green-100'
                              : isSelected
                              ? 'border-red-500 bg-red-100'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{option}.</span>
                            <span>{optionText}</span>
                            {isCorrect && (
                              <span className="ml-auto text-green-600 font-semibold">✓ Correct Answer</span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="ml-auto text-red-600 font-semibold">Your Answer</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
