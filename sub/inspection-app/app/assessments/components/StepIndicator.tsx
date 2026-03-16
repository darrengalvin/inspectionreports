'use client';

import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

const STEPS = [
  { key: 'individual', label: 'Individual' },
  { key: 'facility', label: 'Facility' },
  { key: 'staff', label: 'Staff' },
  { key: 'residents', label: 'Residents' },
  { key: 'results', label: 'Results' },
  { key: 'transition', label: 'Transition' },
] as const;

export default function StepIndicator() {
  const { currentStep, setCurrentStep } = useAssessment();
  const currentIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="max-w-2xl mx-auto px-8 pt-6 no-print">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          const isClickable = index <= currentIndex;

          return (
            <React.Fragment key={step.key}>
              {index > 0 && (
                <div className={`flex-1 h-0.5 mx-1 ${isCompleted ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              )}
              <button
                onClick={() => isClickable ? setCurrentStep(step.key) : undefined}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-1 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isActive ? 'bg-neutral-900 text-white'
                  : isCompleted ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {step.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
