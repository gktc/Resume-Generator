import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { InterviewRound, InterviewExperienceInput } from '../types/interview.types';

type FormStep = 'basic' | 'rounds' | 'tips';

const InterviewExperienceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic info state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [outcome, setOutcome] = useState<'offer' | 'rejected' | 'pending' | 'withdrew'>('pending');
  const [overallDifficulty, setOverallDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Rounds state
  const [rounds, setRounds] = useState<InterviewRound[]>([
    {
      roundNumber: 1,
      roundType: 'phone-screen',
      duration: 30,
      difficulty: 'medium',
      topics: [],
      questions: [],
      notes: '',
    },
  ]);

  // Tips state
  const [preparationTips, setPreparationTips] = useState<string[]>(['']);

  const handleAddRound = () => {
    setRounds([
      ...rounds,
      {
        roundNumber: rounds.length + 1,
        roundType: 'technical',
        duration: 60,
        difficulty: 'medium',
        topics: [],
        questions: [],
        notes: '',
      },
    ]);
  };

  const handleRemoveRound = (index: number) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index));
    }
  };

  const handleRoundChange = (index: number, field: keyof InterviewRound, value: any) => {
    const updatedRounds = [...rounds];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };
    setRounds(updatedRounds);
  };

  const handleAddTopic = (roundIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].topics.push('');
    setRounds(updatedRounds);
  };

  const handleTopicChange = (roundIndex: number, topicIndex: number, value: string) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].topics[topicIndex] = value;
    setRounds(updatedRounds);
  };

  const handleRemoveTopic = (roundIndex: number, topicIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].topics.splice(topicIndex, 1);
    setRounds(updatedRounds);
  };

  const handleAddQuestion = (roundIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].questions.push('');
    setRounds(updatedRounds);
  };

  const handleQuestionChange = (roundIndex: number, questionIndex: number, value: string) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].questions[questionIndex] = value;
    setRounds(updatedRounds);
  };

  const handleRemoveQuestion = (roundIndex: number, questionIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].questions.splice(questionIndex, 1);
    setRounds(updatedRounds);
  };

  const handleAddTip = () => {
    setPreparationTips([...preparationTips, '']);
  };

  const handleTipChange = (index: number, value: string) => {
    const updatedTips = [...preparationTips];
    updatedTips[index] = value;
    setPreparationTips(updatedTips);
  };

  const handleRemoveTip = (index: number) => {
    if (preparationTips.length > 1) {
      setPreparationTips(preparationTips.filter((_, i) => i !== index));
    }
  };

  const validateBasicInfo = (): boolean => {
    if (!company.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!role.trim()) {
      setError('Role is required');
      return false;
    }
    if (!interviewDate) {
      setError('Interview date is required');
      return false;
    }
    return true;
  };

  const validateRounds = (): boolean => {
    for (const round of rounds) {
      if (round.duration <= 0) {
        setError('Round duration must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setError(null);

    if (currentStep === 'basic') {
      if (validateBasicInfo()) {
        setCurrentStep('rounds');
      }
    } else if (currentStep === 'rounds') {
      if (validateRounds()) {
        setCurrentStep('tips');
      }
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep === 'rounds') {
      setCurrentStep('basic');
    } else if (currentStep === 'tips') {
      setCurrentStep('rounds');
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      // Filter out empty tips
      const filteredTips = preparationTips.filter((tip) => tip.trim() !== '');

      // Clean up rounds data
      const cleanedRounds = rounds.map((round) => ({
        ...round,
        topics: round.topics.filter((t) => t.trim() !== ''),
        questions: round.questions.filter((q) => q.trim() !== ''),
      }));

      const experienceData: InterviewExperienceInput = {
        company,
        role,
        interviewDate: new Date(interviewDate),
        outcome,
        overallDifficulty,
        preparationTips: filteredTips,
        rounds: cleanedRounds,
      };

      await api.post('/interview/experience', experienceData);

      // Show success message and redirect
      alert('Interview experience submitted successfully!');
      navigate(`/interview/insights/${encodeURIComponent(company)}/${encodeURIComponent(role)}`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to submit interview experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="page-container max-w-4xl">
        <div className="card">
          <h1 className="page-title">Share Your Interview Experience</h1>
          <p className="page-subtitle mb-6">
            Help others prepare by sharing your interview experience anonymously
          </p>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'basic' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Basic Info</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep !== 'basic' ? 'bg-green-600' : 'bg-gray-200'}`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'rounds'
                    ? 'bg-blue-600 text-white'
                    : currentStep === 'tips'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Interview Rounds</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep === 'tips' ? 'bg-green-600' : 'bg-gray-200'}`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'tips' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="ml-2 text-sm font-medium">Preparation Tips</span>
            </div>
          </div>

          {error && (
            <div className="notification-error">
              <span className="notification-content">{error}</span>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interview Date *</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Outcome</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as any)}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrew">Withdrew</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Overall Difficulty</label>
                <select
                  value={overallDifficulty}
                  onChange={(e) => setOverallDifficulty(e.target.value as any)}
                  className="input-field"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Interview Rounds */}
          {currentStep === 'rounds' && (
            <div className="space-y-6">
              {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Round {roundIndex + 1}</h3>
                    {rounds.length > 1 && (
                      <button
                        onClick={() => handleRemoveRound(roundIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">Round Type</label>
                      <select
                        value={round.roundType}
                        onChange={(e) => handleRoundChange(roundIndex, 'roundType', e.target.value)}
                        className="input-field"
                      >
                        <option value="phone-screen">Phone Screen</option>
                        <option value="technical">Technical</option>
                        <option value="system-design">System Design</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="cultural-fit">Cultural Fit</option>
                        <option value="take-home">Take Home</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        value={round.duration}
                        onChange={(e) =>
                          handleRoundChange(roundIndex, 'duration', parseInt(e.target.value))
                        }
                        className="input-field"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      value={round.difficulty}
                      onChange={(e) => handleRoundChange(roundIndex, 'difficulty', e.target.value)}
                      className="input-field"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topics Covered</label>
                    {round.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) =>
                            handleTopicChange(roundIndex, topicIndex, e.target.value)
                          }
                          className="input-field flex-1"
                          placeholder="e.g., Data Structures, Algorithms"
                        />
                        <button
                          onClick={() => handleRemoveTopic(roundIndex, topicIndex)}
                          className="btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button onClick={() => handleAddTopic(roundIndex)} className="btn-ghost btn-sm">
                      + Add Topic
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Questions Asked</label>
                    {round.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) =>
                            handleQuestionChange(roundIndex, questionIndex, e.target.value)
                          }
                          className="input-field flex-1"
                          placeholder="Enter a question that was asked"
                        />
                        <button
                          onClick={() => handleRemoveQuestion(roundIndex, questionIndex)}
                          className="btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddQuestion(roundIndex)}
                      className="btn-ghost btn-sm"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      value={round.notes}
                      onChange={(e) => handleRoundChange(roundIndex, 'notes', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Any additional notes about this round..."
                    />
                  </div>
                </div>
              ))}

              <button onClick={handleAddRound} className="btn-ghost w-full border-2 border-dashed">
                + Add Another Round
              </button>
            </div>
          )}

          {/* Step 3: Preparation Tips */}
          {currentStep === 'tips' && (
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Preparation Tips</label>
                <p className="form-helper-text">
                  Share tips that helped you prepare for this interview
                </p>
                {preparationTips.map((tip, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleTipChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="e.g., Practice LeetCode medium problems"
                    />
                    {preparationTips.length > 1 && (
                      <button onClick={() => handleRemoveTip(index)} className="btn-danger btn-sm">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={handleAddTip} className="btn-ghost btn-sm">
                  + Add Tip
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 'basic'}
              className={
                currentStep === 'basic'
                  ? 'btn-secondary opacity-50 cursor-not-allowed'
                  : 'btn-secondary'
              }
            >
              Back
            </button>

            {currentStep !== 'tips' ? (
              <button onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                {loading ? 'Submitting...' : 'Submit Experience'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewExperienceFormPage;
