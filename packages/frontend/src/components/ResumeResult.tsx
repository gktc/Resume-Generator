import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ATSScoreDisplay from './ATSScoreDisplay';
import { Resume } from '../types/resume.types';

interface ResumeResultProps {
  resume: Resume;
  onGenerateAnother: () => void;
}

const ResumeResult = ({ resume, onGenerateAnother }: ResumeResultProps) => {
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);

  // Load PDF for preview
  useEffect(() => {
    const loadPdfPreview = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${API_URL}/api/resume/${resume.id}/download`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load preview');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Preview load error:', error);
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPdfPreview();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [resume.id]);

  const handleDownload = async () => {
    try {
      // Create a download link
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_URL}/api/resume/${resume.id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.fileName || `resume_${resume.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const handleViewInterviewQuestions = () => {
    navigate(`/interview/questions/${resume.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Generated Successfully! 🎉</h2>
            <p className="text-gray-600 mt-1">Your ATS-optimized resume is ready for download</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {resume.status === 'completed' ? 'Ready' : resume.status}
            </span>
          </div>
        </div>

        {/* Resume Metadata */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Job Position:</span>
              <p className="font-medium text-gray-900">
                {resume.jobDescription?.position || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Company:</span>
              <p className="font-medium text-gray-900">{resume.jobDescription?.company || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">Generated:</span>
              <p className="font-medium text-gray-900">{formatDate(resume.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Score Display */}
      <div className="mb-8">
        <ATSScoreDisplay atsScore={resume.atsScore} />
      </div>

      {/* PDF Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
        <div className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
          <div className="aspect-[8.5/11] bg-white">
            {loadingPreview ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-full" title="Resume Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Preview not available</p>
                  <p className="text-sm mt-2">Use the download button below</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Preview may not display in all browsers. Use the download button to view the full PDF.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Resume
        </button>

        {/* View Interview Questions Button */}
        <button
          onClick={handleViewInterviewQuestions}
          className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          View Interview Questions
        </button>

        {/* Generate Another Button */}
        <button
          onClick={onGenerateAnother}
          className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Another
        </button>
      </div>

      {/* Additional Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/resume/history')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All Resumes →
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Back to Dashboard →
        </button>
      </div>

      {/* Success Tips */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Next Steps
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">1.</span>
            <span>Download your resume and review it carefully</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">2.</span>
            <span>Prepare for interviews using the generated questions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">3.</span>
            <span>Customize the resume further if needed for specific applications</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">4.</span>
            <span>Check community insights for interview experiences at the company</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeResult;
