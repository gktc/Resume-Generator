import { Education } from '../types/profile.types';

interface EducationListProps {
  educationList: Education[];
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

const EducationList = ({ educationList, onEdit, onDelete }: EducationListProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (!educationList || educationList.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
          <h3 className="section-header">No education yet</h3>
          <p className="empty-state-text">Add your first education entry to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {educationList.map((education) => (
        <div key={education.id} className="card">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="section-header">{education.degree}</h3>
                <p className="form-label">{education.institution}</p>
                <p className="page-subtitle">{education.fieldOfStudy}</p>
                <p className="form-helper-text">
                  {formatDate(education.startDate)} - {formatDate(education.endDate)}
                </p>
                {education.gpa && <p className="form-helper-text">GPA: {education.gpa}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(education)}
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
                  onClick={() => onDelete(education.id)}
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

          {education.achievements && education.achievements.length > 0 && (
            <div className="card-body">
              <h4 className="form-label">Achievements:</h4>
              <ul className="list-disc list-inside space-y-1">
                {education.achievements.map((achievement, index) => (
                  <li key={index} className="page-subtitle">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationList;
