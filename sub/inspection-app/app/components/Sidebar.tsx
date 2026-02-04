'use client';

import React, { useState } from 'react';
import { inspectionSections } from '../data/sections';
import { useInspection } from '../context/InspectionContext';

interface Props {
  onSectionSelect: (index: number) => void;
}

export default function Sidebar({ onSectionSelect }: Props) {
  const { currentSectionIndex, sectionResponses, propertyName, getProgress } = useInspection();
  const [isOpen, setIsOpen] = useState(false);
  
  const progress = getProgress();

  const getStatusIcon = (sectionId: string) => {
    const response = sectionResponses.get(sectionId);
    if (!response || !response.whyThisScore) return null;
    
    if (response.score >= 7) {
      return <span className="w-2 h-2 rounded-full bg-green-500" />;
    } else if (response.score >= 5) {
      return <span className="w-2 h-2 rounded-full bg-amber-500" />;
    } else {
      return <span className="w-2 h-2 rounded-full bg-red-500" />;
    }
  };

  const handleSectionClick = (index: number) => {
    onSectionSelect(index);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-neutral-900 text-sm">Inspection</p>
          {propertyName && <p className="text-xs text-neutral-500">{propertyName}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-900">{Math.round(progress)}%</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-neutral-50 border-r border-neutral-200 h-screen overflow-y-auto flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="p-5 border-b border-neutral-200">
        <h1 className="text-lg font-semibold text-neutral-900">Inspection</h1>
        {propertyName && (
          <p className="text-sm text-neutral-600 mt-1">{propertyName}</p>
        )}
      </div>
      
      {/* Progress */}
      <div className="p-5 border-b border-neutral-200">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-600">Progress</span>
          <span className="font-medium text-neutral-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide px-2 mb-2">
            Sections
          </p>
          <nav className="space-y-1">
            {inspectionSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                          flex items-center justify-between gap-2 ${
                  index === currentSectionIndex
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-medium ${
                    index === currentSectionIndex
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {section.number}
                  </span>
                  <span className="truncate">{section.title}</span>
                </div>
                {getStatusIcon(section.id)}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <button 
          className="w-full px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium 
                   rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
    </>
  );
}
