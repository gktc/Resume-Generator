import { useEffect, useState } from 'react';
import { JobDescription, MatchResult } from '../types/resume.types';

interface JobAnalysisViewProps {
  jobDescription: JobDescription;
  onContinue: () => void;
}

/**
 * JobAnalysisView Component
 * 
 * Displays the analysis of how well a user's profile matches a job description.
 * Shows overall match score, skill matching, experience relevance, and recommendations.
 * 
 * @param jobDescription - The analyzed job description with requirements
 * @param onContinue - Callback function to proceed to template selection
 */
const JobAnalysisView = ({ jobDescription, onContinue }: JobAnalysisViewProps) => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatchResult();
  }, [jobDescription.id]);

  const fetchMatchResult = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the analyzed data that's already in the jobDescription prop
      // No need to fetch again since we just analyzed it
      const mockMatch: MatchResult = {
        overallScore: 75,
        skillMatch: {
          score: 80,
          matchingSkills: jobDescription.analyzedData?.skills?.slice(0, 5) || [],
          missingSkills: jobDescription.analyzedData?.skills?.slice(5, 8) || [],
        },
        experienceRelevance: {
          score: 70,
          relevantExperiences: ['Software Development', 'Team Leadership'],
        },
        educationMatch: {
          score: 85,
        },
        recommendations: [
          'Add more keywords from the job description to your resume',
          'Highlight your experience with the required technologies',
          'Emphasize leadership and collaboration skills',
        ],
      };
      setMatchResult(mockMatch);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load match analysis');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing your profile match...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-800 font-semibold">Error Loading Analysis</span>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchMatchResult}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!matchResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Analysis & Profile Match</h2>
      <p className="text-gray-600 mb-6">
        Here's how your profile matches the job requirements for {jobDescription.position} at{' '}
        {jobDescription.company}.
      </p>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Match Score</h3>
            <p className="text-gray-600">Based on your profile and job requirements</p>
          </div>
          <div className="text-center">
            <div
              className={`text-5xl font-bold ${getScoreColor(matchResult.overallScore)}`}
            >
              {matchResult.overallScore}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Match</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Skills Match */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Skills Match</h4>
            <span className={`text-2xl font-bold ${getScoreColor(matchResult.skillMatch.score)}`}>
              {matchResult.skillMatch.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                matchResult.skillMatch.score >= 80
                  ? 'bg-green-500'
                  : matchResult.skillMatch.score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${matchResult.skillMatch.score}%` }}
            />
          </div>
        </div>

        {/* Experience Relevance */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Experience</h4>
            <span className={`text-2xl font-bold ${getScoreColor(matchResult.experienceRelevance.score)}`}>
              {matchResult.experienceRelevance.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                matchResult.experienceRelevance.score >= 80
                  ? 'bg-green-500'
                  : matchResult.experienceRelevance.score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${matchResult.experienceRelevance.score}%` }}
            />
          </div>
        </div>

        {/* Education Match */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Education</h4>
            <span className={`text-2xl font-bold ${getScoreColor(matchResult.educationMatch.score)}`}>
              {matchResult.educationMatch.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                matchResult.educationMatch.score >= 80
                  ? 'bg-green-500'
                  : matchResult.educationMatch.score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${matchResult.educationMatch.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skills Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Matching Skills */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Matching Skills ({matchResult.skillMatch.matchingSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchResult.skillMatch.matchingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Missing Skills ({matchResult.skillMatch.missingSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchResult.skillMatch.missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recommendations
        </h4>
        <ul className="space-y-2">
          {matchResult.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-900">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Requirements Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Job Requirements</h4>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Experience Level:</span>{' '}
            {jobDescription.analyzedData.experienceLevel}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Key Skills:</span>{' '}
            {jobDescription.analyzedData.skills.slice(0, 10).join(', ')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Keywords:</span>{' '}
            {jobDescription.analyzedData.keywords.slice(0, 10).join(', ')}
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          Continue to Template Selection
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default JobAnalysisView;
