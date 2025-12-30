'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BulkUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid CSV or Excel file');
        setFile(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/questions/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully uploaded ${data.count} questions!`);
        setFile(null);
        setTimeout(() => {
          router.push('/admin/questions');
        }, 2000);
      } else {
        setError(data.error || 'Failed to upload questions');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/questions" className="text-indigo-600 hover:text-indigo-500 text-sm mb-1 inline-block">
            ← Back to Questions
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Questions</h1>
          <p className="text-sm text-gray-600 mt-1">Upload multiple questions from CSV or Excel file</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Upload Instructions</h2>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Download the CSV template below</li>
              <li>Fill in your questions following the format</li>
              <li>Save the file as CSV or Excel (.csv, .xlsx, .xls)</li>
              <li>Upload the file using the form below</li>
            </ol>
          </div>

          {/* CSV Format Guide */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">CSV Column Format</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Column</th>
                    <th className="px-3 py-2 text-left border-b">Required</th>
                    <th className="px-3 py-2 text-left border-b">Format</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b">text</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Question text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">subject</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Mathematics, English, Physics, etc.</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">classLevel</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">JSS1, JSS2, JSS3, SS1, SS2, SS3</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">term</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">1, 2, or 3</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">topic</td>
                    <td className="px-3 py-2 border-b">No</td>
                    <td className="px-3 py-2 border-b">Topic name</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">difficulty</td>
                    <td className="px-3 py-2 border-b">No</td>
                    <td className="px-3 py-2 border-b">Easy, Medium, Hard</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">optionA</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Option A text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">optionB</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Option B text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">optionC</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Option C text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">optionD</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">Option D text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">optionE</td>
                    <td className="px-3 py-2 border-b">No</td>
                    <td className="px-3 py-2 border-b">Option E text (leave empty if not needed)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">correct</td>
                    <td className="px-3 py-2 border-b">Yes</td>
                    <td className="px-3 py-2 border-b">A, B, C, D, or E</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Template Button */}
          <button
            onClick={downloadTemplate}
            className="w-full mb-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📥 Download CSV Template
          </button>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>
              <input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-semibold">{file.name}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Questions'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
