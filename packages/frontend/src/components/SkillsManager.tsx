import { useState } from 'react';
import { Skill, SkillInput } from '../types/profile.types';
import SkillForm from './SkillForm';

interface SkillsManagerProps {
  skills: Skill[];
  onAdd: (data: SkillInput) => Promise<void>;
  onUpdate: (id: string, data: SkillInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SkillsManager = ({ skills, onAdd, onUpdate, onDelete }: SkillsManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    await onDelete(id);
  };

  const handleSubmit = async (data: SkillInput) => {
    if (editingSkill) {
      await onUpdate(editingSkill.id, data);
    } else {
      await onAdd(data);
    }
    setShowForm(false);
    setEditingSkill(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const groupedSkills = (skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return 'bg-gray-100 text-gray-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'soft':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'language':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (showForm) {
    return (
      <SkillForm
        skill={editingSkill}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills yet</h3>
        <p className="text-gray-600 mb-4">Add your first skill to get started</p>
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Add Skill
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="text-purple-600 mr-3">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {category} Skills ({categorySkills.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                    {skill.yearsOfExperience !== null && (
                      <p className="text-sm text-gray-600">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
