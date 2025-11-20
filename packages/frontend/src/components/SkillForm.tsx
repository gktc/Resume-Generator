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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {skill ? 'Edit Skill' : 'Add Skill'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skill Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., JavaScript, Leadership, Spanish"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft Skills</option>
            <option value="language">Language</option>
          </select>
        </div>

        {/* Proficiency */}
        <div>
          <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
            Proficiency Level *
          </label>
          <select
            id="proficiency"
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience (Optional)
          </label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience || ''}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 5"
          />
          {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>}
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
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : skill ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
