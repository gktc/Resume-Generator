import { useState, useEffect } from 'react';
import { WorkExperience, WorkExperienceInput } from '../types/profile.types';

interface WorkExperienceFormProps {
  experience: WorkExperience | null;
  onSubmit: (data: WorkExperienceInput) => Promise<void>;
  onCancel: () => void;
}

const WorkExperienceForm = ({ experience, onSubmit, onCancel }: WorkExperienceFormProps) => {
  const [formData, setFormData] = useState<WorkExperienceInput>({
    company: '',
    position: '',
    startDate: '',
    endDate: null,
    description: '',
    achievements: [],
    technologies: [],
  });
  const [isCurrentRole, setIsCurrentRole] = useState(false);
  const [achievementInput, setAchievementInput] = useState('');
  const [technologyInput, setTechnologyInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate.split('T')[0],
        endDate: experience.endDate ? experience.endDate.split('T')[0] : null,
        description: experience.description,
        achievements: experience.achievements || [],
        technologies: experience.technologies || [],
      });
      setIsCurrentRole(!experience.endDate);
    }
  }, [experience]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCurrentRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentRole(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, endDate: null }));
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!isCurrentRole && !formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      <h2 className="page-title">{experience ? 'Edit Work Experience' : 'Add Work Experience'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company */}
        <div className="form-group">
          <label htmlFor="company" className="form-label">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`input-field ${errors.company ? 'input-field-error' : ''}`}
            placeholder="e.g., Google"
          />
          {errors.company && <p className="form-error-text">{errors.company}</p>}
        </div>

        {/* Position */}
        <div className="form-group">
          <label htmlFor="position" className="form-label">
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`input-field ${errors.position ? 'input-field-error' : ''}`}
            placeholder="e.g., Senior Software Engineer"
          />
          {errors.position && <p className="form-error-text">{errors.position}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`input-field ${errors.startDate ? 'input-field-error' : ''}`}
            />
            {errors.startDate && <p className="form-error-text">{errors.startDate}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              End Date {!isCurrentRole && '*'}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              disabled={isCurrentRole}
              className={`input-field ${errors.endDate ? 'input-field-error' : ''}`}
            />
            {errors.endDate && <p className="form-error-text">{errors.endDate}</p>}
            <div className="mt-2">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCurrentRole}
                  onChange={handleCurrentRoleChange}
                  className="checkbox"
                />
                <span>I currently work here</span>
              </label>
            </div>
          </div>
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
            placeholder="Describe your role and responsibilities..."
          />
          {errors.description && <p className="form-error-text">{errors.description}</p>}
        </div>

        {/* Achievements */}
        <div className="form-group">
          <label className="form-label">Key Achievements</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              className="input-field flex-1"
              placeholder="Add an achievement and press Enter"
            />
            <button type="button" onClick={addAchievement} className="btn-primary">
              Add
            </button>
          </div>
          {formData.achievements.length > 0 && (
            <ul className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <li key={index} className="list-item flex items-center justify-between">
                  <span>{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
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
            {isSubmitting ? 'Saving...' : experience ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
