import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Template } from '../types/resume.types';

interface TemplateSelectorProps {
  onTemplateSelected: (template: Template) => void;
}

const TemplateSelector = ({ onTemplateSelected }: TemplateSelectorProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: Template[] }>('/templates');
      setTemplates(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onTemplateSelected(selectedTemplate);
    }
  };

  const categories = ['all', 'modern', 'classic', 'creative', 'academic', 'technical'];

  const filteredTemplates =
    filterCategory === 'all' ? templates : templates.filter((t) => t.category === filterCategory);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-error">
        <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="notification-content">
          <span className="font-semibold">Error Loading Templates</span>
          <p className="mt-1">{error}</p>
          <button onClick={fetchTemplates} className="btn-danger btn-sm mt-2">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Choose a Template</h2>
        <p className="page-subtitle">
          Select a professional template that best fits your industry and personal style.
        </p>
      </div>

      {/* Category Filter */}
      <div className="section">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={
                filterCategory === category ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="empty-state-text">No templates found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`card-interactive ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                  : ''
              }`}
            >
              {/* Template Preview Image */}
              <div className="relative bg-gray-100 rounded-t-lg overflow-hidden aspect-[8.5/11]">
                {template.previewImageUrl ? (
                  <img
                    src={template.previewImageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="badge-neutral badge-sm">{template.category}</span>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="notification-info mb-6">
          <div className="notification-content">
            <h3 className="font-semibold mb-2">Selected Template</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedTemplate.name}</p>
                <p className="text-sm">{selectedTemplate.description}</p>
              </div>
              <span className="badge-info">{selectedTemplate.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Continue to Generation
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;
