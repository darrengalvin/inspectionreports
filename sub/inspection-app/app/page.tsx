'use client';

import { useState } from 'react';
import { InspectionProvider, useInspection } from './context/InspectionContext';
import PropertySetup from './components/PropertySetup';
import Sidebar from './components/Sidebar';
import SectionQuestionnaire from './components/SectionQuestionnaire';
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

// Simple report preview (can be expanded)
function ReportPreview({ data, onBack }: { data: any; onBack: () => void }) {
  const getStatusColor = (status: string) => {
    if (status === 'meeting-standard') return 'text-green-600 bg-green-50';
    if (status === 'improvement-needed') return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'meeting-standard') return 'Meeting Standard';
    if (status === 'improvement-needed') return 'Improvement Needed';
    return 'Inadequate';
  };

  const meetingStandard = data.sections.filter((s: any) => s.status === 'meeting-standard').length;
  const needsImprovement = data.sections.filter((s: any) => s.status === 'improvement-needed').length;
  const inadequate = data.sections.filter((s: any) => s.status === 'inadequate').length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 sm:mb-8 text-neutral-600 hover:text-neutral-900 text-sm flex items-center gap-2"
        >
          ← Back to questionnaire
        </button>

        {/* Header */}
        <header className="border-b border-neutral-200 pb-6 sm:pb-8 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900">{data.propertyName}</h1>
              <p className="text-neutral-600 mt-1 text-sm sm:text-base">Supported Housing Quality Inspection</p>
            </div>
            <div className="text-left sm:text-right text-sm text-neutral-600">
              <p><strong>Provider:</strong> {data.providerName}</p>
              <p><strong>Date:</strong> {data.date}</p>
              <p><strong>Interviewed:</strong> {data.residentsInterviewed} of {data.totalResidents}</p>
              <p><strong>Ref:</strong> {data.id}</p>
            </div>
          </div>
        </header>

        {/* Overall Score */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center p-6 border border-neutral-200 rounded-xl">
            <p className={`text-5xl font-bold ${
              data.overallScore >= 7 ? 'text-green-600' :
              data.overallScore >= 5 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {data.overallScore}
            </p>
            <p className="text-sm text-neutral-500 uppercase tracking-wide mt-2">Overall Score</p>
            <p className="text-sm font-medium text-neutral-700 mt-1 capitalize">
              {data.overallVerdict.replace('-', ' ')}
            </p>
          </div>
          
          <div className="sm:col-span-2 p-4 sm:p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-medium text-neutral-900 mb-3">Summary</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-neutral-700">{meetingStandard} meeting standard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-sm text-neutral-700">{needsImprovement} need improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-neutral-700">{inadequate} inadequate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {data.sections.map((section: any, index: number) => {
            const sectionInfo = inspectionSections.find(s => s.id === section.sectionId);
            return (
              <div key={section.sectionId} className="border-b border-neutral-200 pb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-neutral-500 uppercase tracking-wide">
                      Section {index + 1}
                    </p>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {sectionInfo?.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      section.score >= 7 ? 'text-green-600' :
                      section.score >= 5 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {section.score}/10
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(section.status)}`}>
                      {getStatusLabel(section.status)}
                    </span>
                  </div>
                </div>

                {/* Findings */}
                {section.responses.some((r: any) => r.finding) && (
                  <div className="mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="text-left py-2 text-neutral-500 font-medium">Question</th>
                          <th className="text-left py-2 text-neutral-500 font-medium">Finding</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.responses.filter((r: any) => r.finding).map((response: any) => {
                          const question = sectionInfo?.questions.find(q => q.id === response.questionId);
                          return (
                            <tr key={response.questionId} className="border-b border-neutral-50">
                              <td className="py-3 pr-4 text-neutral-700 align-top w-1/3">
                                {question?.text}
                              </td>
                              <td className="py-3 text-neutral-600">
                                {response.finding}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Quotes */}
                {section.quotes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {section.quotes.map((quote: any, qIdx: number) => (
                      <div 
                        key={qIdx}
                        className={`p-3 rounded border-l-4 ${
                          quote.sentiment === 'positive' ? 'bg-green-50 border-green-500' :
                          quote.sentiment === 'concern' ? 'bg-red-50 border-red-500' :
                          'bg-neutral-50 border-neutral-300'
                        }`}
                      >
                        <p className="italic text-neutral-700 text-sm">"{quote.text}"</p>
                        <p className="text-xs text-neutral-500 mt-1">— {quote.residentId}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Why this score */}
                {section.whyThisScore && (
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Why this score?</h4>
                    <p className="text-sm text-neutral-600">{section.whyThisScore}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Export Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 transition-colors"
          >
            Print / Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <InspectionProvider>
      <InspectionApp />
    </InspectionProvider>
  );
}
