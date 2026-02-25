'use client';

import React from 'react';
import { AuditProvider, useAudit } from './context/AuditContext';
import AuditSetup from './components/AuditSetup';
import VisitDetails from './components/VisitDetails';
import AuditSection from './components/AuditSection';
import AuditSidebar from './components/AuditSidebar';
import AuditReport from './components/AuditReport';
import { requiresVisitDetails } from './types/audit';

function QM7AuditApp() {
  const {
    setup,
    currentStep,
    currentSectionIndex,
    setCurrentSectionIndex,
    sections,
    setCurrentStep
  } = useAudit();

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setCurrentStep('report');
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSectionSelect = (index: number) => {
    setCurrentSectionIndex(index);
    window.scrollTo(0, 0);
  };

  // Setup step
  if (currentStep === 'setup') {
    return <AuditSetup />;
  }

  // Visit details step (only for supported-living and day-service)
  if (currentStep === 'visit-details') {
    if (!requiresVisitDetails(setup.serviceType)) {
      setCurrentStep('audit');
      return null;
    }
    return <VisitDetails />;
  }

  // Audit step
  if (currentStep === 'audit') {
    if (sections.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No Sections Available</h2>
            <p className="text-neutral-600 mb-4">Please select a country to load the audit sections.</p>
            <button
              onClick={() => setCurrentStep('setup')}
              className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800"
            >
              Go to Setup
            </button>
          </div>
        </div>
      );
    }

    const currentSection = sections[currentSectionIndex];

    return (
      <div className="flex min-h-screen bg-white">
        <AuditSidebar onSectionSelect={handleSectionSelect} />
        
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <AuditSection
            section={currentSection}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentSectionIndex === 0}
            isLast={currentSectionIndex === sections.length - 1}
          />
        </main>
      </div>
    );
  }

  // Report step
  if (currentStep === 'report') {
    return <AuditReport />;
  }

  return null;
}

export default function QM7Page() {
  return (
    <AuditProvider>
      <QM7AuditApp />
    </AuditProvider>
  );
}
