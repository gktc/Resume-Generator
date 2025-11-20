import { useState } from 'react';
import { InterviewQuestion } from '../types/interview.types';
import AnswerFramework from './AnswerFramework';

interface QuestionCategoryProps {
  title: string;
  description: string;
  questions: InterviewQuestion[];
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const QuestionCategory = ({ title, description, questions, color }: QuestionCategoryProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-900',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'green':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          text: 'text-green-900',
          badge: 'bg-green-100 text-green-800',
        };
      case 'purple':
        return {
          border: 'border-purple-200',
          bg: 'bg-purple-50',
          text: 'text-purple-900',
          badge: 'bg-purple-100 text-purple-800',
        };
      case 'orange':
        return {
          border: 'border-orange-200',
          bg: 'bg-orange-50',
          text: 'text-orange-900',
          badge: 'bg-orange-100 text-orange-800',
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          badge: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${colorClasses.border}`}>
      {/* Category Header */}
      <div className={`${colorClasses.bg} px-6 py-4 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-semibold ${colorClasses.text}`}>{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses.badge}`}>
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-200">
        {questions.map((question, index) => {
          const isExpanded = expandedQuestions.has(question.id);

          return (
            <div key={question.id} className="p-6">
              {/* Question Header */}
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{question.question}</p>
                  {question.relatedContent && (
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Related to:</span> {question.relatedContent}
                    </p>
                  )}
                </div>
                <button
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <AnswerFramework
                    question={question}
                    category={question.category}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCategory;
