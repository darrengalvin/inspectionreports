'use client';

import { useState } from 'react';
import { InspectionProvider, useInspection } from './context/InspectionContext';
import PropertySetup from './components/PropertySetup';
import Sidebar from './components/Sidebar';
import SectionQuestionnaire from './components/SectionQuestionnaire';
import AIAnalysis from './components/AIAnalysis';
import ReportPreview from './components/ReportPreview';
import { inspectionSections } from './data/sections';

function InspectionApp() {
  const [started, setStarted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { currentSectionIndex, setCurrentSectionIndex, generateReportData } = useInspection();

  const handleNext = () => {
    if (currentSectionIndex < inspectionSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setShowReport(true);
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

  if (!started) {
    return <PropertySetup onComplete={() => setStarted(true)} />;
  }

  if (showReport) {
    const reportData = generateReportData();
    return <ReportPreview data={reportData} onBack={() => setShowReport(false)} />;
  }

  const currentSection = inspectionSections[currentSectionIndex];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onSectionSelect={handleSectionSelect} />
      
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="max-w-3xl mx-auto p-4 sm:p-8 lg:p-12">
          <SectionQuestionnaire
            section={currentSection}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentSectionIndex === 0}
            isLast={currentSectionIndex === inspectionSections.length - 1}
          />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <InspectionProvider>
      <InspectionApp />
      <AIAnalysis />
    </InspectionProvider>
  );
}
