import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.firstName}!</h2>
      <p className="text-gray-600 mb-6">
        Your dashboard is ready. Start building your optimized resume today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm mb-4">
            Manage your work experience, education, skills, and projects
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Manage Profile →
          </button>
        </div>

        {/* Generate Resume */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Resume</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create an ATS-optimized resume for your target job
          </p>
          <button
            onClick={() => navigate('/resume/generate')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Start Generator →
          </button>
        </div>

        {/* Resume History */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume History</h3>
          <p className="text-gray-600 text-sm mb-4">
            View and download your previously generated resumes
          </p>
          <button
            onClick={() => navigate('/resume/history')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View History →
          </button>
        </div>

        {/* Interview Prep */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Prep</h3>
          <p className="text-gray-600 text-sm mb-4">
            Search company interview experiences and insights
          </p>
          <button
            onClick={() => navigate('/interview/search')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Search Companies →
          </button>
        </div>

        {/* Share Experience */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Experience</h3>
          <p className="text-gray-600 text-sm mb-4">
            Help others by sharing your interview experience
          </p>
          <button
            onClick={() => navigate('/interview/experience/new')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Share Experience →
          </button>
        </div>

        {/* Upload Resume */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Resume</h3>
          <p className="text-gray-600 text-sm mb-4">
            Parse your existing resume to quickly populate your profile
          </p>
          <button
            onClick={() => navigate('/profile/upload')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Upload Resume →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
