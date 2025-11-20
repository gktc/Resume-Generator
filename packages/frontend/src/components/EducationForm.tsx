import { useState, useEffect } from 'react';
import { Education, EducationInput } from '../types/profile.types';

interface EducationFormProps {
  education: Education | null;
  onSubmit: (data: EducationInput) => Promise<void>;
  onCancel: () => void;
}

const EducationForm = ({ education, onSubmit, onCancel }: EducationFormProps) => {
  const [formData, setFormData] = useState<EducationInput>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: null,
    gpa: null,
    achievements: [],
  });
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [achievementInput, setAchievementInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: education.startDate.split('T')[0],
        endDate: education.endDate ? education.endDate.split('T')[0] : null,
        gpa: education.gpa,
        achievements: education.achievements || [],
      });
      setIsCurrentlyStudying(!education.endDate);
    }
  }, [education]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCurrentlyStudyingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentlyStudying(e.target.checked);
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution name is required';
    }
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    if (!formData.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = 'Field of study is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!isCurrentlyStudying && !formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.gpa !== null && (formData.gpa < 0 || formData.gpa > 4.0)) {
      newErrors.gpa = 'GPA must be between 0 and 4.0';
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
        {education ? 'Edit Education' : 'Add Education'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Institution *
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Stanford University"
          />
          {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
        </div>

        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
            Degree *
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.degree ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Bachelor of Science"
          />
          {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
        </div>

        {/* Field of Study */}
        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study *
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Computer Science"
          />
          {errors.fieldOfStudy && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date {!isCurrentlyStudying && '*'}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              disabled={isCurrentlyStudying}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isCurrentlyStudying ? 'bg-gray-100' : ''
              } ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCurrentlyStudying}
                  onChange={handleCurrentlyStudyingChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Currently studying here</span>
              </label>
            </div>
          </div>
        </div>

        {/* GPA */}
        <div>
          <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-1">
            GPA (Optional)
          </label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            value={formData.gpa || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="4.0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.gpa ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 3.75"
          />
          {errors.gpa && <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>}
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Achievements (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add an achievement and press Enter"
            />
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : education ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
