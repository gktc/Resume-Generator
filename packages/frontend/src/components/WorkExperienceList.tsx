import { WorkExperience } from '../types/profile.types';

interface WorkExperienceListProps {
  experiences: WorkExperience[];
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: string) => void;
}

const WorkExperienceList = ({ experiences, onEdit, onDelete }: WorkExperienceListProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (!experiences || experiences.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="section-header">No work experience yet</h3>
          <p className="empty-state-text">Add your first work experience to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience) => (
        <div key={experience.id} className="card">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="section-header">{experience.position}</h3>
                <p className="form-label">{experience.company}</p>
                <p className="form-helper-text">
                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(experience)}
                  className="btn-icon-sm btn-secondary"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(experience.id)}
                  className="btn-icon-sm btn-danger"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <p className="page-subtitle mb-4 whitespace-pre-line">{experience.description}</p>

            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="form-label">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {experience.achievements.map((achievement, index) => (
                    <li key={index} className="page-subtitle">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {experience.technologies && experience.technologies.length > 0 && (
              <div>
                <h4 className="form-label">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, index) => (
                    <span key={index} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExperienceList;
