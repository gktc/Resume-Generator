import { ATSScore } from '../types/resume.types';

interface ATSScoreDisplayProps {
  atsScore: ATSScore;
}

const ATSScoreDisplay = ({ atsScore }: ATSScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const breakdownItems = [
    { label: 'Keyword Match', score: atsScore.breakdown.keywordMatch, icon: '🔑' },
    { label: 'Experience Relevance', score: atsScore.breakdown.experienceRelevance, icon: '💼' },
    { label: 'Format Parseability', score: atsScore.breakdown.formatParseability, icon: '📄' },
    { label: 'Education Match', score: atsScore.breakdown.educationMatch, icon: '🎓' },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score - Circular Progress */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h3>
            <p className="text-gray-600">
              How well your resume will perform with Applicant Tracking Systems
            </p>
          </div>

          {/* Circular Progress Indicator */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - atsScore.overall / 100)}`}
                className={`${
                  atsScore.overall >= 80
                    ? 'text-green-500'
                    : atsScore.overall >= 60
                    ? 'text-yellow-500'
                    : 'text-red-500'
                } transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(atsScore.overall)}`}>
                {atsScore.overall}
              </span>
              <span className="text-sm text-gray-600 font-medium">
                {getScoreLabel(atsScore.overall)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdownItems.map((item) => (
            <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{item.icon}</span>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    item.score >= 80
                      ? 'bg-green-500'
                      : item.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      {atsScore.missingKeywords.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Missing Keywords ({atsScore.missingKeywords.length})
          </h4>
          <p className="text-sm text-yellow-800 mb-3">
            These keywords from the job description are not present in your resume:
          </p>
          <div className="flex flex-wrap gap-2">
            {atsScore.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {atsScore.suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Improvement Suggestions
          </h4>
          <ul className="space-y-2">
            {atsScore.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span className="text-blue-900">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score Interpretation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Understanding Your Score</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <div className="w-16 h-8 bg-green-100 border-2 border-green-500 rounded mr-3 flex items-center justify-center">
              <span className="text-green-700 font-bold text-xs">80-100</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Excellent</p>
              <p className="text-gray-600">
                Your resume is highly optimized for ATS and should pass most automated screenings.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-16 h-8 bg-yellow-100 border-2 border-yellow-500 rounded mr-3 flex items-center justify-center">
              <span className="text-yellow-700 font-bold text-xs">60-79</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Good</p>
              <p className="text-gray-600">
                Your resume has a decent chance of passing ATS, but could benefit from optimization.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-16 h-8 bg-red-100 border-2 border-red-500 rounded mr-3 flex items-center justify-center">
              <span className="text-red-700 font-bold text-xs">0-59</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Needs Improvement</p>
              <p className="text-gray-600">
                Your resume may struggle with ATS. Consider adding more relevant keywords and improving formatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreDisplay;
