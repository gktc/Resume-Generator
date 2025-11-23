import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { WorkExperience, WorkExperienceInput } from '../types/profile.types';
import WorkExperienceList from '../components/WorkExperienceList';
import WorkExperienceForm from '../components/WorkExperienceForm';

const WorkExperiencePage = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { experiences: WorkExperience[] } }>(
        '/profile/experience'
      );
      setExperiences(response.data.data.experiences || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load work experience');
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setShowForm(true);
  };

  const handleEdit = (experience: WorkExperience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work experience?')) {
      return;
    }

    try {
      await api.delete(`/profile/experience/${id}`);
      setExperiences(experiences.filter((exp) => exp.id !== id));
      showNotification('success', 'Work experience deleted successfully');
    } catch (err: any) {
      showNotification(
        'error',
        err.response?.data?.error?.message || 'Failed to delete work experience'
      );
    }
  };

  const handleSubmit = async (data: WorkExperienceInput) => {
    try {
      if (editingExperience) {
        const response = await api.put<{ success: boolean; data: { experience: WorkExperience } }>(
          `/profile/experience/${editingExperience.id}`,
          data
        );
        setExperiences(
          experiences.map((exp) =>
            exp.id === editingExperience.id ? response.data.data.experience : exp
          )
        );
        showNotification('success', 'Work experience updated successfully');
      } else {
        const response = await api.post<{ success: boolean; data: { experience: WorkExperience } }>(
          '/profile/experience',
          data
        );
        setExperiences([...experiences, response.data.data.experience]);
        showNotification('success', 'Work experience added successfully');
      }
      setShowForm(false);
      setEditingExperience(null);
    } catch (err: any) {
      showNotification(
        'error',
        err.response?.data?.error?.message || 'Failed to save work experience'
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (isLoading) {
    return (
      <div className="loading-container min-h-screen">
        <div className="spinner spinner-lg"></div>
        <p className="page-subtitle">Loading work experience...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/profile')} className="back-link">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Profile</span>
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Work Experience</h1>
            <p className="page-subtitle">Manage your professional work history</p>
          </div>
          {!showForm && (
            <button onClick={handleAdd} className="btn-primary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Experience
            </button>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={
            notification.type === 'success' ? 'notification-success' : 'notification-error'
          }
        >
          <svg className="notification-icon" fill="currentColor" viewBox="0 0 20 20">
            {notification.type === 'success' ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span className="notification-content">{notification.message}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="notification-error">
          <span className="notification-content">{error}</span>
        </div>
      )}

      {/* Form or List */}
      {showForm ? (
        <WorkExperienceForm
          experience={editingExperience}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <WorkExperienceList experiences={experiences} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default WorkExperiencePage;
