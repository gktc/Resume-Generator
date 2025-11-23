import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { ParsedResumeData } from '../types/profile.types';

const ParsedDataReviewPage = () => {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uploadId) {
      fetchParsedData();
    }
  }, [uploadId]);

  const fetchParsedData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{
        success: boolean;
        data: {
          id: string;
          fileName: string;
          parsedData: ParsedResumeData;
          createdAt: string;
        };
      }>(`/upload/parsed/${uploadId}`);

      // Extract parsedData from the response
      const data = response.data.data.parsedData;

      // Ensure all arrays exist with defaults
      setParsedData({
        workExperience: data?.workExperience || [],
        education: data?.education || [],
        skills: data?.skills || [],
        projects: data?.projects || [],
      });
    } catch (err: any) {
      console.error('Fetch parsed data error:', err);
      setError(err.response?.data?.error?.message || 'Failed to load parsed data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!uploadId) return;

    try {
      setIsSaving(true);
      // Send the parsed data to be saved to the profile
      await api.post(`/upload/confirm/${uploadId}`, parsedData);
      navigate('/profile', { state: { message: 'Resume data imported successfully!' } });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save parsed data');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard this parsed data?')) {
      navigate('/profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="text-gray-600">Loading parsed data...</p>
        </div>
      </div>
    );
  }

  if (error || !parsedData) {
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
              <p className="font-semibold mb-2">Error Loading Data</p>
              <p className="text-sm mb-4">{error}</p>
              <button onClick={() => navigate('/profile')} className="btn-primary btn-sm">
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalItems =
    (parsedData.workExperience?.length || 0) +
    (parsedData.education?.length || 0) +
    (parsedData.skills?.length || 0) +
    (parsedData.projects?.length || 0);

  return (
    <div className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Review Parsed Data</h1>
          <p className="page-subtitle">
            Review the extracted information from your resume. You can edit this data after
            importing.
          </p>
        </div>

        {/* Summary */}
        <div className="notification-info mb-6">
          <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="notification-content">
            <p className="font-semibold">We found {totalItems} items in your resume</p>
            <p className="text-sm mt-1">
              {parsedData.workExperience?.length || 0} work experiences,{' '}
              {parsedData.education?.length || 0} education entries,{' '}
              {parsedData.skills?.length || 0} skills, and {parsedData.projects?.length || 0}{' '}
              projects
            </p>
          </div>
        </div>

        {/* Parsed Data Sections */}
        <div className="space-y-6">
          {/* Work Experience */}
          {parsedData.workExperience && parsedData.workExperience.length > 0 && (
            <div className="card">
              <h2 className="section-header flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Work Experience ({parsedData.workExperience.length})
              </h2>
              <div className="space-y-4">
                {parsedData.workExperience.map((exp, index) => (
                  <div key={index} className="list-item">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="form-label">Achievements:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="skill-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div className="card">
              <h2 className="section-header flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                Education ({parsedData.education.length})
              </h2>
              <div className="space-y-4">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="list-item">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    {edu.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="form-label">Achievements:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {parsedData.skills && parsedData.skills.length > 0 && (
            <div className="card">
              <h2 className="section-header flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Skills ({parsedData.skills.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm ml-2">({skill.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {parsedData.projects && parsedData.projects.length > 0 && (
            <div className="card">
              <h2 className="section-header flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Projects ({parsedData.projects.length})
              </h2>
              <div className="space-y-4">
                {parsedData.projects.map((project, index) => (
                  <div key={index} className="list-item">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="skill-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.highlights.length > 0 && (
                      <div className="mt-2">
                        <p className="form-label">Highlights:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {project.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-footer mt-8 flex justify-end gap-4 sticky bottom-0">
          <button onClick={handleCancel} className="btn-secondary" disabled={isSaving}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary flex items-center disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="spinner-sm spinner-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Confirm and Save to Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParsedDataReviewPage;
