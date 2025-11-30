import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfileDashboardPage from './pages/ProfileDashboardPage';
import BasicInfoPage from './pages/BasicInfoPage';
import WorkExperiencePage from './pages/WorkExperiencePage';
import EducationPage from './pages/EducationPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ParsedDataReviewPage from './pages/ParsedDataReviewPage';
import ResumeGeneratorPage from './pages/ResumeGeneratorPage';
import ResumeHistoryPage from './pages/ResumeHistoryPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';
import InterviewExperienceFormPage from './pages/InterviewExperienceFormPage';
import CompanySearchPage from './pages/CompanySearchPage';
import InterviewInsightsPage from './pages/InterviewInsightsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ToastProvider>
            <AuthProvider>
              <ToastContainer />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes with MainLayout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <DashboardPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Profile routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ProfileDashboardPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/basic-info"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <BasicInfoPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/experience"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <WorkExperiencePage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/education"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <EducationPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/skills"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SkillsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/projects"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ProjectsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/upload"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ResumeUploadPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/upload/review/:uploadId"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ParsedDataReviewPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Resume routes */}
                <Route
                  path="/resume/generate"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ResumeGeneratorPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/history"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ResumeHistoryPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/:id"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ResumeDetailPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Interview routes */}
                <Route
                  path="/interview/questions/:resumeId"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <InterviewQuestionsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview/experience/new"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <InterviewExperienceFormPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview/search"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CompanySearchPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview/insights/:company/:role"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <InterviewInsightsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirects and 404 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
