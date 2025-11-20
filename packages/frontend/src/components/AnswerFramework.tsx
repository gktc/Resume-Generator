import { useState } from 'react';
import { InterviewQuestion } from '../types/interview.types';

interface AnswerFrameworkProps {
  question: InterviewQuestion;
  category: string;
}

const AnswerFramework = ({ question, category }: AnswerFrameworkProps) => {
  const [copiedQuestion, setCopiedQuestion] = useState(false);
  const [copiedFramework, setCopiedFramework] = useState(false);

  const copyToClipboard = async (text: string, type: 'question' | 'framework') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'question') {
        setCopiedQuestion(true);
        setTimeout(() => setCopiedQuestion(false), 2000);
      } else {
        setCopiedFramework(true);
        setTimeout(() => setCopiedFramework(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderSTARMethod = () => {
    if (category !== 'behavioral') return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">STAR Method Structure</h4>
        <div className="space-y-3">
          <div className="flex">
            <div className="flex-shrink-0 w-24">
              <span className="inline-flex items-center justify-center w-20 h-8 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Situation
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-2">
              Set the context by describing the situation or challenge you faced
            </p>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 w-24">
              <span className="inline-flex items-center justify-center w-20 h-8 bg-green-100 text-green-800 text-xs font-medium rounded">
                Task
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-2">
              Explain your specific responsibility or goal in that situation
            </p>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 w-24">
              <span className="inline-flex items-center justify-center w-20 h-8 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                Action
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-2">
              Describe the specific actions you took to address the task
            </p>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 w-24">
              <span className="inline-flex items-center justify-center w-20 h-8 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                Result
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-2">
              Share the outcomes and what you learned from the experience
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAnswerFramework = () => {
    if (!question.answerFramework) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Suggested Answer Structure</h4>
          <button
            onClick={() => copyToClipboard(question.answerFramework || '', 'framework')}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
          >
            {copiedFramework ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Framework
              </>
            )}
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.answerFramework}</p>
        </div>
      </div>
    );
  };

  const renderTalkingPoints = () => {
    if (!question.talkingPoints || question.talkingPoints.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Talking Points</h4>
        <ul className="space-y-2">
          {question.talkingPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Answer Guidance</h3>
        <button
          onClick={() => copyToClipboard(question.question, 'question')}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          {copiedQuestion ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Question
            </>
          )}
        </button>
      </div>

      {renderSTARMethod()}
      {renderAnswerFramework()}
      {renderTalkingPoints()}

      {/* Tips Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Pro Tip:</span> Practice your answer out loud and time
                yourself. Aim for 1-2 minutes for most questions, and 3-4 minutes for complex
                technical or experience-based questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerFramework;
