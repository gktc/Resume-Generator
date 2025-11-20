import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Resume } from '../types/resume.types';

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc';

const ResumeHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { resumes: Resume[] } }>('/resume');
      setResumes(response.data.data.resumes || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load resumes');
      setResumes([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const sortedResumes = [...resumes].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'score-desc':
        return (b.atsScore?.overall || 0) - (a.atsScore?.overall || 0);
      case 'score-asc':
        return (a.atsScore?.overall || 0) - (b.atsScore?.overall || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResumes = sortedResumes.slice(startIndex, startIndex + itemsPerPage);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Error Loading Resumes</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchResumes}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume History</h1>
            <p className="mt-2 text-gray-600">
              {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} generated
            </p>
          </div>
          <button
            onClick={() => navigate('/resume/generate')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't generated any resumes yet. Create your first one now!
            </p>
            <button
              onClick={() => navigate('/resume/generate')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Your First Resume
            </button>
          </div>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
              </select>
            </div>

            {/* Resume Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/resume/${resume.id}`)}
                >
                  {/* Status Badge */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        {resume.status === 'completed' ? 'Ready' : resume.status}
                      </span>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(resume.atsScore?.overall || 0)}`}>
                        {resume.atsScore?.overall || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                      {resume.jobDescription?.position || 'Position'}
                    </h3>
                    <p className="text-gray-600 mb-4 truncate">
                      {resume.jobDescription?.company || 'Company'}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(resume.createdAt)}
                    </div>

                    {/* ATS Score Breakdown */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">ATS Score Breakdown</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Keywords</span>
                          <span className="font-medium">{resume.atsScore?.breakdown?.keywordMatch || 0}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Experience</span>
                          <span className="font-medium">{resume.atsScore?.breakdown?.experienceRelevance || 0}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Hint */}
                    <div className="mt-4 text-center">
                      <span className="text-sm text-blue-600 font-medium">
                        Click to view details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeHistoryPage;
