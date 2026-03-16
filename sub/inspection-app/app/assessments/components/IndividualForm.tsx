'use client';

import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { SupportLevel, SUPPORT_LEVEL_LABELS } from '../types/assessment';

const SUPPORT_LEVELS: SupportLevel[] = ['low', 'medium', 'high'];

function LevelSelector({ label, value, onChange }: { label: string; value: SupportLevel | null; onChange: (v: SupportLevel) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {SUPPORT_LEVELS.map(level => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
              value === level
                ? level === 'low' ? 'bg-green-600 text-white'
                  : level === 'medium' ? 'bg-amber-500 text-white'
                  : 'bg-red-600 text-white'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
            }`}
          >
            {SUPPORT_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function IndividualForm() {
  const { individual, updateIndividual, setCurrentStep } = useAssessment();

  const isValid = !!(individual.name.trim() && individual.personalCareLevel && individual.behaviourSupportLevel);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8 pt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Individual Assessment</h1>
          <p className="text-neutral-600">Enter the individual&apos;s information and support needs.</p>
        </div>

        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                  <input type="text" value={individual.name} onChange={e => updateIndividual({ name: e.target.value })}
                    placeholder="Full name" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date of Birth</label>
                  <input type="date" value={individual.dateOfBirth} onChange={e => updateIndividual({ dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Referral Source</label>
                  <input type="text" value={individual.referralSource} onChange={e => updateIndividual({ referralSource: e.target.value })}
                    placeholder="e.g. Social Worker, NHS" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Current Placement</label>
                  <input type="text" value={individual.currentPlacement} onChange={e => updateIndividual({ currentPlacement: e.target.value })}
                    placeholder="Current living arrangement" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Diagnosis</label>
                  <input type="text" value={individual.primaryDiagnosis} onChange={e => updateIndividual({ primaryDiagnosis: e.target.value })}
                    placeholder="Primary diagnosis" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Secondary Diagnosis</label>
                  <input type="text" value={individual.secondaryDiagnosis} onChange={e => updateIndividual({ secondaryDiagnosis: e.target.value })}
                    placeholder="Secondary diagnosis (if any)" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Communication Needs</label>
                <textarea value={individual.communicationNeeds} onChange={e => updateIndividual({ communicationNeeds: e.target.value })}
                  placeholder="Detail communication needs (e.g. Makaton, PECS, verbal, non-verbal)" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Mobility Needs</label>
                <textarea value={individual.mobilityNeeds} onChange={e => updateIndividual({ mobilityNeeds: e.target.value })}
                  placeholder="Detail mobility needs and equipment" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Support Levels</h2>
            <p className="text-sm text-neutral-500 mb-6">Rate each area to calculate the overall support level needed.</p>
            <div className="space-y-5">
              <LevelSelector label="Personal Care" value={individual.personalCareLevel} onChange={v => updateIndividual({ personalCareLevel: v })} />
              <LevelSelector label="Medication Complexity" value={individual.medicationComplexity} onChange={v => updateIndividual({ medicationComplexity: v })} />
              <LevelSelector label="Behaviour Support" value={individual.behaviourSupportLevel} onChange={v => updateIndividual({ behaviourSupportLevel: v })} />
              <LevelSelector label="Mental Health Needs" value={individual.mentalHealthNeeds} onChange={v => updateIndividual({ mentalHealthNeeds: v })} />
              <LevelSelector label="Community Access" value={individual.communityAccessLevel} onChange={v => updateIndividual({ communityAccessLevel: v })} />
              <LevelSelector label="Social Interaction" value={individual.socialInteractionLevel} onChange={v => updateIndividual({ socialInteractionLevel: v })} />
              <LevelSelector label="Night Support" value={individual.nightSupportLevel} onChange={v => updateIndividual({ nightSupportLevel: v })} />
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Personality & Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Personality Traits</label>
                <textarea value={individual.personalityTraits} onChange={e => updateIndividual({ personalityTraits: e.target.value })}
                  placeholder="Describe personality traits, social style" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Interests & Activities</label>
                <textarea value={individual.interests} onChange={e => updateIndividual({ interests: e.target.value })}
                  placeholder="Hobbies, interests, preferred activities" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Known Triggers</label>
                <textarea value={individual.triggers} onChange={e => updateIndividual({ triggers: e.target.value })}
                  placeholder="Known triggers for distress or behaviours of concern" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferences</label>
                <textarea value={individual.preferences} onChange={e => updateIndividual({ preferences: e.target.value })}
                  placeholder="Environmental preferences, routines, food, room setup" rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 resize-none" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep('facility')}
            disabled={!isValid}
            className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-base"
          >
            Continue to Service Facility
          </button>
        </div>
      </div>
    </div>
  );
}
