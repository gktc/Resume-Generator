import { useState } from 'react';
import api from '../lib/api';
import {
  JobDescription,
  JobDescriptionInput as JobDescriptionInputType,
} from '../types/resume.types';

interface JobDescriptionInputProps {
  onJobAnalyzed: (job: JobDescription) => void;
}

const JobDescriptionInput = ({ onJobAnalyzed }: JobDescriptionInputProps) => {
  const [formData, setFormData] = useState<JobDescriptionInputType>({
    company: '',
    position: '',
    rawText: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof JobDescriptionInputType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData((prev) => ({ ...prev, rawText: text }));
      setError(null);
    } catch (err) {
      setError('Failed to paste from clipboard. Please paste manually.');
    }
  };

  const handleClear = () => {
    setFormData({
      company: '',
      position: '',
      rawText: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.company.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      return;
    }
    if (!formData.rawText.trim()) {
      setError('Job description is required');
      return;
    }
    if (formData.rawText.trim().length < 50) {
      setError('Job description is too short. Please provide more details.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await api.post<{ success: boolean; data: { jobId: string; analysis: any } }>(
        '/jobs/analyze',
        {
          company: formData.company,
          position: formData.position,
          jobDescription: formData.rawText,
        }
      );

      // Construct JobDescription object from response
      const jobDescription: JobDescription = {
        id: response.data.data.jobId,
        userId: '', // Will be populated by backend
        company: formData.company,
        position: formData.position,
        rawText: formData.rawText,
        analyzedData: response.data.data.analysis,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onJobAnalyzed(jobDescription);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const charCount = formData.rawText.length;
  const isValid = formData.company.trim() && formData.position.trim() && charCount >= 50;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Enter Job Description</h2>
        <p className="page-subtitle">
          Paste the job description you want to apply for. We'll analyze it to create a tailored
          resume.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company and Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="company" className="form-label">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="input-field"
              placeholder="e.g., Google"
              disabled={isAnalyzing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              Position *
            </label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className="input-field"
              placeholder="e.g., Senior Software Engineer"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        {/* Job Description Text Area */}
        <div className="form-group">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="rawText" className="form-label">
              Job Description *
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePaste}
                disabled={isAnalyzing}
                className="btn-ghost btn-sm"
              >
                📋 Paste
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isAnalyzing}
                className="btn-ghost btn-sm text-red-600"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          <textarea
            id="rawText"
            value={formData.rawText}
            onChange={(e) => handleChange('rawText', e.target.value)}
            rows={15}
            className="input-field"
            placeholder="Paste the full job description here..."
            disabled={isAnalyzing}
          />
          <div className="form-helper-text flex items-center justify-between mt-2">
            <span
              className={`text-sm ${
                charCount < 50
                  ? 'text-red-600'
                  : charCount < 200
                    ? 'text-yellow-600'
                    : 'text-green-600'
              }`}
            >
              {charCount} characters {charCount < 50 && '(minimum 50 required)'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
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
            <span className="notification-content">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || isAnalyzing}
            className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing ? (
              <>
                <div className="spinner-white spinner-sm mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Job Description
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobDescriptionInput;
