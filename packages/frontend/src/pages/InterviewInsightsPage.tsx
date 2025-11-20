import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { CompanyInsights } from '../types/interview.types';
import ProcessTimeline from '../components/ProcessTimeline';
import CommonQuestions from '../components/CommonQuestions';
import DifficultyDistribution from '../components/DifficultyDistribution';

const InterviewInsightsPage: React.FC = () => {
  const { company, role } = useParams<{ company: string; role: string }>();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<CompanyInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company && role) {
      fetchInsights();
    }
  }, [company, role]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/interview/insights/${encodeURIComponent(company!)}/${encodeURIComponent(role!)}`);
      setInsights(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch interview insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading interview insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Insights</h3>
            <p className="mt-2 text-gray-600">{error || 'No insights available'}</p>
            <button
              onClick={() => navigate('/interview/search')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lastUpdatedDate = new Date(insights.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => navigate('/interview/search')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Search
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{insights.company}</h1>
              <p className="text-xl text-gray-600 mb-4">{insights.role}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{insights.totalSubmissions} {insights.totalSubmissions === 1 ? 'experience' : 'experiences'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Last updated: {lastUpdatedDate}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/interview/experience/new')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mb-6">
          <ProcessTimeline processStructure={insights.processStructure} />
        </div>

        {/* Common Questions */}
        <div className="mb-6">
          <CommonQuestions questions={insights.commonQuestions} />
        </div>

        {/* Difficulty Distribution and Tips */}
        <DifficultyDistribution
          difficultyDistribution={insights.difficultyDistribution}
          topicFrequency={insights.topicFrequency}
          successTips={insights.successTips}
        />
      </div>
    </div>
  );
};

export default InterviewInsightsPage;
