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
        } 
      }>(
        `/upload/parsed/${uploadId}`
      );
      
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parsed data...</p>
        </div>
      </div>
    );
  }

  if (error || !parsedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Error Loading Data</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Profile
            </button>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Parsed Data</h1>
          <p className="mt-2 text-gray-600">
            Review the extracted information from your resume. You can edit this data after importing.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-900">
                We found {totalItems} items in your resume
              </p>
              <p className="text-sm text-blue-800 mt-1">
                {parsedData.workExperience?.length || 0} work experiences, {parsedData.education?.length || 0} education entries,{' '}
                {parsedData.skills?.length || 0} skills, and {parsedData.projects?.length || 0} projects
              </p>
            </div>
          </div>
        </div>

        {/* Parsed Data Sections */}
        <div className="space-y-6">
          {/* Work Experience */}
          {parsedData.workExperience && parsedData.workExperience.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Work Experience ({parsedData.workExperience.length})
              </h2>
              <div className="space-y-4">
                {parsedData.workExperience.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Achievements:</p>
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
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education ({parsedData.education.length})
              </h2>
              <div className="space-y-4">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    {edu.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Achievements:</p>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills ({parsedData.skills.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <div key={index} className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm ml-2">({skill.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {parsedData.projects && parsedData.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Projects ({parsedData.projects.length})
              </h2>
              <div className="space-y-4">
                {parsedData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.highlights.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Highlights:</p>
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
        <div className="mt-8 flex justify-end space-x-4 bg-white p-6 rounded-lg shadow-md sticky bottom-0">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
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
