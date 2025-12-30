'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('studentId', data.studentId);
        localStorage.setItem('studentName', data.name);
        router.push('/student/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid student ID');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Login</h1>
          <p className="text-gray-600">Enter your student ID to access exams</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              id="studentId"
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-semibold tracking-wider"
              placeholder="STU2024001"
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the student ID provided by your school
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Access My Exams'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/admin/login" className="block text-sm text-gray-600 hover:text-gray-900">
            Are you an admin? <span className="text-indigo-600 font-medium">Click here</span>
          </Link>
          <Link href="/" className="block text-sm text-green-600 hover:text-green-500">
            ← Back to Home
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Student IDs:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>JSS1:</strong> STU2024001, STU2024002</p>
            <p><strong>SS3:</strong> STU2024010, STU2024011</p>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">
            You'll only see exams scheduled for your class level
          </p>
        </div>
      </div>
    </div>
  );
}
