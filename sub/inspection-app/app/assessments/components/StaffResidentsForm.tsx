'use client';

import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { SupportLevel, SUPPORT_LEVEL_LABELS } from '../types/assessment';

const SUPPORT_LEVELS: SupportLevel[] = ['low', 'medium', 'high'];

export default function StaffResidentsForm() {
  const {
    staffProfile, updateStaffProfile,
    residents, addResident, updateResident, removeResident,
    runMatching, setCurrentStep, currentStep,
  } = useAssessment();

  const isStaffStep = currentStep === 'staff';

  if (isStaffStep) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto p-8 pt-16">
          <button onClick={() => setCurrentStep('facility')} className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm">← Back to Facility</button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Staff Profile</h1>
            <p className="text-neutral-600">Enter the service&apos;s staff skills and training information.</p>
            <button
              onClick={() => updateStaffProfile({
                totalStaff: 12,
                averageExperienceYears: 4,
                trainingCompliance: 94,
                trainedInPbs: true,
                trainedInMedication: true,
                trainedInEpilepsy: true,
                trainedInAutism: true,
                trainedInMentalHealth: true,
                trainedInManualHandling: true,
              })}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Auto-fill for Demo
            </button>
          </div>

          <div className="space-y-6">
            <div className="border border-neutral-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Total Staff</label>
                  <input type="number" min={0} value={staffProfile.totalStaff || ''} onChange={e => updateStaffProfile({ totalStaff: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Avg. Experience (years)</label>
                  <input type="number" min={0} step={0.5} value={staffProfile.averageExperienceYears || ''} onChange={e => updateStaffProfile({ averageExperienceYears: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Training Compliance %</label>
                <input type="number" min={0} max={100} value={staffProfile.trainingCompliance || ''} onChange={e => updateStaffProfile({ trainingCompliance: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
              </div>

              <h3 className="text-sm font-medium text-neutral-700 mt-4">Key Training Areas</h3>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'trainedInPbs' as const, label: 'PBS Trained' },
                  { key: 'trainedInMedication' as const, label: 'Medication Admin' },
                  { key: 'trainedInEpilepsy' as const, label: 'Epilepsy Awareness' },
                  { key: 'trainedInAutism' as const, label: 'Autism Awareness' },
                  { key: 'trainedInMentalHealth' as const, label: 'Mental Health' },
                  { key: 'trainedInManualHandling' as const, label: 'Manual Handling' },
                ]).map(({ key, label }) => (
                  <button key={key} onClick={() => updateStaffProfile({ [key]: !staffProfile[key] })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                      staffProfile[key] ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                    }`}>
                    <span className="mr-2">{staffProfile[key] ? '✓' : '○'}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setCurrentStep('residents')}
              className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors text-base">
              Continue to Current Residents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Residents step
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8 pt-16">
        <button onClick={() => setCurrentStep('staff')} className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm">← Back to Staff Profile</button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 mb-4">
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Current Residents</h1>
          <p className="text-neutral-600">Add current residents to assess compatibility.</p>
          <button
            onClick={() => {
              const demoResidents = [
                { name: 'Emma W.', supportLevel: 'medium' as const, personalityNotes: 'Sociable, enjoys group activities', triggers: 'Changes to routine' },
                { name: 'Ryan K.', supportLevel: 'high' as const, personalityNotes: 'Quiet, prefers 1:1 interaction', triggers: 'Loud noises, large groups' },
                { name: 'Sophie L.', supportLevel: 'low' as const, personalityNotes: 'Independent, outgoing', triggers: 'None significant' },
                { name: 'James P.', supportLevel: 'medium' as const, personalityNotes: 'Enjoys music, needs structured day', triggers: 'Boredom, unstructured time' },
              ];
              demoResidents.forEach((r, i) => {
                if (i < residents.length) {
                  updateResident(i, r);
                } else {
                  addResident();
                  setTimeout(() => updateResident(i, r), 50 * (i + 1));
                }
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
          {residents.map((resident, index) => (
            <div key={index} className="border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Resident {index + 1}</h3>
                <button onClick={() => removeResident(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
              <div className="space-y-3">
                <input type="text" value={resident.name} onChange={e => updateResident(index, { name: e.target.value })}
                  placeholder="Name" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Support Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUPPORT_LEVELS.map(level => (
                      <button key={level} onClick={() => updateResident(index, { supportLevel: level })}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          resident.supportLevel === level
                            ? level === 'low' ? 'bg-green-600 text-white' : level === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-200'
                        }`}>{SUPPORT_LEVEL_LABELS[level]}</button>
                    ))}
                  </div>
                </div>
                <input type="text" value={resident.keyNeeds} onChange={e => updateResident(index, { keyNeeds: e.target.value })}
                  placeholder="Key needs/characteristics" className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400" />
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Compatibility Assessment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([{ value: 'compatible', label: 'Compatible', color: 'bg-green-600' }, { value: 'neutral', label: 'Neutral', color: 'bg-neutral-600' }, { value: 'risk', label: 'Risk', color: 'bg-red-600' }] as const).map(opt => (
                      <button key={opt.value} onClick={() => updateResident(index, { personalityMatch: opt.value })}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          resident.personalityMatch === opt.value ? `${opt.color} text-white` : 'bg-white text-neutral-700 border border-neutral-200'
                        }`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addResident}
            className="w-full px-6 py-3 border-2 border-dashed border-neutral-300 text-neutral-600 font-medium rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-colors">
            + Add Current Resident
          </button>

          <button onClick={runMatching}
            className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors text-base">
            Run Matching Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
