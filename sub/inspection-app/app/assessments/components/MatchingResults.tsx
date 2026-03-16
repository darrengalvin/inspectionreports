'use client';

import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { SUPPORT_LEVEL_LABELS, SUPPORT_LEVEL_DESCRIPTIONS } from '../types/assessment';

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-neutral-700">{label}</span>
        <span className="font-medium text-neutral-900">{score}%</span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-3">
        <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function MatchingResults() {
  const { individual, facility, matchingResult, setCurrentStep, generateTransition } = useAssessment();
  const [moveDate, setMoveDate] = useState('');

  if (!matchingResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">No matching results yet.</p>
          <button onClick={() => setCurrentStep('residents')} className="px-6 py-3 bg-neutral-900 text-white rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  const { overallPercentage, supportLevelMatch, facilityMatch, staffSkillMatch, residentCompatibility, environmentMatch, calculatedSupportLevel, notes, risks } = matchingResult;

  const getOverallColor = () => {
    if (overallPercentage >= 80) return { text: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500', border: 'border-green-200', label: 'Strong Match' };
    if (overallPercentage >= 60) return { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', border: 'border-amber-200', label: 'Moderate Match' };
    return { text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', border: 'border-red-200', label: 'Weak Match – Review Required' };
  };

  const colors = getOverallColor();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8 pt-16">
        <button onClick={() => setCurrentStep('residents')} className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm">← Back</button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">Matching Results</h1>
          <p className="text-neutral-600">
            <strong>{individual.name}</strong> → <strong>{facility.name}</strong>
          </p>
        </div>

        {/* Overall Score */}
        <div className={`rounded-2xl p-8 mb-8 ${colors.bg} border-2 ${colors.border}`}>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-28 h-28" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke={overallPercentage >= 80 ? '#22c55e' : overallPercentage >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(overallPercentage / 100) * 339.3} 339.3`} transform="rotate(-90 60 60)" />
                </svg>
                <span className={`absolute text-2xl font-bold ${colors.text}`}>{overallPercentage}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className={`text-xl font-bold ${colors.text} mb-1`}>{colors.label}</p>
              <p className="text-neutral-600 text-sm">Based on support needs, facility capabilities, staff skills, resident compatibility, and environment.</p>
            </div>
          </div>
        </div>

        {/* Calculated Support Level */}
        <div className="border border-neutral-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Calculated Support Level</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
            calculatedSupportLevel === 'low' ? 'bg-green-100 text-green-700'
            : calculatedSupportLevel === 'medium' ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700'
          }`}>
            {SUPPORT_LEVEL_LABELS[calculatedSupportLevel]}
          </div>
          <p className="text-sm text-neutral-600">{SUPPORT_LEVEL_DESCRIPTIONS[calculatedSupportLevel]}</p>
        </div>

        {/* Score Breakdown */}
        <div className="border border-neutral-200 rounded-xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Score Breakdown</h2>
          <ScoreBar label="Support Level Match" score={supportLevelMatch} color={supportLevelMatch >= 70 ? 'bg-green-500' : 'bg-red-500'} />
          <ScoreBar label="Facility Match" score={facilityMatch} color={facilityMatch >= 70 ? 'bg-green-500' : facilityMatch >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
          <ScoreBar label="Staff Skill Match" score={staffSkillMatch} color={staffSkillMatch >= 70 ? 'bg-green-500' : staffSkillMatch >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
          <ScoreBar label="Resident Compatibility" score={residentCompatibility} color={residentCompatibility >= 70 ? 'bg-green-500' : residentCompatibility >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
          <ScoreBar label="Environment Match" score={environmentMatch} color={environmentMatch >= 70 ? 'bg-green-500' : environmentMatch >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
        </div>

        {/* Notes and Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {notes.length > 0 && (
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-3">Positive Indicators</h3>
              <ul className="space-y-2">
                {notes.map((note, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">✓</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {risks.length > 0 && (
            <div className="bg-red-50 rounded-xl p-5">
              <h3 className="font-semibold text-red-800 mb-3">Risks to Consider</h3>
              <ul className="space-y-2">
                {risks.map((risk, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Generate Transition Plan */}
        {overallPercentage >= 50 && (
          <div className="border border-neutral-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Generate Transition Plan</h2>
            <p className="text-sm text-neutral-500 mb-4">Set a planned move date to generate a structured transition plan.</p>
            <div className="flex gap-3">
              <input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)}
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent" />
              <button onClick={() => moveDate && generateTransition(moveDate)} disabled={!moveDate}
                className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors">
                Generate Plan
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => window.print()}
            className="flex-1 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors">
            Print Results
          </button>
          <button onClick={() => setCurrentStep('individual')}
            className="flex-1 px-6 py-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
            New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
