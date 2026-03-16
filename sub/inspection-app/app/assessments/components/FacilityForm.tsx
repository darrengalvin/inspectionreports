'use client';

import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { SupportLevel, SUPPORT_LEVEL_LABELS } from '../types/assessment';

const SUPPORT_LEVELS: SupportLevel[] = ['low', 'medium', 'high'];

const SPECIALISM_OPTIONS = [
  'Learning Disabilities',
  'Autism Spectrum',
  'Mental Health',
  'Physical Disabilities',
  'Acquired Brain Injury',
  'Dementia',
  'Sensory Impairment',
  'Challenging Behaviour',
  'Complex Health Needs',
  'Substance Misuse',
  'Forensic / Offending History',
  'Young Adults (18-25)',
];

export default function FacilityForm() {
  const { facility, updateFacility, setCurrentStep } = useAssessment();

  const isValid = !!(facility.name.trim() && facility.maxSupportLevel && facility.totalBeds > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8 pt-16">
        <button onClick={() => setCurrentStep('individual')} className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm">← Back to Individual</button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Service Facility</h1>
          <p className="text-neutral-600">Enter the service facility details for matching.</p>
        </div>

        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Facility Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Service Name</label>
                <input type="text" value={facility.name} onChange={e => updateFacility({ name: e.target.value })}
                  placeholder="Service name" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                <input type="text" value={facility.location} onChange={e => updateFacility({ location: e.target.value })}
                  placeholder="Town/City" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Total Beds</label>
                <input type="number" min={0} value={facility.totalBeds || ''} onChange={e => updateFacility({ totalBeds: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Current Occupancy</label>
                <input type="number" min={0} value={facility.currentOccupancy || ''} onChange={e => updateFacility({ currentOccupancy: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Maximum Support Level</label>
              <div className="grid grid-cols-3 gap-2">
                {SUPPORT_LEVELS.map(level => (
                  <button key={level} onClick={() => updateFacility({ maxSupportLevel: level })}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      facility.maxSupportLevel === level
                        ? level === 'low' ? 'bg-green-600 text-white' : level === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                    }`}>
                    {SUPPORT_LEVEL_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Environment</label>
              <div className="grid grid-cols-3 gap-2">
                {(['urban', 'suburban', 'rural'] as const).map(env => (
                  <button key={env} onClick={() => updateFacility({ environmentType: env })}
                    className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                      facility.environmentType === env ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                    }`}>
                    {env}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Specialisms</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIALISM_OPTIONS.map(spec => {
                  const isSelected = facility.specialisms.includes(spec);
                  return (
                    <button key={spec} onClick={() => {
                      const newSpecs = isSelected
                        ? facility.specialisms.filter(s => s !== spec)
                        : [...facility.specialisms, spec];
                      updateFacility({ specialisms: newSpecs });
                    }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        isSelected ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                      }`}
                      aria-pressed={isSelected}>
                      <span className="mr-1.5">{isSelected ? '✓' : '○'}</span>
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Staffing Ratio</label>
              <input type="text" value={facility.staffingRatio} onChange={e => updateFacility({ staffingRatio: e.target.value })}
                placeholder="e.g. 1:3, 1:1" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Accessibility Notes</label>
              <textarea value={facility.accessibility} onChange={e => updateFacility({ accessibility: e.target.value })}
                placeholder="Ground floor access, wheelchair adapted, etc." rows={2}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Facility Features</h2>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'hasWakingNight' as const, label: 'Waking Night Staff' },
                { key: 'hasSensoryRoom' as const, label: 'Sensory Room' },
                { key: 'hasCommunityAccess' as const, label: 'Community Access' },
                { key: 'nearPublicTransport' as const, label: 'Near Public Transport' },
              ]).map(({ key, label }) => (
                <button key={key} onClick={() => updateFacility({ [key]: !facility[key] })}
                  className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                    facility[key] ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                  }`}>
                  <span className="mr-2">{facility[key] ? '✓' : '○'}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setCurrentStep('staff')} disabled={!isValid}
            className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-base">
            Continue to Staff Profile
          </button>
        </div>
      </div>
    </div>
  );
}
