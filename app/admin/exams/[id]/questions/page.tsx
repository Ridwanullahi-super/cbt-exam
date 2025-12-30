'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  subject: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correct: string;
}

interface ExamQuestion {
  id: number;
  order: number;
  question: Question;
}

interface AvailableQuestion extends Question {
  isAdded: boolean;
}

export default function ExamQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const [examTitle, setExamTitle] = useState('');
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExamQuestions();
    fetchAvailableQuestions();
  }, [params.id]);

  const fetchExamQuestions = async () => {
    try {
      const response = await fetch(`/api/admin/exams/${params.id}/questions`);
      if (response.ok) {
        const data = await response.json();
        setExamTitle(data.examTitle);
        setExamQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to fetch exam questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (response.ok) {
        const data = await response.json();
        setAvailableQuestions(data.map((q: Question) => ({ ...q, isAdded: false })));
      }
    } catch (error) {
      console.error('Failed to fetch available questions:', error);
    }
  };

  const addQuestion = async (questionId: number) => {
    try {
      const response = await fetch(`/api/admin/exams/${params.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });

      if (response.ok) {
        fetchExamQuestions();
      } else {
        alert('Failed to add question');
      }
    } catch (error) {
      console.error('Failed to add question:', error);
      alert('An error occurred');
    }
  };

  const removeQuestion = async (examQuestionId: number) => {
    if (!confirm('Remove this question from the exam?')) return;

    try {
      const response = await fetch(`/api/admin/exams/${params.id}/questions/${examQuestionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchExamQuestions();
      } else {
        alert('Failed to remove question');
      }
    } catch (error) {
      console.error('Failed to remove question:', error);
      alert('An error occurred');
    }
  };

  const filteredAvailable = availableQuestions.filter((q) => {
    if (filter === 'all') return true;
    return q.subject === filter;
  });

  const addedQuestionIds = new Set(examQuestions.map((eq) => eq.question.id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/admin/exams/${params.id}`} className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Exam
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions: {examTitle}</h1>
          <p className="text-sm text-gray-600 mt-1">{examQuestions.length} questions added</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Exam Questions */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Questions</h2>
              
              {examQuestions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No questions added yet. Add questions from the available pool.
                </p>
              ) : (
                <div className="space-y-3">
                  {examQuestions.map((eq, index) => (
                    <div key={eq.id} className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">Q{index + 1}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {eq.question.subject}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{eq.question.text}</p>
                        </div>
                        <button
                          onClick={() => removeQuestion(eq.id)}
                          className="ml-3 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Questions */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Question Bank</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Subjects</option>
                  {Array.from(new Set(availableQuestions.map((q) => q.subject))).map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredAvailable.map((q) => {
                  const isAdded = addedQuestionIds.has(q.id);
                  return (
                    <div
                      key={q.id}
                      className={`border rounded-lg p-4 ${
                        isAdded ? 'bg-gray-50 border-gray-300' : 'hover:border-indigo-300'
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {q.subject}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{q.text}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Correct: <span className="font-semibold">{q.correct}</span>
                          </div>
                        </div>
                        {isAdded ? (
                          <span className="ml-3 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                            Added
                          </span>
                        ) : (
                          <button
                            onClick={() => addQuestion(q.id)}
                            className="ml-3 px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
