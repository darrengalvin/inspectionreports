'use client';

import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

const PHASE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  'pre-move': { label: 'Pre-Move', color: 'text-blue-700', bg: 'bg-blue-50' },
  'move-day': { label: 'Move Day', color: 'text-purple-700', bg: 'bg-purple-50' },
  'settling-in': { label: 'Settling In', color: 'text-amber-700', bg: 'bg-amber-50' },
  'review': { label: 'Review', color: 'text-green-700', bg: 'bg-green-50' },
};

export default function TransitionPlanView() {
  const { transitionPlan, toggleTransitionItem, setCurrentStep } = useAssessment();

  if (!transitionPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">No transition plan generated yet.</p>
          <button onClick={() => setCurrentStep('results')} className="px-6 py-3 bg-neutral-900 text-white rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  const phases = ['pre-move', 'move-day', 'settling-in', 'review'] as const;
  const completedCount = transitionPlan.items.filter(i => i.completed).length;
  const progressPct = Math.round((completedCount / transitionPlan.items.length) * 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8 pt-16">
        <button onClick={() => setCurrentStep('results')} className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm">← Back to Results</button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">Transition Plan</h1>
          <p className="text-neutral-600">
            <strong>{transitionPlan.individualName}</strong> → <strong>{transitionPlan.serviceName}</strong>
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Planned move: {new Date(transitionPlan.plannedMoveDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-neutral-50 rounded-xl p-5 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-600">Progress</span>
            <span className="font-medium text-neutral-900">{completedCount}/{transitionPlan.items.length} tasks</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div className="h-3 rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">{progressPct}% complete</p>
        </div>

        {/* Phases */}
        <div className="space-y-8">
          {phases.map(phase => {
            const phaseItems = transitionPlan.items.filter(i => i.phase === phase);
            const phaseInfo = PHASE_LABELS[phase];
            if (phaseItems.length === 0) return null;

            return (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${phaseInfo.bg} ${phaseInfo.color}`}>
                    {phaseInfo.label}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {phaseItems.filter(i => i.completed).length}/{phaseItems.length} done
                  </span>
                </div>

                <div className="space-y-2">
                  {phaseItems.map(item => (
                    <div key={item.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                      onClick={() => toggleTransitionItem(item.id)}
                    >
                      <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        item.completed ? 'bg-green-500 border-green-500' : 'border-neutral-300'
                      }`}>
                        {item.completed && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${item.completed ? 'text-green-800 line-through' : 'text-neutral-900'}`}>
                          {item.task}
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-neutral-500">
                          <span>Responsible: {item.responsible}</span>
                          <span>Target: {new Date(item.targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-10 flex gap-4">
          <button onClick={() => window.print()}
            className="flex-1 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors">
            Print Transition Plan
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
