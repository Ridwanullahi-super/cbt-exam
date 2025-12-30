'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuestionInput {
  questionId: number;
  order: number;
}

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classLevel: 'JSS1',
    durationMin: 60,
    passMark: 50,
    allowedAttempts: 1,
    randomize: false,
    shuffleOptions: true,
    negativeMarking: false,
    showResultsImmediately: true,
    published: false,
    scheduledDate: '',
    scheduledTime: '',
  });

  const classLevels = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time into scheduledAt
      const scheduledAt = formData.scheduledDate && formData.scheduledTime
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
        : null;

      const submitData = {
        ...formData,
        scheduledAt,
      };

      const response = await fetch('/api/admin/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to questions management page to add questions immediately
        router.push(`/admin/exams/${data.id}/questions`);
      } else {
        alert('Failed to create exam');
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/exams" className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Exams
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., First Term Mathematics Exam"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of the exam"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Class Level *
                  </label>
                  <select
                    id="classLevel"
                    required
                    value={formData.classLevel}
                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {classLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="durationMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    id="durationMin"
                    type="number"
                    required
                    min="1"
                    value={formData.durationMin}
                    onChange={(e) => setFormData({ ...formData, durationMin: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="passMark" className="block text-sm font-medium text-gray-700 mb-1">
                    Pass Mark (%)
                  </label>
                  <input
                    id="passMark"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passMark}
                    onChange={(e) => setFormData({ ...formData, passMark: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="allowedAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Attempts
                  </label>
                  <input
                    id="allowedAttempts"
                    type="number"
                    min="1"
                    value={formData.allowedAttempts}
                    onChange={(e) => setFormData({ ...formData, allowedAttempts: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exam Scheduling */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Exam</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date *
                </label>
                <input
                  id="scheduledDate"
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  id="scheduledTime"
                  type="time"
                  required
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Students will only see this exam after the scheduled date and time.
            </p>
          </div>

          {/* Exam Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Settings</h2>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.randomize}
                  onChange={(e) => setFormData({ ...formData, randomize: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Randomize question order for each student
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Shuffle answer options
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={(e) => setFormData({ ...formData, negativeMarking: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable negative marking for wrong answers
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showResultsImmediately}
                  onChange={(e) => setFormData({ ...formData, showResultsImmediately: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show results to students immediately after submission
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Publish immediately (students can access)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Note: After creating the exam, you'll be able to add questions from the question bank.
          </p>
        </form>
      </main>
    </div>
  );
}
