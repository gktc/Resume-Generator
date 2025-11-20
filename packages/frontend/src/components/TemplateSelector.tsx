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
    filterCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === filterCategory);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-800 font-semibold">Error Loading Templates</span>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchTemplates}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose a Template</h2>
      <p className="text-gray-600 mb-6">
        Select a professional template that best fits your industry and personal style.
      </p>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600">No templates found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Template</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-900 font-medium">{selectedTemplate.name}</p>
              <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedTemplate.category}
            </span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
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
