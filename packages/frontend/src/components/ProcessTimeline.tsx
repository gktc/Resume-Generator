import React from 'react';

interface ProcessStructure {
  averageRounds: number;
  commonRoundTypes: { type: string; frequency: number }[];
  averageDuration: number;
}

interface ProcessTimelineProps {
  processStructure: ProcessStructure;
}

const roundTypeLabels: Record<string, string> = {
  'phone-screen': 'Phone Screen',
  technical: 'Technical',
  'system-design': 'System Design',
  behavioral: 'Behavioral',
  'cultural-fit': 'Cultural Fit',
  'take-home': 'Take Home',
  onsite: 'Onsite',
};

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ processStructure }) => {
  const maxFrequency = Math.max(...processStructure.commonRoundTypes.map((r) => r.frequency));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Process Structure</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Average Rounds</div>
          <div className="text-3xl font-bold text-blue-600">
            {processStructure.averageRounds.toFixed(1)}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Average Duration</div>
          <div className="text-3xl font-bold text-green-600">
            {processStructure.averageDuration} days
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Most Common Round</div>
          <div className="text-lg font-bold text-purple-600">
            {processStructure.commonRoundTypes.length > 0
              ? roundTypeLabels[processStructure.commonRoundTypes[0].type] ||
                processStructure.commonRoundTypes[0].type
              : 'N/A'}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Common Round Types</h3>
        <div className="space-y-3">
          {processStructure.commonRoundTypes.map((round, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {roundTypeLabels[round.type] || round.type}
                </span>
                <span className="text-sm text-gray-600">{(round.frequency * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(round.frequency / maxFrequency) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {processStructure.commonRoundTypes.length === 0 && (
        <p className="text-gray-500 text-center py-4">No round data available</p>
      )}
    </div>
  );
};

export default ProcessTimeline;
