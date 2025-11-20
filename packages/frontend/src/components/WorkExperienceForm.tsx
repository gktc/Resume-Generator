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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCurrentRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentRole(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, endDate: null }));
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {experience ? 'Edit Work Experience' : 'Add Work Experience'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Google"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Senior Software Engineer"
          />
          {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date {!isCurrentRole && '*'}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              disabled={isCurrentRole}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isCurrentRole ? 'bg-gray-100' : ''
              } ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCurrentRole}
                  onChange={handleCurrentRoleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">I currently work here</span>
              </label>
            </div>
          </div>
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your role and responsibilities..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Achievements
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add an achievement and press Enter"
            />
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {formData.achievements.length > 0 && (
            <ul className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a technology and press Enter"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : experience ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
