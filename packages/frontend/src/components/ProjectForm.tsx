import { useState, useEffect } from 'react';
import { Project, ProjectInput } from '../types/profile.types';

interface ProjectFormProps {
  project: Project | null;
  onSubmit: (data: ProjectInput) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectInput>({
    title: '',
    description: '',
    technologies: [],
    url: null,
    githubUrl: null,
    startDate: null,
    endDate: null,
    highlights: [],
  });
  const [technologyInput, setTechnologyInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        url: project.url,
        githubUrl: project.githubUrl,
        startDate: project.startDate ? project.startDate.split('T')[0] : null,
        endDate: project.endDate ? project.endDate.split('T')[0] : null,
        highlights: project.highlights || [],
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTechnology = () => {
    if (technologyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, technologyInput.trim()],
      }));
      setTechnologyInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {project ? 'Edit Project' : 'Add Project'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., E-commerce Platform"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your project..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technologies Used
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={technologyInput}
              onChange={(e) => setTechnologyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Add a technology and press Enter"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Project URL (Optional)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL (Optional)
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (Optional)
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Highlights
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Add a highlight and press Enter"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>
          {formData.highlights.length > 0 && (
            <ul className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700">{highlight}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : project ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
