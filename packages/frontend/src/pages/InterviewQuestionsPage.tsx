import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { InterviewQuestionsResponse } from '../types/interview.types';
import { Resume } from '../types/resume.types';
import QuestionCategory from '../components/QuestionCategory';

const InterviewQuestionsPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsData, setQuestionsData] = useState<InterviewQuestionsResponse | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!resumeId) {
        setError('Resume ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch resume details
        const resumeResponse = await api.get(`/resume/${resumeId}`);
        if (resumeResponse.data.success) {
          setResume(resumeResponse.data.data);
        }

        // Fetch interview questions
        const questionsResponse = await api.get(`/interview/questions/${resumeId}`);
        if (questionsResponse.data.success) {
          setQuestionsData(questionsResponse.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching interview questions:', err);
        setError(
          err.response?.data?.error?.message ||
            'Failed to load interview questions. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="text-gray-600">Generating interview questions...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
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
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700 text-center mb-4">{error}</p>
          <button onClick={() => navigate('/resume/history')} className="btn-primary w-full">
            Back to Resume History
          </button>
        </div>
      </div>
    );
  }

  if (!questionsData || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { questions, total } = questionsData;
  const categoryCount = {
    technical: questions.technical.length,
    behavioral: questions.behavioral.length,
    experience: questions.experience.length,
    roleSpecific: questions.roleSpecific.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <Link to={`/resume/${resumeId}`} className="back-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Resume
          </Link>
          <h1 className="page-title">Interview Preparation</h1>
          <p className="page-subtitle">
            Practice questions tailored to your resume and target position
          </p>
        </div>

        {/* Resume and Job Info */}
        <div className="card mb-6">
          <h2 className="section-header">Resume Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="text-lg font-medium text-gray-900">
                {resume.jobDescription?.company || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-lg font-medium text-gray-900">
                {resume.jobDescription?.position || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ATS Score</p>
              <p className="text-lg font-medium text-gray-900">
                {resume.atsScore?.overall || 0}/100
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-lg font-medium text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        {/* Questions Overview */}
        <div className="card mb-6">
          <h2 className="section-header">Questions by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{categoryCount.technical}</p>
              <p className="text-sm text-gray-600">Technical</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{categoryCount.behavioral}</p>
              <p className="text-sm text-gray-600">Behavioral</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{categoryCount.experience}</p>
              <p className="text-sm text-gray-600">Experience</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{categoryCount.roleSpecific}</p>
              <p className="text-sm text-gray-600">Role-Specific</p>
            </div>
          </div>
        </div>

        {/* Question Categories */}
        <div className="space-y-6">
          {questions.technical.length > 0 && (
            <QuestionCategory
              title="Technical Questions"
              description="Questions about your technical skills and knowledge"
              questions={questions.technical}
              color="blue"
            />
          )}

          {questions.behavioral.length > 0 && (
            <QuestionCategory
              title="Behavioral Questions"
              description="Questions about how you handle situations and work with others"
              questions={questions.behavioral}
              color="green"
            />
          )}

          {questions.experience.length > 0 && (
            <QuestionCategory
              title="Experience-Based Questions"
              description="Questions about your past work experiences and achievements"
              questions={questions.experience}
              color="purple"
            />
          )}

          {questions.roleSpecific.length > 0 && (
            <QuestionCategory
              title="Role-Specific Questions"
              description="Questions tailored to the target position"
              questions={questions.roleSpecific}
              color="orange"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionsPage;
