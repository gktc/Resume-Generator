import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Skill, SkillInput } from '../types/profile.types';
import SkillsManager from '../components/SkillsManager';

const SkillsPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { skills: Skill[] } }>(
        '/profile/skills'
      );
      setSkills(response.data.data.skills || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load skills');
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (data: SkillInput) => {
    try {
      const response = await api.post<{ success: boolean; data: { skill: Skill } }>(
        '/profile/skills',
        data
      );
      setSkills([...skills, response.data.data.skill]);
      showNotification('success', 'Skill added successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to add skill');
      throw err;
    }
  };

  const handleUpdate = async (id: string, data: SkillInput) => {
    try {
      const response = await api.put<{ success: boolean; data: { skill: Skill } }>(
        `/profile/skills/${id}`,
        data
      );
      setSkills(skills.map((skill) => (skill.id === id ? response.data.data.skill : skill)));
      showNotification('success', 'Skill updated successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to update skill');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/profile/skills/${id}`);
      setSkills(skills.filter((skill) => skill.id !== id));
      showNotification('success', 'Skill deleted successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to delete skill');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (isLoading) {
    return (
      <div className="loading-container min-h-screen">
        <div className="spinner spinner-lg"></div>
        <p className="page-subtitle">Loading skills...</p>
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
        <div>
          <h1 className="page-title">Skills</h1>
          <p className="page-subtitle">Manage your professional skills and expertise</p>
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

      {/* Skills Manager */}
      <SkillsManager
        skills={skills}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SkillsPage;
