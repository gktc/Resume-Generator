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
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { skills: Skill[] } }>('/profile/skills');
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
      const response = await api.post<{ success: boolean; data: { skill: Skill } }>('/profile/skills', data);
      setSkills([...skills, response.data.data.skill]);
      showNotification('success', 'Skill added successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to add skill');
      throw err;
    }
  };

  const handleUpdate = async (id: string, data: SkillInput) => {
    try {
      const response = await api.put<{ success: boolean; data: { skill: Skill } }>(`/profile/skills/${id}`, data);
      setSkills(skills.map(skill => skill.id === id ? response.data.data.skill : skill));
      showNotification('success', 'Skill updated successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to update skill');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/profile/skills/${id}`);
      setSkills(skills.filter(skill => skill.id !== id));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
            <p className="mt-2 text-gray-600">Manage your professional skills and expertise</p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.message}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
            {error}
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
    </div>
  );
};

export default SkillsPage;
