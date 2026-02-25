'use client';

import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

interface Props {
  onSectionSelect: (index: number) => void;
}

export default function AuditSidebar({ onSectionSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setup,
    sections,
    sectionData,
    currentSectionIndex,
    getTotalScore,
    getTotalMaxScore,
    setCurrentStep
  } = useAudit();

  const totalScore = getTotalScore();
  const maxScore = getTotalMaxScore();
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-neutral-200 rounded-lg shadow-sm"
      >
        <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-neutral-50 border-r border-neutral-200
        overflow-y-auto z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-semibold text-neutral-900">QM7 Audit</h2>
            <p className="text-sm text-neutral-600">{setup.serviceName}</p>
            {setup.auditNumber && (
              <p className="text-xs text-neutral-500 mt-1">Ref: {setup.auditNumber}</p>
            )}
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-neutral-200">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-neutral-600">Total Score</span>
              <span className="text-2xl font-bold text-neutral-900">{totalScore}/{maxScore}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  scorePercentage >= 80 ? 'bg-green-500' :
                  scorePercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-2">{scorePercentage}% complete</p>
          </div>

          {/* Section List */}
          <nav className="space-y-2">
            {sections.map((section, index) => {
              const data = sectionData.get(section.id);
              const sectionScore = data?.score || 0;
              const isComplete = data?.isSaved;
              const hasNarrative = data?.isNarrativeSaved;
              const isCurrent = index === currentSectionIndex;

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionSelect(index);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-neutral-900 text-white'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-neutral-900'}`}>
                      {section.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {isComplete && (
                        <span className={`text-xs ${isCurrent ? 'text-green-300' : 'text-green-600'}`}>
                          ✓
                        </span>
                      )}
                      {hasNarrative && (
                        <span className={`text-xs ${isCurrent ? 'text-blue-300' : 'text-blue-600'}`}>
                          ✎
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {sectionScore}/{section.maxScore} points
                    </span>
                    <span className={`text-xs ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {section.questions.length} questions
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
            <button
              onClick={() => setCurrentStep('setup')}
              className="w-full text-left p-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              ← Back to Setup
            </button>
            <button
              onClick={() => setCurrentStep('report')}
              className="w-full p-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              View Report
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
