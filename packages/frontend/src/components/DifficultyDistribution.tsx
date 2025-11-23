import React from 'react';

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

interface TopicFrequency {
  topic: string;
  frequency: number;
}

interface DifficultyDistributionProps {
  difficultyDistribution: DifficultyDistribution;
  topicFrequency: TopicFrequency[];
  successTips: string[];
}

const DifficultyDistributionComponent: React.FC<DifficultyDistributionProps> = ({
  difficultyDistribution,
  topicFrequency,
  successTips,
}) => {
  const total =
    difficultyDistribution.easy + difficultyDistribution.medium + difficultyDistribution.hard;

  const easyPercent = total > 0 ? (difficultyDistribution.easy / total) * 100 : 0;
  const mediumPercent = total > 0 ? (difficultyDistribution.medium / total) * 100 : 0;
  const hardPercent = total > 0 ? (difficultyDistribution.hard / total) * 100 : 0;

  // Sort topics by frequency
  const sortedTopics = [...topicFrequency].sort((a, b) => b.frequency - a.frequency);
  const maxFrequency = sortedTopics.length > 0 ? sortedTopics[0].frequency : 1;

  return (
    <div className="space-y-6">
      {/* Difficulty Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Difficulty Distribution</h2>

        <div className="space-y-4">
          {/* Easy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Easy</span>
              </div>
              <span className="text-sm text-gray-600">{easyPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${easyPercent}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Medium</span>
              </div>
              <span className="text-sm text-gray-600">{mediumPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${mediumPercent}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Hard</span>
              </div>
              <span className="text-sm text-gray-600">{hardPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${hardPercent}%` }}
              />
            </div>
          </div>
        </div>

        {total === 0 && (
          <p className="text-gray-500 text-center py-4">No difficulty data available</p>
        )}
      </div>

      {/* Topic Frequency */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Topics</h2>

        {sortedTopics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sortedTopics.map((topic, index) => {
              // Calculate size based on frequency
              const sizeClass =
                topic.frequency >= maxFrequency * 0.7
                  ? 'text-lg px-4 py-2'
                  : topic.frequency >= maxFrequency * 0.4
                    ? 'text-base px-3 py-2'
                    : 'text-sm px-3 py-1';

              const colorClass =
                topic.frequency >= maxFrequency * 0.7
                  ? 'bg-blue-600 text-white'
                  : topic.frequency >= maxFrequency * 0.4
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-800';

              return (
                <span
                  key={index}
                  className={`${sizeClass} ${colorClass} rounded-full font-medium inline-flex items-center gap-2`}
                >
                  {topic.topic}
                  <span className="text-xs opacity-75">({topic.frequency})</span>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No topic data available</p>
        )}
      </div>

      {/* Success Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preparation Tips</h2>

        {successTips.length > 0 ? (
          <ul className="space-y-3">
            {successTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No preparation tips available</p>
        )}
      </div>
    </div>
  );
};

export default DifficultyDistributionComponent;
