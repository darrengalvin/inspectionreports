'use client';

import React from 'react';
import { useAudit } from '../context/AuditContext';
import {
  CareSupportSystem,
  CARE_SYSTEM_LABELS,
  CARE_SYSTEMS_LIST,
  getWordCount,
} from '../types/audit';

export default function CareSystemsObservation() {
  const {
    setup,
    observationAudit,
    updateObservationAudit,
    isObservationValid,
    saveObservation,
    isObservationSaved,
    setCurrentStep,
  } = useAudit();

  const overviewWordCount = getWordCount(observationAudit.observationOverview);
  const recWordCount = getWordCount(observationAudit.recommendationsText);

  return (
    <div className="min-h-screen bg-white">
      {setup.auditNumber && (
        <div className="fixed top-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <span className="text-xs text-neutral-400 block">Audit Reference</span>
          <span className="text-lg font-semibold">{setup.auditNumber}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-8 pt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Care Support Systems & Observation Audit
          </h1>
          <p className="text-neutral-600">
            Select the care support system in use and complete the observation audit.
          </p>
        </div>

        <div className="space-y-8">
          {/* Care Support System Dropdown */}
          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Care Support System</h2>
            <p className="text-sm text-neutral-500 mb-4">Which digital care system does the service use?</p>
            <select
              value={observationAudit.careSupportSystem || ''}
              onChange={(e) => updateObservationAudit({ careSupportSystem: (e.target.value || null) as CareSupportSystem | null })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
            >
              <option value="">Select care support system...</option>
              {CARE_SYSTEMS_LIST.map(sys => (
                <option key={sys} value={sys}>{CARE_SYSTEM_LABELS[sys]}</option>
              ))}
            </select>
          </div>

          {/* Observation Audit Questions */}
          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Observation Audit</h2>
            <p className="text-sm text-neutral-500 mb-6">Observe the care system in use and answer the following.</p>

            <div className="space-y-6">
              {/* Q1: Recent care notes */}
              <div className="border-b border-neutral-100 pb-5">
                <p className="text-neutral-900 font-medium mb-3">1. Recent input of care support notes?</p>
                <div className="flex gap-3" role="group" aria-label="Recent input of care support notes?">
                  <button
                    onClick={() => updateObservationAudit({ recentCareNotes: true })}
                    aria-label="Answer yes to recent input of care support notes"
                    aria-pressed={observationAudit.recentCareNotes === true}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.recentCareNotes === true
                        ? 'bg-green-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-400'
                    }`}
                  >Yes</button>
                  <button
                    onClick={() => updateObservationAudit({ recentCareNotes: false })}
                    aria-label="Answer no to recent input of care support notes"
                    aria-pressed={observationAudit.recentCareNotes === false}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.recentCareNotes === false
                        ? 'bg-red-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-red-400'
                    }`}
                  >No</button>
                </div>
              </div>

              {/* Q2: Red overdue dates */}
              <div className="border-b border-neutral-100 pb-5">
                <p className="text-neutral-900 font-medium mb-3">2. Any red overdue dates for example – support plans, risk assessments?</p>
                <div className="flex gap-3" role="group" aria-label="Any red overdue dates?">
                  <button
                    onClick={() => updateObservationAudit({ redOverdueDates: true })}
                    aria-label="Answer yes to red overdue dates"
                    aria-pressed={observationAudit.redOverdueDates === true}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.redOverdueDates === true
                        ? 'bg-red-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-red-400'
                    }`}
                  >Yes (Overdue)</button>
                  <button
                    onClick={() => updateObservationAudit({ redOverdueDates: false })}
                    aria-label="Answer no to red overdue dates"
                    aria-pressed={observationAudit.redOverdueDates === false}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.redOverdueDates === false
                        ? 'bg-green-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-400'
                    }`}
                  >No</button>
                </div>
              </div>

              {/* Q3: Staff system skill */}
              <div className="border-b border-neutral-100 pb-5">
                <p className="text-neutral-900 font-medium mb-3">3. Staff skill in knowing their way around the system?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Staff skill in knowing their way around the system">
                  {(['excellent', 'good', 'adequate', 'poor'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => updateObservationAudit({ staffSystemSkill: level })}
                      aria-label={`Select ${level} for staff system skill`}
                      aria-pressed={observationAudit.staffSystemSkill === level}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all ${
                        observationAudit.staffSystemSkill === level
                          ? level === 'excellent' ? 'bg-green-600 text-white'
                            : level === 'good' ? 'bg-blue-600 text-white'
                            : level === 'adequate' ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                      }`}
                    >{level}</button>
                  ))}
                </div>
              </div>

              {/* Q4: Notification count */}
              <div className="border-b border-neutral-100 pb-5">
                <p className="text-neutral-900 font-medium mb-3">4. How many notifications are there when they first log on (bell)?</p>
                <select
                  value={observationAudit.notificationCount}
                  onChange={(e) => updateObservationAudit({ notificationCount: e.target.value })}
                  className="w-full sm:w-64 px-4 py-3 border border-neutral-200 rounded-lg text-base
                           focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
                >
                  <option value="">Select rough number...</option>
                  <option value="0">0 – None</option>
                  <option value="1-5">1–5</option>
                  <option value="6-10">6–10</option>
                  <option value="11-20">11–20</option>
                  <option value="21-50">21–50</option>
                  <option value="50+">50+</option>
                </select>
              </div>

              {/* Q5: Effective system */}
              <div className="border-b border-neutral-100 pb-5">
                <p className="text-neutral-900 font-medium mb-3">5. Effective system observed?</p>
                <div className="flex gap-3 mb-4" role="group" aria-label="Effective system observed?">
                  <button
                    onClick={() => updateObservationAudit({ effectiveSystem: true })}
                    aria-label="Answer yes to effective system observed"
                    aria-pressed={observationAudit.effectiveSystem === true}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.effectiveSystem === true
                        ? 'bg-green-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-400'
                    }`}
                  >Yes</button>
                  <button
                    onClick={() => updateObservationAudit({ effectiveSystem: false })}
                    aria-label="Answer no to effective system observed"
                    aria-pressed={observationAudit.effectiveSystem === false}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.effectiveSystem === false
                        ? 'bg-red-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-red-400'
                    }`}
                  >No</button>
                </div>

                <p className="text-sm text-neutral-600 mb-2">Observation overview (max 300 words)</p>
                <textarea
                  value={observationAudit.observationOverview}
                  onChange={(e) => updateObservationAudit({ observationOverview: e.target.value })}
                  placeholder="Provide an overview of your observation of the care support system in use..."
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                           focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                           placeholder:text-neutral-400 resize-none"
                />
                <p className={`text-sm mt-1 ${overviewWordCount > 300 ? 'text-red-600' : 'text-neutral-500'}`}>
                  {overviewWordCount}/300 words
                </p>
              </div>

              {/* Q6: Recommendations */}
              <div>
                <p className="text-neutral-900 font-medium mb-3">6. Any recommendations or concerns?</p>
                <div className="flex gap-3 mb-4" role="group" aria-label="Any recommendations or concerns?">
                  <button
                    onClick={() => updateObservationAudit({ hasRecommendations: true })}
                    aria-label="Answer yes to recommendations or concerns"
                    aria-pressed={observationAudit.hasRecommendations === true}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.hasRecommendations === true
                        ? 'bg-amber-500 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-amber-400'
                    }`}
                  >Yes</button>
                  <button
                    onClick={() => updateObservationAudit({ hasRecommendations: false })}
                    aria-label="Answer no to recommendations or concerns"
                    aria-pressed={observationAudit.hasRecommendations === false}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      observationAudit.hasRecommendations === false
                        ? 'bg-green-600 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-400'
                    }`}
                  >No</button>
                </div>

                {observationAudit.hasRecommendations && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-2">Please detail recommendations (max 250 words)</p>
                    <textarea
                      value={observationAudit.recommendationsText}
                      onChange={(e) => updateObservationAudit({ recommendationsText: e.target.value })}
                      placeholder="Detail any recommendations or concerns observed..."
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                               focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                               placeholder:text-neutral-400 resize-none"
                    />
                    <p className={`text-sm mt-1 ${recWordCount > 250 ? 'text-red-600' : 'text-neutral-500'}`}>
                      {recWordCount}/250 words
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save & Continue */}
          <button
            onClick={() => {
              saveObservation();
              setCurrentStep('accreditations');
            }}
            disabled={!isObservationValid()}
            className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors text-base"
          >
            {isObservationSaved ? 'Saved – Continue to Accreditations' : 'Save & Continue to Accreditations'}
          </button>

          <button
            onClick={() => setCurrentStep('visit-details')}
            className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 text-sm"
          >
            ← Back to Visit Details
          </button>
        </div>
      </div>
    </div>
  );
}
