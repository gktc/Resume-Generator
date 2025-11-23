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
    setFormData((prev) => ({ ...prev, [name]: value || null }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addTechnology = () => {
    if (technologyInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, technologyInput.trim()],
      }));
      setTechnologyInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
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
    <div className="card">
      <h2 className="page-title">{project ? 'Edit Project' : 'Add Project'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input-field ${errors.title ? 'input-field-error' : ''}`}
            placeholder="e.g., E-commerce Platform"
          />
          {errors.title && <p className="form-error-text">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`input-field ${errors.description ? 'input-field-error' : ''}`}
            placeholder="Describe your project..."
          />
          {errors.description && <p className="form-error-text">{errors.description}</p>}
        </div>

        {/* Technologies */}
        <div className="form-group">
          <label className="form-label">Technologies Used</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={technologyInput}
              onChange={(e) => setTechnologyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="input-field flex-1"
              placeholder="Add a technology and press Enter"
            />
            <button type="button" onClick={addTechnology} className="btn-primary">
              Add
            </button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span key={index} className="skill-tag skill-tag-removable">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="skill-tag-remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="url" className="form-label">
              Project URL (Optional)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="githubUrl" className="form-label">
              GitHub URL (Optional)
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Start Date (Optional)
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              End Date (Optional)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              className={`input-field ${errors.endDate ? 'input-field-error' : ''}`}
            />
            {errors.endDate && <p className="form-error-text">{errors.endDate}</p>}
          </div>
        </div>

        {/* Highlights */}
        <div className="form-group">
          <label className="form-label">Project Highlights</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="input-field flex-1"
              placeholder="Add a highlight and press Enter"
            />
            <button type="button" onClick={addHighlight} className="btn-primary">
              Add
            </button>
          </div>
          {formData.highlights.length > 0 && (
            <ul className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <li key={index} className="list-item flex items-center justify-between">
                  <span>{highlight}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="btn-icon-sm btn-danger"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="card-footer flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : project ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
