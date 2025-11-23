import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Resume } from '../types/resume.types';

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc';
type ViewMode = 'grid' | 'list';

const ResumeHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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

  // Filter resumes by search query
  const filteredResumes = resumes.filter((resume) => {
    const searchLower = searchQuery.toLowerCase();
    const position = resume.jobDescription?.position?.toLowerCase() || '';
    const company = resume.jobDescription?.company?.toLowerCase() || '';
    const template = resume.template?.name?.toLowerCase() || '';
    return (
      position.includes(searchLower) ||
      company.includes(searchLower) ||
      template.includes(searchLower)
    );
  });

  const sortedResumes = [...filteredResumes].sort((a, b) => {
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

  // Calculate stats
  const stats = {
    total: resumes.length,
    avgScore:
      resumes.length > 0
        ? Math.round(
            resumes.reduce((sum, r) => sum + (r.atsScore?.overall || 0), 0) / resumes.length
          )
        : 0,
    pending: resumes.filter((r) => r.status === 'processing' || r.status === 'pending').length,
  };

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

  const handleDownload = async (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await api.get(`/resume/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4">
          <div className="notification-error">
            <svg
              className="notification-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="notification-content">
              <p className="font-semibold mb-2">Error Loading Resumes</p>
              <p className="text-sm mb-4">{error}</p>
              <button onClick={fetchResumes} className="btn-primary btn-sm">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title">Resume History</h1>
            <p className="page-subtitle">
              {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} generated
            </p>
          </div>
          <button
            onClick={() => navigate('/resume/generate')}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Generate New Resume
          </button>
        </div>

        {/* Quick Stats Dashboard */}
        {resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Resumes</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold mb-1">{stats.avgScore}%</div>
              <div className="text-sm text-gray-600">Average ATS Score</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="card empty-state">
            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="section-header">No Resumes Yet</h3>
            <p className="empty-state-text mb-6">
              You haven't generated any resumes yet. Create your first one now!
            </p>
            <button onClick={() => navigate('/resume/generate')} className="btn-primary">
              Generate Your First Resume
            </button>
          </div>
        ) : (
          <>
            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by position, company, or template..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-field pl-10 w-full"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="input-field"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={
                    viewMode === 'grid' ? 'btn-primary btn-icon-sm' : 'btn-secondary btn-icon-sm'
                  }
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={
                    viewMode === 'list' ? 'btn-primary btn-icon-sm' : 'btn-secondary btn-icon-sm'
                  }
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results Count */}
            {searchQuery && (
              <p className="text-sm text-gray-600 mb-4">
                Showing {sortedResumes.length} of {resumes.length} resumes
              </p>
            )}

            {/* Resume Cards - Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedResumes.map((resume) => (
                  <div key={resume.id} className="card overflow-hidden">
                    {/* Header with Score */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${getScoreColor(resume.atsScore?.overall || 0)}`}
                        >
                          {resume.atsScore?.overall || 0}%
                        </div>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded ${
                            resume.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {resume.status === 'completed' ? 'Ready' : resume.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div>
                      <h3 className="text-lg font-bold mb-1 truncate">
                        {resume.jobDescription?.position || 'Position'}
                      </h3>
                      <p className="text-gray-600 mb-2 truncate">
                        {resume.jobDescription?.company || 'Company'}
                      </p>

                      {/* Template Name */}
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        {resume.template?.name || 'Unknown Template'}
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(resume.createdAt)}
                      </div>

                      {/* ATS Score Breakdown with Progress Bars */}
                      <div className="space-y-2 mb-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Keywords</span>
                            <span className="font-medium">
                              {resume.atsScore?.breakdown?.keywordMatch || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-black h-2 rounded-full transition-all"
                              style={{ width: `${resume.atsScore?.breakdown?.keywordMatch || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Experience</span>
                            <span className="font-medium">
                              {resume.atsScore?.breakdown?.experienceRelevance || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-black h-2 rounded-full transition-all"
                              style={{
                                width: `${resume.atsScore?.breakdown?.experienceRelevance || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Format</span>
                            <span className="font-medium">
                              {resume.atsScore?.breakdown?.formatParseability || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-black h-2 rounded-full transition-all"
                              style={{
                                width: `${resume.atsScore?.breakdown?.formatParseability || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/resume/${resume.id}`)}
                          className="btn-primary flex-1 text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => handleDownload(resume.id, e)}
                          className="btn-secondary btn-icon-sm"
                          title="Download PDF"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resume List - List View */}
            {viewMode === 'list' && (
              <div className="space-y-4 mb-8">
                {paginatedResumes.map((resume) => (
                  <div key={resume.id} className="card">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Score Badge */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${getScoreColor(resume.atsScore?.overall || 0)}`}
                        >
                          {resume.atsScore?.overall || 0}%
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold truncate">
                              {resume.jobDescription?.position || 'Position'}
                            </h3>
                            <p className="text-gray-600 truncate">
                              {resume.jobDescription?.company || 'Company'}
                            </p>
                          </div>
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded whitespace-nowrap ${
                              resume.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {resume.status === 'completed' ? 'Ready' : resume.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            {resume.template?.name || 'Unknown Template'}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(resume.createdAt)}
                          </div>
                        </div>

                        {/* ATS Score Breakdown - Horizontal */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Keywords</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-black h-2 rounded-full"
                                style={{
                                  width: `${resume.atsScore?.breakdown?.keywordMatch || 0}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {resume.atsScore?.breakdown?.keywordMatch || 0}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Experience</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-black h-2 rounded-full"
                                style={{
                                  width: `${resume.atsScore?.breakdown?.experienceRelevance || 0}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {resume.atsScore?.breakdown?.experienceRelevance || 0}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Format</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-black h-2 rounded-full"
                                style={{
                                  width: `${resume.atsScore?.breakdown?.formatParseability || 0}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {resume.atsScore?.breakdown?.formatParseability || 0}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex md:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/resume/${resume.id}`)}
                          className="btn-primary text-sm whitespace-nowrap"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => handleDownload(resume.id, e)}
                          className="btn-secondary text-sm whitespace-nowrap"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, sortedResumes.length)} of{' '}
                  {sortedResumes.length} resumes
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'btn-primary' : 'btn-secondary'}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="btn-secondary"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeHistoryPage;
