'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  subject: string;
  classLevel?: string;
  term?: number;
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
  const [classLevel, setClassLevel] = useState('');
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

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
        setClassLevel(data.classLevel || '');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls') {
        setUploadFile(selectedFile);
        setUploadError('');
      } else {
        setUploadError('Please select a valid CSV or Excel file');
        setUploadFile(null);
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'text,subject,classLevel,term,topic,difficulty,optionA,optionB,optionC,optionD,optionE,correct\n' +
      '"What is 2+2?",Mathematics,JSS1,1,Arithmetic,Easy,3,4,5,6,,B\n' +
      '"Capital of Nigeria?",Geography,SS1,2,African Geography,Medium,Lagos,Abuja,Kano,Port Harcourt,,B';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch(`/api/admin/exams/${params.id}/questions/bulk-upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadSuccess(`Successfully uploaded ${data.count} questions!`);
        setUploadFile(null);
        fetchExamQuestions();
        setTimeout(() => {
          setShowBulkUpload(false);
          setUploadSuccess('');
        }, 2000);
      } else {
        setUploadError(data.error || 'Failed to upload questions');
        if (data.details) {
          console.error('Upload errors:', data.details);
        }
      }
    } catch (err) {
      setUploadError('An error occurred. Please try again.');
    } finally {
      setUploading(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/admin/exams/${params.id}`} className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Exam
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Questions: {examTitle}</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-gray-600">{examQuestions.length} questions added</p>
                {classLevel && (
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {classLevel}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkUpload(!showBulkUpload)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                📤 Bulk Upload
              </button>
              <Link
                href="/admin/questions/create"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Create New Question
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Questions</h2>
              <button
                onClick={() => setShowBulkUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
                {uploadSuccess}
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={downloadTemplate}
                className="text-indigo-600 hover:text-indigo-800 text-sm underline"
              >
                📥 Download CSV Template
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Download the template to see the required format
              </p>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV or Excel File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer"
                />
                {uploadFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Columns:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>text</strong> - The question text</li>
                  <li>• <strong>subject</strong> - Subject name</li>
                  <li>• <strong>optionA, optionB, optionC, optionD</strong> - Answer options</li>
                  <li>• <strong>correct</strong> - Correct answer (A, B, C, D, or E)</li>
                </ul>
                <h4 className="text-sm font-semibold text-blue-900 mt-3 mb-2">Optional Columns:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>classLevel</strong> - Class level (e.g., JSS1, SS2)</li>
                  <li>• <strong>term</strong> - Term number (1, 2, or 3)</li>
                  <li>• <strong>topic</strong> - Topic or subtopic</li>
                  <li>• <strong>difficulty</strong> - Difficulty level</li>
                  <li>• <strong>optionE</strong> - Fifth option (if needed)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload Questions'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkUpload(false);
                    setUploadFile(null);
                    setUploadError('');
                    setUploadSuccess('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                            {eq.question.classLevel && (
                              <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                {eq.question.classLevel}
                              </span>
                            )}
                            {eq.question.term && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                Term {eq.question.term}
                              </span>
                            )}
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
                            {q.classLevel && (
                              <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                {q.classLevel}
                              </span>
                            )}
                            {q.term && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                Term {q.term}
                              </span>
                            )}
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
