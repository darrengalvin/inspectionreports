'use client';

import React from 'react';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import StepIndicator from './components/StepIndicator';
import IndividualForm from './components/IndividualForm';
import FacilityForm from './components/FacilityForm';
import StaffResidentsForm from './components/StaffResidentsForm';
import MatchingResults from './components/MatchingResults';
import TransitionPlanView from './components/TransitionPlanView';
import Link from 'next/link';

function AssessmentApp() {
  const { currentStep } = useAssessment();

  const renderStep = () => {
    switch (currentStep) {
      case 'individual': return <IndividualForm />;
      case 'facility': return <FacilityForm />;
      case 'staff':
      case 'residents': return <StaffResidentsForm />;
      case 'results': return <MatchingResults />;
      case 'transition': return <TransitionPlanView />;
      default: return <IndividualForm />;
    }
  };

  return (
    <div>
      <div className="no-print bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <span className="text-sm font-medium text-neutral-900">Placement Assessment</span>
        <div className="w-12" />
      </div>
      <StepIndicator />
      {renderStep()}
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <AssessmentProvider>
      <AssessmentApp />
    </AssessmentProvider>
  );
}
