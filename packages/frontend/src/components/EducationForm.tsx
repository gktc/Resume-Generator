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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCurrentlyStudyingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentlyStudying(e.target.checked);
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
    <div className="card">
      <h2 className="page-title">{education ? 'Edit Education' : 'Add Education'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institution */}
        <div className="form-group">
          <label htmlFor="institution" className="form-label">
            Institution *
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className={`input-field ${errors.institution ? 'input-field-error' : ''}`}
            placeholder="e.g., Stanford University"
          />
          {errors.institution && <p className="form-error-text">{errors.institution}</p>}
        </div>

        {/* Degree */}
        <div className="form-group">
          <label htmlFor="degree" className="form-label">
            Degree *
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className={`input-field ${errors.degree ? 'input-field-error' : ''}`}
            placeholder="e.g., Bachelor of Science"
          />
          {errors.degree && <p className="form-error-text">{errors.degree}</p>}
        </div>

        {/* Field of Study */}
        <div className="form-group">
          <label htmlFor="fieldOfStudy" className="form-label">
            Field of Study *
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className={`input-field ${errors.fieldOfStudy ? 'input-field-error' : ''}`}
            placeholder="e.g., Computer Science"
          />
          {errors.fieldOfStudy && <p className="form-error-text">{errors.fieldOfStudy}</p>}
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
              End Date {!isCurrentlyStudying && '*'}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              disabled={isCurrentlyStudying}
              className={`input-field ${errors.endDate ? 'input-field-error' : ''}`}
            />
            {errors.endDate && <p className="form-error-text">{errors.endDate}</p>}
            <div className="mt-2">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCurrentlyStudying}
                  onChange={handleCurrentlyStudyingChange}
                  className="checkbox"
                />
                <span>Currently studying here</span>
              </label>
            </div>
          </div>
        </div>

        {/* GPA */}
        <div className="form-group">
          <label htmlFor="gpa" className="form-label">
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
            className={`input-field ${errors.gpa ? 'input-field-error' : ''}`}
            placeholder="e.g., 3.75"
          />
          {errors.gpa && <p className="form-error-text">{errors.gpa}</p>}
        </div>

        {/* Achievements */}
        <div className="form-group">
          <label className="form-label">Achievements (Optional)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAchievement();
                }
              }}
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
            {isSubmitting ? 'Saving...' : education ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
