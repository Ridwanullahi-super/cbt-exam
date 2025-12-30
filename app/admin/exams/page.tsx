'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  classLevel: string;
  durationMin: number;
  published: boolean;
  scheduledAt: string | null;
  questionCount: number;
  attemptCount: number;
}

export default function AdminExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/admin/exams');
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

  const filteredExams = exams.filter((exam) => {
    if (filter === 'published') return exam.published;
    if (filter === 'draft') return !exam.published;
    return true;
  });

  const togglePublish = async (examId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          </div>
          <Link
            href="/admin/exams/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Create New Exam
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Exams ({exams.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'published'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Published ({exams.filter((e) => e.published).length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'draft'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Drafts ({exams.filter((e) => !e.published).length})
          </button>
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          {filteredExams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No exams found</p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exam.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {exam.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {exam.description && (
                      <p className="text-gray-600 mb-3">{exam.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📚 {exam.classLevel}</span>
                      <span>⏱️ {exam.durationMin} minutes</span>
                      <span>❓ {exam.questionCount} questions</span>
                      <span>👥 {exam.attemptCount} attempts</span>
                      {exam.scheduledAt && (
                        <span>📅 {new Date(exam.scheduledAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/exams/${exam.id}`)}
                      className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/admin/exams/${exam.id}/results`)}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Results
                    </button>
                    <button
                      onClick={() => togglePublish(exam.id, exam.published)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        exam.published
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {exam.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
