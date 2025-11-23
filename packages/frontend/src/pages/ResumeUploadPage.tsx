import { useNavigate } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';

const ResumeUploadPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (uploadId: string) => {
    navigate(`/profile/upload/review/${uploadId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
          <p className="mt-2 text-gray-600">
            Upload your existing resume and we'll extract your information automatically
          </p>
        </div>

        <ResumeUploader onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default ResumeUploadPage;
