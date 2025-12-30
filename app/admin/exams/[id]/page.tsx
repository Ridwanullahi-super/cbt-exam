'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  classLevel: string;
  durationMin: number;
  scheduledAt: string | null;
  published: boolean;
  randomize: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
  showResultsImmediately: boolean;
  passMark: number | null;
  allowedAttempts: number;
  _count?: {
    questions: number;
    attempts: number;
  };
}

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [params.id]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/admin/exams/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async () => {
    if (!exam) return;

    try {
      const response = await fetch(`/api/admin/exams/${exam.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !exam.published }),
      });

      if (response.ok) {
        setExam({ ...exam, published: !exam.published });
      } else {
        alert('Failed to update exam status');
      }
    } catch (error) {
      console.error('Failed to publish exam:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
          <Link href="/admin/exams" className="text-indigo-600 hover:text-indigo-500">
            ← Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/exams" className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Exams
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{exam.classLevel}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  exam.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {exam.published ? 'Published' : 'Draft'}
              </span>
              <button
                onClick={togglePublish}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {exam.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Questions</div>
            <div className="text-3xl font-bold text-gray-900">{exam._count?.questions || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Attempts</div>
            <div className="text-3xl font-bold text-gray-900">{exam._count?.attempts || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Duration</div>
            <div className="text-3xl font-bold text-gray-900">{exam.durationMin} min</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Pass Mark</div>
            <div className="text-3xl font-bold text-gray-900">
              {exam.passMark ? `${exam.passMark}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h2>
          
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="text-sm text-gray-900 mt-1">{exam.title}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Class Level</dt>
              <dd className="text-sm text-gray-900 mt-1">{exam.classLevel}</dd>
            </div>
            
            {exam.description && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="text-sm text-gray-900 mt-1">{exam.description}</dd>
              </div>
            )}
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="text-sm text-gray-900 mt-1">{exam.durationMin} minutes</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Allowed Attempts</dt>
              <dd className="text-sm text-gray-900 mt-1">{exam.allowedAttempts}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Pass Mark</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {exam.passMark ? `${exam.passMark}%` : 'Not set'}
              </dd>
            </div>
            
            {exam.scheduledAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {new Date(exam.scheduledAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Settings</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-700">Randomize question order</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                exam.randomize ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {exam.randomize ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-700">Shuffle answer options</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                exam.shuffleOptions ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {exam.shuffleOptions ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-700">Negative marking</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                exam.negativeMarking ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {exam.negativeMarking ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Show results immediately</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                exam.showResultsImmediately ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {exam.showResultsImmediately ? 'Yes' : 'Hidden'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/results?exam=${exam.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Results
            </Link>
            
            <Link
              href={`/admin/exams/${exam.id}/questions`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Questions
            </Link>
            
            <button
              onClick={() => router.push(`/admin/exams/${exam.id}/edit`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Exam
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
