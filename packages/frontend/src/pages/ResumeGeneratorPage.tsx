import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobDescriptionInput from '../components/JobDescriptionInput';
import JobAnalysisView from '../components/JobAnalysisView';
import TemplateSelector from '../components/TemplateSelector';
import ResumeGenerator from '../components/ResumeGenerator';
import ResumeResult from '../components/ResumeResult';
import { JobDescription, Template, Resume } from '../types/resume.types';

type WizardStep = 'job-input' | 'analysis' | 'template' | 'generate' | 'result';

const ResumeGeneratorPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('job-input');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedResume, setGeneratedResume] = useState<Resume | null>(null);

  const steps: { id: WizardStep; label: string; icon: string }[] = [
    { id: 'job-input', label: 'Job Description', icon: '📝' },
    { id: 'analysis', label: 'Analysis', icon: '🔍' },
    { id: 'template', label: 'Template', icon: '🎨' },
    { id: 'generate', label: 'Generate', icon: '⚙️' },
    { id: 'result', label: 'Result', icon: '✅' },
  ];

  const handleJobAnalyzed = (job: JobDescription) => {
    setJobDescription(job);
    markStepCompleted('job-input');
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = () => {
    markStepCompleted('analysis');
    setCurrentStep('template');
  };

  const handleTemplateSelected = (template: Template) => {
    setSelectedTemplate(template);
    markStepCompleted('template');
    setCurrentStep('generate');
  };

  const handleResumeGenerated = (resume: Resume) => {
    setGeneratedResume(resume);
    markStepCompleted('generate');
    setCurrentStep('result');
  };

  const handleGenerateAnother = () => {
    setCurrentStep('job-input');
    setCompletedSteps(new Set());
    setJobDescription(null);
    setSelectedTemplate(null);
    setGeneratedResume(null);
  };

  const markStepCompleted = (step: WizardStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const canNavigateToStep = (step: WizardStep): boolean => {
    const targetIndex = steps.findIndex((s) => s.id === step);
    if (targetIndex === 0) return true;
    const previousStep = steps[targetIndex - 1];
    return completedSteps.has(previousStep.id);
  };

  const handleStepClick = (step: WizardStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="back-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="page-title">Generate ATS-Optimized Resume</h1>
          <p className="page-subtitle">
            Create a tailored resume that maximizes your chances of passing ATS screening
          </p>
        </div>

        {/* Progress Steps */}
        <div className="card-elevated mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!canNavigateToStep(step.id)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-black text-white shadow-xl scale-110'
                        : completedSteps.has(step.id)
                          ? 'bg-green-600 text-white shadow-lg'
                          : canNavigateToStep(step.id)
                            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {completedSteps.has(step.id) ? '✓' : step.icon}
                  </button>
                  <span
                    className={`mt-3 text-sm font-medium transition-colors ${
                      currentStep === step.id
                        ? 'text-black'
                        : completedSteps.has(step.id)
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${
                      completedSteps.has(step.id) ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card-elevated">
          {currentStep === 'job-input' && <JobDescriptionInput onJobAnalyzed={handleJobAnalyzed} />}
          {currentStep === 'analysis' && jobDescription && (
            <JobAnalysisView jobDescription={jobDescription} onContinue={handleAnalysisComplete} />
          )}
          {currentStep === 'template' && (
            <TemplateSelector onTemplateSelected={handleTemplateSelected} />
          )}
          {currentStep === 'generate' && jobDescription && selectedTemplate && (
            <ResumeGenerator
              jobDescriptionId={jobDescription.id}
              templateId={selectedTemplate.id}
              onResumeGenerated={handleResumeGenerated}
            />
          )}
          {currentStep === 'result' && generatedResume && (
            <ResumeResult resume={generatedResume} onGenerateAnother={handleGenerateAnother} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeGeneratorPage;
