import { ATSScore } from '../types/resume.types';
import { useState, useEffect } from 'react';

interface ATSScoreDisplayProps {
  atsScore: ATSScore;
}

const ATSScoreDisplay = ({ atsScore }: ATSScoreDisplayProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = atsScore.overall / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(Math.round(increment * currentStep), atsScore.overall));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [atsScore.overall]);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const breakdownItems = [
    { label: 'Keyword Match', score: atsScore.breakdown.keywordMatch },
    { label: 'Experience Relevance', score: atsScore.breakdown.experienceRelevance },
    { label: 'Format Parseability', score: atsScore.breakdown.formatParseability },
    { label: 'Education Match', score: atsScore.breakdown.educationMatch },
  ];

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Score - Minimalist Circular Gauge */}
      <div className="card-elevated border-2 border-black p-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-semibold text-black mb-2">ATS Compatibility Score</h3>
            <p className="text-gray-600 text-lg">
              How well your resume performs with Applicant Tracking Systems
            </p>
          </div>

          {/* Minimalist Circular Progress Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle cx="96" cy="96" r="70" stroke="#E5E5E5" strokeWidth="12" fill="none" />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#000000"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold text-black transition-all duration-500">
                {animatedScore}
              </span>
              <span className="text-sm text-gray-600 font-medium mt-1 uppercase tracking-wider">
                {getScoreLabel(animatedScore)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown - Minimalist Stat Bars */}
      <div className="card">
        <h4 className="section-header">Score Breakdown</h4>
        <div className="space-y-4">
          {breakdownItems.map((item, index) => (
            <div
              key={item.label}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              {/* Stat header */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{item.label}</span>
                <span className="text-2xl font-bold text-black">{item.score}</span>
              </div>

              {/* Minimalist stat bar */}
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${item.score}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      {atsScore.missingKeywords.length > 0 && (
        <div className="card border-2 border-gray-900">
          <h4 className="section-header flex items-center">
            <span className="mr-2">⚠️</span>
            Missing Keywords ({atsScore.missingKeywords.length})
          </h4>
          <p className="form-helper-text mb-4">
            These keywords from the job description are not present in your resume:
          </p>
          <div className="flex flex-wrap gap-2">
            {atsScore.missingKeywords.map((keyword, index) => (
              <span key={index} className="skill-tag">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {atsScore.suggestions.length > 0 && (
        <div className="card">
          <h4 className="section-header flex items-center">
            <span className="mr-2">💡</span>
            Improvement Suggestions
          </h4>
          <ul className="space-y-3">
            {atsScore.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-item animate-slide-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <span className="text-black mr-3 font-bold">→</span>
                <span className="text-gray-700 leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score Interpretation */}
      <div className="card">
        <h4 className="section-header">Understanding Your Score</h4>
        <div className="space-y-4">
          <div className="list-item flex items-start gap-4">
            <div className="min-w-[80px] h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold">
              80-100
            </div>
            <div className="flex-1">
              <p className="font-bold text-black mb-1">Excellent</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your resume is highly optimized for ATS and should pass most automated screenings
                with ease!
              </p>
            </div>
          </div>

          <div className="list-item flex items-start gap-4">
            <div className="min-w-[80px] h-12 bg-gray-700 text-white rounded-lg flex items-center justify-center font-bold">
              60-79
            </div>
            <div className="flex-1">
              <p className="font-bold text-black mb-1">Good</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your resume has a solid chance of passing ATS, but could benefit from some
                optimization.
              </p>
            </div>
          </div>

          <div className="list-item flex items-start gap-4">
            <div className="min-w-[80px] h-12 bg-gray-300 text-gray-900 rounded-lg flex items-center justify-center font-bold">
              0-59
            </div>
            <div className="flex-1">
              <p className="font-bold text-black mb-1">Needs Improvement</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your resume may struggle with ATS. Consider adding more relevant keywords and
                improving formatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreDisplay;
