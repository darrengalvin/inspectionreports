'use client';

import React from 'react';
import { useAudit } from '../context/AuditContext';
import { COUNTRY_LABELS, SERVICE_TYPE_LABELS } from '../types/audit';

export default function AuditReport() {
  const {
    setup,
    visitDetails,
    sections,
    sectionData,
    getTotalScore,
    getTotalMaxScore,
    setCurrentStep,
    setCurrentSectionIndex
  } = useAudit();

  const totalScore = getTotalScore();
  const maxScore = getTotalMaxScore();
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getScoreColor = (score: number, max: number) => {
    const pct = max > 0 ? (score / max) * 100 : 0;
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number, max: number) => {
    const pct = max > 0 ? (score / max) * 100 : 0;
    if (pct >= 80) return 'bg-green-50';
    if (pct >= 60) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const getVerdict = () => {
    if (percentage >= 80) return { label: 'Meeting Standards', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 60) return { label: 'Improvement Needed', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Inadequate', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const verdict = getVerdict();

  const handleEditSection = (index: number) => {
    setCurrentSectionIndex(index);
    setCurrentStep('audit');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back button */}
        <button
          onClick={() => setCurrentStep('audit')}
          className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm flex items-center gap-2 no-print"
        >
          ← Back to Audit
        </button>

        {/* Header */}
        <header className="border-b border-neutral-200 pb-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">{setup.serviceName}</h1>
              <p className="text-neutral-600 mt-1">QM7 Quality Management Audit Report</p>
              {setup.serviceType && (
                <p className="text-sm text-neutral-500 mt-2">
                  {SERVICE_TYPE_LABELS[setup.serviceType]}
                </p>
              )}
            </div>
            <div className="text-left sm:text-right text-sm text-neutral-600">
              <p><strong>Audit Reference:</strong> {setup.auditNumber}</p>
              {setup.country && (
                <p><strong>Country:</strong> {COUNTRY_LABELS[setup.country]}</p>
              )}
              {visitDetails.dateOfVisit && (
                <p><strong>Visit Date:</strong> {new Date(visitDetails.dateOfVisit).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              )}
              <p><strong>Key Contact:</strong> {setup.keyContact1.name}</p>
            </div>
          </div>
        </header>

        {/* Overall Score */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className={`text-center p-6 rounded-xl ${verdict.bg}`}>
            <p className={`text-5xl font-bold ${verdict.color}`}>
              {percentage}%
            </p>
            <p className="text-sm text-neutral-500 uppercase tracking-wide mt-2">Overall Score</p>
            <p className={`text-sm font-medium mt-1 ${verdict.color}`}>
              {verdict.label}
            </p>
          </div>
          
          <div className="sm:col-span-2 p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-medium text-neutral-900 mb-3">Score Breakdown</h3>
            <div className="flex items-center justify-between text-2xl font-bold text-neutral-900 mb-3">
              <span>{totalScore}</span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-400">{maxScore}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  percentage >= 80 ? 'bg-green-500' :
                  percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>0</span>
              <span>{Math.round(maxScore / 2)}</span>
              <span>{maxScore}</span>
            </div>
          </div>
        </div>

        {/* Visit Summary (if applicable) */}
        {visitDetails.dateOfVisit && (
          <div className="border border-neutral-200 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Visit Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Date</p>
                <p className="font-medium text-neutral-900">{visitDetails.dateOfVisit}</p>
              </div>
              <div>
                <p className="text-neutral-500">Time</p>
                <p className="font-medium text-neutral-900">{visitDetails.timeOfVisit}</p>
              </div>
              <div>
                <p className="text-neutral-500">Clients Present</p>
                <p className="font-medium text-neutral-900">{visitDetails.clientsInService}</p>
              </div>
              <div>
                <p className="text-neutral-500">Staff on Shift</p>
                <p className="font-medium text-neutral-900">{visitDetails.staffOnShift}</p>
              </div>
              <div>
                <p className="text-neutral-500">Greeted By</p>
                <p className="font-medium text-neutral-900">{visitDetails.greeterName}</p>
              </div>
              <div>
                <p className="text-neutral-500">ID Checked</p>
                <p className={`font-medium ${visitDetails.idChecked ? 'text-green-600' : 'text-red-600'}`}>
                  {visitDetails.idChecked ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-neutral-500">Client Focus</p>
                <p className="font-medium text-neutral-900">{visitDetails.clientFocus1}</p>
              </div>
              {visitDetails.clientFocus2 && (
                <div>
                  <p className="text-neutral-500">Client Focus 2</p>
                  <p className="font-medium text-neutral-900">{visitDetails.clientFocus2}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Scores */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900">Section Scores</h2>
          
          {sections.map((section, index) => {
            const data = sectionData.get(section.id);
            const score = data?.score || 0;
            const narrative = data?.narrative || '';
            const pct = section.maxScore > 0 ? (score / section.maxScore) * 100 : 0;

            return (
              <div key={section.id} className="border border-neutral-200 rounded-xl overflow-hidden">
                {/* Section Header */}
                <div className={`p-6 ${getScoreBg(score, section.maxScore)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                        Section {index + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {section.countryPrefix} {section.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(score, section.maxScore)}`}>
                          {score}/{section.maxScore}
                        </p>
                        <p className="text-xs text-neutral-500">{Math.round(pct)}%</p>
                      </div>
                      <button
                        onClick={() => handleEditSection(index)}
                        className="no-print px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-white transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          pct >= 80 ? 'bg-green-500' :
                          pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Questions Summary */}
                <div className="p-6 bg-white">
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Questions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {section.questions.map(question => {
                      const answer = data?.answers.find(a => a.questionId === question.id);
                      return (
                        <div
                          key={question.id}
                          className={`px-3 py-2 rounded text-xs font-medium text-center ${
                            answer?.answer === true
                              ? 'bg-green-100 text-green-700'
                              : answer?.answer === false
                                ? 'bg-red-100 text-red-700'
                                : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          Q{question.number}: {answer?.answer === true ? 'Yes' : answer?.answer === false ? 'No' : '—'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Narrative */}
                {narrative && (
                  <div className="p-6 bg-neutral-50 border-t border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Narrative</h4>
                    <p className="text-neutral-600 whitespace-pre-wrap">{narrative}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 transition-colors text-base"
          >
            Print / Export as PDF
          </button>
          <button
            onClick={() => setCurrentStep('setup')}
            className="flex-1 px-6 py-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg
                     hover:bg-neutral-50 transition-colors text-base"
          >
            Start New Audit
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-500">
          <p>QM7 Quality Management Audit Report</p>
          <p className="mt-1">Generated: {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </footer>
      </div>
    </div>
  );
}
