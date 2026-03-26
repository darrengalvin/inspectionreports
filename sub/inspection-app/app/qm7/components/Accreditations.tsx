'use client';

import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import {
  AccreditationStatus,
  ACCREDITATION_LABELS,
  ACCREDITATION_STATUS_LABELS,
} from '../types/audit';
import BildAssessment from './BildAssessment';

const ACCREDITATION_KEYS = ['cpi', 'bildPbs', 'stomp', 'omg', 'rrn'] as const;
type AccreditationKey = typeof ACCREDITATION_KEYS[number];

const STATUS_OPTIONS: AccreditationStatus[] = ['yes', 'no', 'in-progress', 'expired'];

const STATUS_COLORS: Record<string, { active: string; hover: string }> = {
  'yes': { active: 'bg-green-600 text-white', hover: 'hover:border-green-400' },
  'no': { active: 'bg-red-600 text-white', hover: 'hover:border-red-400' },
  'in-progress': { active: 'bg-blue-600 text-white', hover: 'hover:border-blue-400' },
  'expired': { active: 'bg-amber-500 text-white', hover: 'hover:border-amber-400' },
};

const ACCREDITATION_DESCRIPTIONS: Record<string, string> = {
  'cpi': 'Crisis Prevention Institute – de-escalation and behaviour support training.',
  'bildPbs': 'British Institute of Learning Disabilities – Positive Behaviour Support framework.',
  'stomp': 'Stopping Over-Medication of People with a learning disability, autism or both.',
  'omg': 'Outcomes Measurement Guide for learning disability services.',
  'rrn': 'Restraint Reduction Network – standards for restrictive practice reduction.',
};

export default function Accreditations() {
  const {
    setup,
    accreditations,
    updateAccreditations,
    isAccreditationsValid,
    saveAccreditations,
    isAccreditationsSaved,
    setCurrentStep,
  } = useAudit();

  const [showBild, setShowBild] = useState(false);

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Accreditations
          </h1>
          <p className="text-neutral-600">
            Record the service&apos;s current accreditation status for each framework.
          </p>
          <button
            onClick={() => {
              updateAccreditations({
                cpi: 'yes',
                bildPbs: 'in-progress',
                stomp: 'yes',
                omg: 'no',
                rrn: 'yes',
                bildObservationNotes: 'The service has begun implementing PBS across all supported living properties. A PBS lead has been appointed and is currently working through the BILD accreditation process. Functional assessments are conducted for all individuals with behaviours of concern.',
              });
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Auto-fill for Demo
          </button>
        </div>

        <div className="space-y-6">
          {ACCREDITATION_KEYS.map((key) => (
            <div key={key} className="border border-neutral-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {ACCREDITATION_LABELS[key]}
                </h3>
                {accreditations[key] && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    accreditations[key] === 'yes' ? 'bg-green-100 text-green-700'
                    : accreditations[key] === 'no' ? 'bg-red-100 text-red-700'
                    : accreditations[key] === 'in-progress' ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ACCREDITATION_STATUS_LABELS[accreditations[key] as string]}
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-500 mb-4">{ACCREDITATION_DESCRIPTIONS[key]}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    onClick={() => updateAccreditations({ [key]: status } as Partial<Record<AccreditationKey, AccreditationStatus>>)}
                    className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      accreditations[key] === status
                        ? STATUS_COLORS[status as string].active
                        : `bg-white text-neutral-700 border border-neutral-200 ${STATUS_COLORS[status as string].hover}`
                    }`}
                  >
                    {ACCREDITATION_STATUS_LABELS[status as string]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* BILD Observation Notes */}
          <div className="border border-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              BILD PBS Observation Notes
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              How is a BILD observation/assessment carried out at this service? Include any relevant details
              about their PBS practice framework.
            </p>
            <textarea
              value={accreditations.bildObservationNotes}
              onChange={(e) => updateAccreditations({ bildObservationNotes: e.target.value })}
              placeholder="Detail how BILD observations/assessments are conducted at this service..."
              rows={5}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* BILD Pre-Mock Assessment */}
          <button
            onClick={() => setShowBild(true)}
            className="w-full px-6 py-4 border-2 border-dashed border-purple-300 text-purple-700 font-medium rounded-xl
                     hover:border-purple-400 hover:bg-purple-50 transition-colors text-base"
          >
            Open BILD PBS Pre-Mock Assessment Checklist
          </button>

          {/* Save & Continue */}
          <button
            onClick={() => {
              saveAccreditations();
              setCurrentStep('audit');
            }}
            disabled={!isAccreditationsValid()}
            className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors text-base"
          >
            {isAccreditationsSaved ? 'Saved – Continue to Audit' : 'Save & Continue to Audit Sections'}
          </button>

          <button
            onClick={() => setCurrentStep('care-systems')}
            className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 text-sm"
          >
            ← Back to Care Systems
          </button>
        </div>
      </div>

      {showBild && <BildAssessment onClose={() => setShowBild(false)} />}
    </div>
  );
}
