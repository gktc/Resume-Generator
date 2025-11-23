import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Welcome, {user?.firstName}!</h2>
          <p className="page-subtitle">
            Your dashboard is ready. Start building your optimized resume today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="card card-interactive" onClick={() => navigate('/profile')}>
            <h3 className="section-header">Profile</h3>
            <p className="page-subtitle mb-4">
              Manage your work experience, education, skills, and projects
            </p>
            <span className="btn-ghost btn-sm">Manage Profile →</span>
          </div>

          {/* Generate Resume */}
          <div className="card card-interactive" onClick={() => navigate('/resume/generate')}>
            <h3 className="section-header">Generate Resume</h3>
            <p className="page-subtitle mb-4">Create an ATS-optimized resume for your target job</p>
            <span className="btn-ghost btn-sm">Start Generator →</span>
          </div>

          {/* Resume History */}
          <div className="card card-interactive" onClick={() => navigate('/resume/history')}>
            <h3 className="section-header">Resume History</h3>
            <p className="page-subtitle mb-4">
              View and download your previously generated resumes
            </p>
            <span className="btn-ghost btn-sm">View History →</span>
          </div>

          {/* Interview Prep */}
          <div className="card card-interactive" onClick={() => navigate('/interview/search')}>
            <h3 className="section-header">Interview Prep</h3>
            <p className="page-subtitle mb-4">Search company interview experiences and insights</p>
            <span className="btn-ghost btn-sm">Search Companies →</span>
          </div>

          {/* Share Experience */}
          <div
            className="card card-interactive"
            onClick={() => navigate('/interview/experience/new')}
          >
            <h3 className="section-header">Share Experience</h3>
            <p className="page-subtitle mb-4">Help others by sharing your interview experience</p>
            <span className="btn-ghost btn-sm">Share Experience →</span>
          </div>

          {/* Upload Resume */}
          <div className="card card-interactive" onClick={() => navigate('/profile/upload')}>
            <h3 className="section-header">Upload Resume</h3>
            <p className="page-subtitle mb-4">
              Parse your existing resume to quickly populate your profile
            </p>
            <span className="btn-ghost btn-sm">Upload Resume →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
