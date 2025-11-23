import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Resume } from '../types/resume.types';
import ATSScoreDisplay from '../components/ATSScoreDisplay';

const ResumeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResumeDetails();
    }
  }, [id]);

  const fetchResumeDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: Resume }>(`/resume/${id}`);
      setResume(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load resume details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/resume/${id}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume?.fileName || `resume_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to download resume');
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const response = await api.post<{ success: boolean; data: { jobId: string } }>(
        `/resume/${id}/regenerate`
      );
      alert('Resume regeneration started! You will be redirected to track the progress.');
      navigate('/resume/generate', { state: { jobId: response.data.data.jobId } });
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to regenerate resume');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/resume/${id}`);
      navigate('/resume/history');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete resume');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="text-gray-600">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
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
              <p className="font-semibold mb-2">Error Loading Resume</p>
              <p className="text-sm mb-4">{error || 'Resume not found'}</p>
              <button onClick={() => navigate('/resume/history')} className="btn-primary btn-sm">
                Back to History
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
        <div className="page-header">
          <button onClick={() => navigate('/resume/history')} className="back-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to History
          </button>
          <h1 className="page-title">Resume Details</h1>
          <p className="page-subtitle">Generated on {formatDate(resume.createdAt)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Resume Info and Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Information Card */}
            <div className="card">
              <h2 className="section-header">Job Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Position</label>
                  <p className="font-semibold">{resume.jobDescription?.position || 'N/A'}</p>
                </div>
                <div>
                  <label className="form-label">Company</label>
                  <p className="font-semibold">{resume.jobDescription?.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="form-label">Template</label>
                  <p>{resume.template?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <span
                    className={`${
                      resume.status === 'completed'
                        ? 'badge-success'
                        : resume.status === 'failed'
                          ? 'badge-error'
                          : 'badge-warning'
                    } badge`}
                  >
                    {resume.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ATS Score Card */}
            <div className="card">
              <h2 className="section-header">ATS Score</h2>
              <ATSScoreDisplay atsScore={resume.atsScore} />
            </div>

            {/* Actions Card */}
            <div className="card">
              <h2 className="section-header">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>

                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>

                <button
                  onClick={() => navigate(`/interview/questions/${resume.id}`)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View Interview Questions
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Resume
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Job Description and PDF Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description Card */}
            <div className="card">
              <h2 className="section-header">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {resume.jobDescription?.rawText || 'No job description available'}
                </p>
              </div>
            </div>

            {/* PDF Preview Card */}
            <div className="card">
              <h2 className="section-header">Resume Preview</h2>
              <div
                className="border border-gray-300 rounded-lg overflow-hidden"
                style={{ height: '800px' }}
              >
                <iframe
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/resume/${id}/download`}
                  className="w-full h-full"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="loading-overlay">
          <div className="card max-w-md w-full mx-4">
            <div className="notification-warning mb-4">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="notification-content">
                <h3 className="font-bold">Delete Resume</h3>
                <p className="text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this resume? All associated data including interview
              questions will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger flex-1 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDetailPage;
