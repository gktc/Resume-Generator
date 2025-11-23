import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Resume, ResumeGenerationJob } from '../types/resume.types';

interface ResumeGeneratorProps {
  jobDescriptionId: string;
  templateId: string;
  onResumeGenerated: (resume: Resume) => void;
}

const ResumeGenerator = ({
  jobDescriptionId,
  templateId,
  onResumeGenerated,
}: ResumeGeneratorProps) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'polling' | 'completed' | 'error'>(
    'idle'
  );
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'polling' && jobId) {
      const interval = setInterval(() => {
        pollStatus();
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [status, jobId]);

  const handleGenerate = async () => {
    try {
      setStatus('generating');
      setError(null);
      setProgress(10);

      const response = await api.post<{ success: boolean; data: { jobId: string } }>(
        '/resume/generate',
        {
          jobDescriptionId,
          templateId,
        }
      );

      setJobId(response.data.data.jobId);
      setProgress(30);
      setStatus('polling');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to start resume generation');
      setStatus('error');
    }
  };

  const pollStatus = async () => {
    if (!jobId) return;

    try {
      const response = await api.get<{ success: boolean; data: ResumeGenerationJob }>(
        `/resume/status/${jobId}`
      );

      const job = response.data.data;

      if (job.status === 'processing') {
        setProgress((prev) => Math.min(prev + 5, 90));
      } else if (job.status === 'completed' && job.resumeId) {
        setProgress(100);
        setStatus('completed');
        // Fetch the complete resume data
        const resumeResponse = await api.get<{ success: boolean; data: Resume }>(
          `/resume/${job.resumeId}`
        );
        onResumeGenerated(resumeResponse.data.data);
      } else if (job.status === 'failed') {
        setError(job.error || 'Resume generation failed');
        setStatus('error');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to check generation status');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setJobId(null);
    setError(null);
    setProgress(0);
  };

  if (status === 'error') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Failed</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-6 h-6 text-red-600 mr-2"
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
            <span className="text-red-800 font-semibold">Error Generating Resume</span>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'generating' || status === 'polling') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Resume</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {status === 'generating'
                ? 'Starting generation...'
                : 'Optimizing your resume for ATS...'}
            </p>
            <p className="text-sm text-gray-600">This may take 20-30 seconds</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">{progress}% complete</p>

          {/* Generation Steps */}
          <div className="mt-8 space-y-3">
            <div
              className={`flex items-center ${progress >= 10 ? 'text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Analyzing job requirements</span>
            </div>
            <div
              className={`flex items-center ${progress >= 40 ? 'text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Selecting relevant content</span>
            </div>
            <div
              className={`flex items-center ${progress >= 60 ? 'text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Optimizing for ATS keywords</span>
            </div>
            <div
              className={`flex items-center ${progress >= 80 ? 'text-green-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Compiling PDF document</span>
            </div>
            <div
              className={`flex items-center ${
                progress >= 100 ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Calculating ATS score</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Idle state - show summary and generate button
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate</h2>
      <p className="text-gray-600 mb-6">
        Review your selections and click the button below to generate your ATS-optimized resume.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Job Description Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Target Job</h3>
          </div>
          <p className="text-sm text-gray-600">Job ID: {jobDescriptionId}</p>
        </div>

        {/* Template Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
            <h3 className="font-semibold text-gray-900">Selected Template</h3>
          </div>
          <p className="text-sm text-gray-600">Template ID: {templateId}</p>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-3">What to Expect</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Your resume will be tailored to match the job requirements</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Content will be optimized with relevant keywords for ATS</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>You'll receive an ATS score with detailed feedback</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Generation typically takes 20-30 seconds</span>
          </li>
        </ul>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center text-lg font-semibold"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeGenerator;
