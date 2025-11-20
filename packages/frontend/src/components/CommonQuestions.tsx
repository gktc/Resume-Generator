import React, { useState } from 'react';

interface Question {
  question: string;
  frequency: number;
  category: string;
}

interface CommonQuestionsProps {
  questions: Question[];
}

const categoryColors: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-800',
  behavioral: 'bg-green-100 text-green-800',
  'system-design': 'bg-purple-100 text-purple-800',
  experience: 'bg-yellow-100 text-yellow-800',
  'role-specific': 'bg-pink-100 text-pink-800',
  general: 'bg-gray-100 text-gray-800',
};

const CommonQuestions: React.FC<CommonQuestionsProps> = ({ questions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(questions.map(q => q.category)))];

  // Filter questions by category
  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  // Sort by frequency (descending)
  const sortedQuestions = [...filteredQuestions].sort((a, b) => b.frequency - a.frequency);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Interview Questions</h2>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All' : category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Questions list */}
      {sortedQuestions.length > 0 ? (
        <div className="space-y-4">
          {sortedQuestions.map((q, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">{q.question}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        categoryColors[q.category] || categoryColors.general
                      }`}
                    >
                      {q.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-500 mb-1">Asked by</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {q.frequency} {q.frequency === 1 ? 'person' : 'people'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600">No questions available for this category</p>
        </div>
      )}
    </div>
  );
};

export default CommonQuestions;
