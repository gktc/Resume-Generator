import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { UserProfile } from '../types/profile.types';
import { useAuth } from '../contexts/AuthContext';

const ProfileDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { profile: UserProfile } }>(
        '/profile'
      );
      setProfile(response.data.data.profile);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.error?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="page-subtitle">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-red-600"
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
            <h2 className="page-title mb-2">Error Loading Profile</h2>
            <p className="page-subtitle mb-4">{error}</p>
            <button onClick={fetchProfile} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Welcome, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="page-subtitle">Manage your professional profile and career information</p>
        </div>

        {/* Profile Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Work Experience Card */}
          <div
            className="card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/profile/experience')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
              <span className="text-3xl font-bold text-black">
                {profile?.workExperiences?.length || 0}
              </span>
            </div>
            <h3 className="section-header text-lg mb-2">Work Experience</h3>
            <p className="text-sm text-gray-600 mb-3">Manage your work history</p>
            <div className="text-blue-600 text-sm font-medium">Manage →</div>
          </div>

          {/* Education Card */}
          <div
            className="card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/profile/education')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              </div>
              <span className="text-3xl font-bold text-black">
                {profile?.educations?.length || 0}
              </span>
            </div>
            <h3 className="section-header text-lg mb-2">Education</h3>
            <p className="text-sm text-gray-600 mb-3">Manage your education</p>
            <div className="text-green-600 text-sm font-medium">Manage →</div>
          </div>

          {/* Skills Card */}
          <div
            className="card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/profile/skills')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold text-black">{profile?.skills?.length || 0}</span>
            </div>
            <h3 className="section-header text-lg mb-2">Skills</h3>
            <p className="text-sm text-gray-600 mb-3">Manage your skills</p>
            <div className="text-yellow-600 text-sm font-medium">Manage →</div>
          </div>

          {/* Projects Card */}
          <div
            className="card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/profile/projects')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold text-black">
                {profile?.projects?.length || 0}
              </span>
            </div>
            <h3 className="section-header text-lg mb-2">Projects</h3>
            <p className="text-sm text-gray-600 mb-3">Showcase your work</p>
            <div className="text-purple-600 text-sm font-medium">Manage →</div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="card">
            <h2 className="section-header mb-4">Account Settings</h2>
            <button
              onClick={() => navigate('/profile/basic-info')}
              className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Edit Basic Information</p>
                  <p className="text-sm text-gray-600">Update your personal details</p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="section-header mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile/upload')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all flex items-center"
              >
                <svg
                  className="w-6 h-6 mr-3 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Upload Resume</p>
                  <p className="text-sm text-gray-600">Parse existing resume</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/resume/generate')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all flex items-center"
              >
                <svg
                  className="w-6 h-6 mr-3 text-gray-700"
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
                <div>
                  <p className="font-medium text-gray-900">Generate Resume</p>
                  <p className="text-sm text-gray-600">Create ATS-optimized resume</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/resume/history')}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-black transition-all flex items-center"
              >
                <svg
                  className="w-6 h-6 mr-3 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Resume History</p>
                  <p className="text-sm text-gray-600">View generated resumes</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboardPage;
