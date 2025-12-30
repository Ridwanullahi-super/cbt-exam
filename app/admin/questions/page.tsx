'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  subject: string;
  topic: string | null;
  difficulty: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  correct: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const subjects = Array.from(new Set(questions.map((q) => q.subject)));

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          </div>
          <Link
            href="/admin/questions/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Question
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No questions found</p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                        {question.subject}
                      </span>
                      {question.topic && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {question.topic}
                        </span>
                      )}
                      {question.difficulty && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {question.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium mb-3">{question.text}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className={question.correct === 'A' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        A. {question.optionA}
                      </div>
                      <div className={question.correct === 'B' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        B. {question.optionB}
                      </div>
                      <div className={question.correct === 'C' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        C. {question.optionC}
                      </div>
                      <div className={question.correct === 'D' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        D. {question.optionD}
                      </div>
                      {question.optionE && (
                        <div className={question.correct === 'E' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          E. {question.optionE}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      </main>
    </div>
  );
}
