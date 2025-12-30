'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
}

interface ExamData {
  id: number;
  title: string;
  durationMin: number;
  questions: Question[];
}

export default function TakeExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [exam, setExam] = useState<ExamData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      router.push('/student/login');
      return;
    }

    startExam(studentId);
  }, [examId, router]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const startExam = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/exams/${examId}/start`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setExam(data.exam);
        setAttemptId(data.attemptId);
        setTimeRemaining(data.exam.durationMin * 60);
      } else {
        alert('Failed to start exam');
        router.push('/student/dashboard');
      }
    } catch (error) {
      console.error('Failed to start exam:', error);
      alert('An error occurred');
      router.push('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!attemptId) return;

    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    try {
      const response = await fetch(`/api/students/${studentId}/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          answers: Object.entries(answers).map(([questionId, selected]) => ({
            questionId: parseInt(questionId),
            selected,
          })),
          autoSubmitted: autoSubmit,
        }),
      });

      if (response.ok) {
        router.push(`/student/results/${examId}`);
      } else {
        alert('Failed to submit exam');
      }
    } catch (error) {
      console.error('Failed to submit exam:', error);
      alert('An error occurred while submitting');
    }
  };

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-600">Time Remaining</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Navigation */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : answers[exam.questions[index].id]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{question.text}</h2>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D', 'E'].map((option) => {
              const optionText = question[`option${option}` as keyof Question];
              if (!optionText) return null;

              return (
                <label
                  key={option}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[question.id] === option
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() =>
                      setAnswers({ ...answers, [question.id]: option })
                    }
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-900">
                    <strong>{option}.</strong> {optionText as string}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600">
            {Object.keys(answers).length} of {exam.questions.length} answered
          </div>

          {currentQuestion < exam.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to submit your exam?')) {
                  handleSubmit();
                }
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Exam
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
