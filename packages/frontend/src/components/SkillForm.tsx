import { useState, useEffect } from 'react';
import { Skill, SkillInput } from '../types/profile.types';

interface SkillFormProps {
  skill: Skill | null;
  onSubmit: (data: SkillInput) => Promise<void>;
  onCancel: () => void;
}

const SkillForm = ({ skill, onSubmit, onCancel }: SkillFormProps) => {
  const [formData, setFormData] = useState<SkillInput>({
    name: '',
    category: 'technical',
    proficiency: 'intermediate',
    yearsOfExperience: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience,
      });
    }
  }, [skill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
    }
    if (formData.yearsOfExperience !== null && formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Years of experience cannot be negative';
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
      <h2 className="page-title">{skill ? 'Edit Skill' : 'Add Skill'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skill Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Skill Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'input-field-error' : ''}`}
            placeholder="e.g., JavaScript, Leadership, Spanish"
          />
          {errors.name && <p className="form-error-text">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft Skills</option>
            <option value="language">Language</option>
          </select>
        </div>

        {/* Proficiency */}
        <div className="form-group">
          <label htmlFor="proficiency" className="form-label">
            Proficiency Level *
          </label>
          <select
            id="proficiency"
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            className="input-field"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Years of Experience */}
        <div className="form-group">
          <label htmlFor="yearsOfExperience" className="form-label">
            Years of Experience (Optional)
          </label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience || ''}
            onChange={handleChange}
            min="0"
            className={`input-field ${errors.yearsOfExperience ? 'input-field-error' : ''}`}
            placeholder="e.g., 5"
          />
          {errors.yearsOfExperience && (
            <p className="form-error-text">{errors.yearsOfExperience}</p>
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
            {isSubmitting ? 'Saving...' : skill ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
