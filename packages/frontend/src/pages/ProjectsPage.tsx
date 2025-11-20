import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Project, ProjectInput } from '../types/profile.types';
import ProjectsList from '../components/ProjectsList';
import ProjectForm from '../components/ProjectForm';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { projects: Project[] } }>('/profile/projects');
      setProjects(response.data.data.projects || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/profile/projects/${id}`);
      setProjects(projects.filter(proj => proj.id !== id));
      showNotification('success', 'Project deleted successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  const handleSubmit = async (data: ProjectInput) => {
    try {
      if (editingProject) {
        const response = await api.put<{ success: boolean; data: { project: Project } }>(
          `/profile/projects/${editingProject.id}`,
          data
        );
        setProjects(projects.map(proj => 
          proj.id === editingProject.id ? response.data.data.project : proj
        ));
        showNotification('success', 'Project updated successfully');
      } else {
        const response = await api.post<{ success: boolean; data: { project: Project } }>(
          '/profile/projects',
          data
        );
        setProjects([...projects, response.data.data.project]);
        showNotification('success', 'Project added successfully');
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (err: any) {
      showNotification('error', err.response?.data?.error?.message || 'Failed to save project');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
            className="text-orange-600 hover:text-orange-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-gray-600">Showcase your portfolio projects</p>
            </div>
            {!showForm && (
              <button
                onClick={handleAdd}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Project
              </button>
            )}
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

        {/* Form or List */}
        {showForm ? (
          <ProjectForm
            project={editingProject}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <ProjectsList
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
