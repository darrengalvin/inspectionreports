'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useAudit } from '../context/AuditContext';
import {
  COUNTRY_LABELS,
  SERVICE_TYPE_LABELS,
  CARE_SYSTEM_LABELS,
  ACCREDITATION_LABELS,
  ACCREDITATION_STATUS_LABELS,
  PASS_THRESHOLD,
  SECTION_ICONS,
  AccreditationStatus,
} from '../types/audit';

export default function AuditReport() {
  const {
    setup,
    visitDetails,
    observationAudit,
    accreditations,
    sections,
    sectionData,
    getTotalScore,
    getTotalMaxScore,
    getPercentage,
    isPassing,
    actionPlan,
    setActionPlan,
    endorsement,
    generateEndorsement,
    setCurrentStep,
    setCurrentSectionIndex,
  } = useAudit();

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const totalScore = getTotalScore();
  const maxScore = getTotalMaxScore();
  const percentage = getPercentage();
  const passed = isPassing();

  const currentEndorsement = endorsement ?? (passed ? generateEndorsement() : null);

  useEffect(() => {
    if (currentEndorsement?.referenceNumber) {
      const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/verify/${currentEndorsement.referenceNumber}`;
      QRCode.toDataURL(verifyUrl, {
        width: 128,
        margin: 1,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      }).then(setQrCodeDataUrl).catch(() => {});
    }
  }, [currentEndorsement?.referenceNumber]);

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
    if (percentage >= 80) return { label: 'Meeting Standards', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (percentage >= PASS_THRESHOLD) return { label: 'Pass – Improvement Noted', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'Below Pass Threshold', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const verdict = getVerdict();

  const handleEditSection = (index: number) => {
    setCurrentSectionIndex(index);
    setCurrentStep('audit');
  };

  const handleGenerateActionPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const sectionSummaries = sections.map(s => {
        const data = sectionData.get(s.id);
        return {
          title: s.title,
          score: data?.score ?? 0,
          maxScore: s.maxScore,
          narrative: data?.narrative ?? '',
        };
      });

      const response = await fetch('/api/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: setup.serviceName,
          percentage,
          sections: sectionSummaries,
          observationOverview: observationAudit.observationOverview,
          recommendations: observationAudit.recommendationsText,
        }),
      });

      if (response.ok) {
        const plan = await response.json();
        setActionPlan(plan);
      }
    } catch {
      // Fallback: generate a basic action plan client-side
      const weakSections = sections
        .map(s => ({ section: s, data: sectionData.get(s.id) }))
        .filter(({ section, data }) => {
          const pct = section.maxScore > 0 ? ((data?.score ?? 0) / section.maxScore) * 100 : 0;
          return pct < PASS_THRESHOLD;
        });

      const items = weakSections.map(({ section, data }, i) => ({
        id: `ap-${i + 1}`,
        area: section.title,
        finding: `Score ${data?.score ?? 0}/${section.maxScore} (${Math.round(((data?.score ?? 0) / section.maxScore) * 100)}%) - below the ${PASS_THRESHOLD}% pass threshold.`,
        action: `Review and address gaps identified in ${section.title.toLowerCase()}. Implement corrective measures and document improvements.`,
        responsible: setup.keyContact1.name || 'Service Manager',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: ((data?.score ?? 0) / section.maxScore) * 100 < 50 ? 'high' as const : 'medium' as const,
      }));

      setActionPlan({
        items,
        generatedAt: new Date().toISOString(),
        followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        overallRecommendation: `The service scored ${percentage}% which is below the ${PASS_THRESHOLD}% pass threshold. A follow-up audit is recommended within 90 days to verify that the action plan has been implemented.`,
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const accreditationKeys = ['cpi', 'bildPbs', 'stomp', 'omg', 'rrn'] as const;

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
              <div className="flex items-center gap-3 mb-2">
                <Image src="/qm7-logo-icon.jpg" alt="QM7" width={48} height={48} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h1 className="text-3xl font-semibold text-neutral-900">
                    {setup.serviceName}
                    {setup.providerName && <span className="text-neutral-400"> — {setup.providerName}</span>}
                  </h1>
                  <p className="text-neutral-600">Quality Management Audit Report</p>
                </div>
              </div>
              {setup.serviceType && (
                <p className="text-sm text-neutral-500 mt-2">
                  {SERVICE_TYPE_LABELS[setup.serviceType]}
                </p>
              )}
            </div>
            <div className="text-left sm:text-right text-sm text-neutral-600 space-y-1">
              <p><strong>Audit Reference:</strong> {setup.auditNumber}</p>
              {setup.country && <p><strong>Country:</strong> {COUNTRY_LABELS[setup.country]}</p>}
              {visitDetails.dateOfVisit && (
                <p><strong>Visit Date:</strong> {new Date(visitDetails.dateOfVisit).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}</p>
              )}
              {setup.auditorName && <p><strong>Lead Auditor:</strong> {setup.auditorName}</p>}
              <p><strong>Key Contact:</strong> {setup.keyContact1.name}</p>
              {currentEndorsement && (
                <p className="font-mono text-xs mt-2 bg-neutral-100 px-2 py-1 rounded">
                  Endorsement Ref: {currentEndorsement.referenceNumber}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Pass / Fail Banner */}
        <div className={`rounded-2xl p-8 mb-10 ${verdict.bg} ${verdict.border} border-2`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke={passed ? '#22c55e' : percentage >= PASS_THRESHOLD ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 339.3} 339.3`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className={`absolute text-3xl font-bold ${verdict.color}`}>{percentage}%</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className={`text-2xl font-bold ${verdict.color} mb-1`}>{verdict.label}</p>
              <p className="text-neutral-600">
                {passed
                  ? `This service has achieved a score of ${percentage}% which meets or exceeds the ${PASS_THRESHOLD}% pass threshold.`
                  : `This service scored ${percentage}% which is below the ${PASS_THRESHOLD}% pass threshold. An action plan is required.`}
              </p>
              <div className="mt-3 text-sm text-neutral-500">
                <span className="font-medium">{totalScore}</span> out of <span className="font-medium">{maxScore}</span> points
              </div>
            </div>
            {passed && (
              <div className="shrink-0 no-print">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-5 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Care Support Systems Summary */}
        {observationAudit.careSupportSystem && (
          <div className="border border-neutral-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">Care Support System & Observation</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <p className="text-neutral-500">System in Use</p>
                <p className="font-medium text-neutral-900">{CARE_SYSTEM_LABELS[observationAudit.careSupportSystem]}</p>
              </div>
              <div>
                <p className="text-neutral-500">Recent Care Notes</p>
                <p className={`font-medium ${observationAudit.recentCareNotes ? 'text-green-600' : 'text-red-600'}`}>
                  {observationAudit.recentCareNotes ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-neutral-500">Overdue Dates</p>
                <p className={`font-medium ${observationAudit.redOverdueDates ? 'text-red-600' : 'text-green-600'}`}>
                  {observationAudit.redOverdueDates ? 'Yes (Overdue)' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-neutral-500">Staff System Skill</p>
                <p className="font-medium text-neutral-900 capitalize">{observationAudit.staffSystemSkill || '—'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Login Notifications</p>
                <p className="font-medium text-neutral-900">{observationAudit.notificationCount || '—'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Effective System</p>
                <p className={`font-medium ${observationAudit.effectiveSystem ? 'text-green-600' : 'text-red-600'}`}>
                  {observationAudit.effectiveSystem ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            {observationAudit.observationOverview && (
              <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                <p className="text-sm font-medium text-neutral-700 mb-1">Observation Overview</p>
                <p className="text-neutral-600 text-sm whitespace-pre-wrap">{observationAudit.observationOverview}</p>
              </div>
            )}
            {observationAudit.hasRecommendations && observationAudit.recommendationsText && (
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm font-medium text-amber-700 mb-1">Recommendations & Concerns</p>
                <p className="text-amber-900 text-sm whitespace-pre-wrap">{observationAudit.recommendationsText}</p>
              </div>
            )}
          </div>
        )}

        {/* Accreditations Summary */}
        <div className="border border-neutral-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Accreditations</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {accreditationKeys.map(key => {
              const status = accreditations[key] as AccreditationStatus;
              return (
                <div key={key} className={`text-center p-3 rounded-lg ${
                  status === 'yes' ? 'bg-green-50' :
                  status === 'in-progress' ? 'bg-blue-50' :
                  status === 'expired' ? 'bg-amber-50' :
                  status === 'no' ? 'bg-red-50' : 'bg-neutral-50'
                }`}>
                  <p className="text-xs text-neutral-500 mb-1">{ACCREDITATION_LABELS[key]}</p>
                  <p className={`text-sm font-medium ${
                    status === 'yes' ? 'text-green-700' :
                    status === 'in-progress' ? 'text-blue-700' :
                    status === 'expired' ? 'text-amber-700' :
                    status === 'no' ? 'text-red-700' : 'text-neutral-500'
                  }`}>
                    {status ? ACCREDITATION_STATUS_LABELS[status] : '—'}
                  </p>
                </div>
              );
            })}
          </div>
          {accreditations.bildObservationNotes && (
            <div className="mt-4 bg-neutral-50 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-700 mb-1">BILD PBS Observation Notes</p>
              <p className="text-neutral-600 text-sm whitespace-pre-wrap">{accreditations.bildObservationNotes}</p>
            </div>
          )}
        </div>

        {/* Visit Summary */}
        {visitDetails.dateOfVisit && (
          <div className="border border-neutral-200 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Visit Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-neutral-500">Date</p><p className="font-medium text-neutral-900">{visitDetails.dateOfVisit}</p></div>
              <div><p className="text-neutral-500">Time</p><p className="font-medium text-neutral-900">{visitDetails.timeOfVisit}</p></div>
              <div><p className="text-neutral-500">Clients Present</p><p className="font-medium text-neutral-900">{visitDetails.clientsInService}</p></div>
              <div><p className="text-neutral-500">Staff on Shift</p><p className="font-medium text-neutral-900">{visitDetails.staffOnShift}</p></div>
              <div><p className="text-neutral-500">Greeted By</p><p className="font-medium text-neutral-900">{visitDetails.greeterName}</p></div>
              <div>
                <p className="text-neutral-500">ID Checked</p>
                <p className={`font-medium ${visitDetails.idChecked ? 'text-green-600' : 'text-red-600'}`}>
                  {visitDetails.idChecked ? 'Yes' : 'No'}
                </p>
              </div>
              <div><p className="text-neutral-500">Client Focus</p><p className="font-medium text-neutral-900">{visitDetails.clientFocus1}</p></div>
              {visitDetails.clientFocus2 && (
                <div><p className="text-neutral-500">Client Focus 2</p><p className="font-medium text-neutral-900">{visitDetails.clientFocus2}</p></div>
              )}
            </div>
          </div>
        )}

        {/* Section Scores */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900">Audit Section Scores</h2>

          {sections.map((section, index) => {
            const data = sectionData.get(section.id);
            const score = data?.score || 0;
            const narrative = data?.narrative || '';
            const pct = section.maxScore > 0 ? (score / section.maxScore) * 100 : 0;
            const icon = SECTION_ICONS[section.id] || section.icon || '📊';

            return (
              <div key={section.id} className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className={`p-6 ${getScoreBg(score, section.maxScore)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Section {index + 1}</p>
                        <h3 className="text-lg font-semibold text-neutral-900">{section.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(score, section.maxScore)}`}>{score}/{section.maxScore}</p>
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
                  <div className="mt-4">
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300" />
                      <span>{data?.answers.filter(a => a.answer === true).length ?? 0} compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300" />
                      <span>{data?.answers.filter(a => a.answer === false).length ?? 0} non-compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-neutral-100 border border-neutral-300" />
                      <span>{data?.answers.filter(a => a.answer === null).length ?? 0} not assessed</span>
                    </div>
                  </div>
                </div>

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

        {/* Action Plan (shown when below threshold or generated) */}
        {!passed && (
          <div className="mt-10 border-2 border-red-200 rounded-2xl p-8 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-900">Action Plan Required</h2>
                <p className="text-sm text-red-700">Score is below the {PASS_THRESHOLD}% pass threshold</p>
              </div>
            </div>

            {!actionPlan ? (
              <button
                onClick={handleGenerateActionPlan}
                disabled={isGeneratingPlan}
                className="w-full px-6 py-4 bg-red-600 text-white font-medium rounded-xl
                         hover:bg-red-700 disabled:bg-red-300 transition-colors no-print"
              >
                {isGeneratingPlan ? 'Generating Action Plan...' : 'Generate Action Plan'}
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-800">{actionPlan.overallRecommendation}</p>
                <p className="text-sm text-red-700">
                  Follow-up audit date: <strong>{new Date(actionPlan.followUpDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </p>

                <div className="space-y-3 mt-4">
                  {actionPlan.items.map((item, i) => (
                    <div key={item.id} className="bg-white rounded-xl p-5 border border-red-200">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-medium text-neutral-900">
                          {i + 1}. {item.area}
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700'
                          : item.priority === 'medium' ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2"><strong>Finding:</strong> {item.finding}</p>
                      <p className="text-sm text-neutral-600 mb-2"><strong>Action:</strong> {item.action}</p>
                      <div className="flex gap-4 text-xs text-neutral-500">
                        <span>Responsible: {item.responsible}</span>
                        <span>Deadline: {item.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 transition-colors text-base"
          >
            Print / Export as PDF
          </button>
          {passed && (
            <button
              onClick={() => setShowCertificate(true)}
              className="flex-1 px-6 py-4 bg-green-600 text-white font-medium rounded-lg
                       hover:bg-green-700 transition-colors text-base"
            >
              View Certificate
            </button>
          )}
          <button
            onClick={() => setCurrentStep('setup')}
            className="flex-1 px-6 py-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg
                     hover:bg-neutral-50 transition-colors text-base"
          >
            Start New Audit
          </button>
        </div>

        {/* Footer / Letterhead */}
        <footer className="mt-12 pt-6 border-t-2 border-neutral-900">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={760} height={246} className="h-10 w-auto" />
              <Image src="/qm7-logo-full.jpg" alt="QM7" width={160} height={70} className="h-12 w-auto rounded" />
            </div>
            <div className="text-left sm:text-right text-xs text-neutral-500 space-y-0.5">
              <p className="font-medium text-neutral-700">DPB Care Consultancy</p>
              <p>184, 200 Pensby Road, Heswall</p>
              <p>Birkenhead, Wirral CH60 7RJ</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-200">
            <p>QM7 Quality Management Audit Report &middot; {new Date().toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}</p>
            {currentEndorsement && (
              <p className="font-mono">Ref: {currentEndorsement.referenceNumber}</p>
            )}
          </div>
          <p className="text-[10px] text-neutral-300 mt-3">
            &copy; {new Date().getFullYear()} DPB Care Consultancy. All rights reserved. This report is confidential
            and intended solely for the named service. It should not be distributed without prior written consent.
          </p>
        </footer>
      </div>

      {/* Certificate Modal — DPB Care Consultancy Design */}
      {showCertificate && currentEndorsement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white max-w-3xl w-full relative shadow-2xl" style={{ aspectRatio: '1.414' }}>
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="h-full flex flex-col">
              {/* Top Banner */}
              <div className="flex border-b-2 border-neutral-900">
                <div className="flex-1 px-6 py-3 border-r border-neutral-300">
                  <p className="text-sm font-semibold text-neutral-900 tracking-wide">
                    Quality Care (for care companies) / Assured (for college)
                  </p>
                </div>
                <div className="px-6 py-3 text-right text-sm">
                  <p className="font-semibold text-neutral-900">Audited</p>
                  <p className="text-neutral-600">Date: {new Date(currentEndorsement.dateIssued).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                  <p className="text-neutral-600">Signed: Dave Burke</p>
                </div>
              </div>

              {/* DPB Logo & Branding */}
              <div className="px-8 pt-4 pb-2">
                <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={760} height={246} className="h-16 w-auto" />
              </div>

              {/* Main Body — Score Circles + QA Stamp */}
              <div className="flex-1 px-8 flex">
                {/* Left: Score Circles */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-6 max-w-xs">
                    {sections.slice(0, 4).map(section => {
                      const data = sectionData.get(section.id);
                      const score = data?.score ?? 0;
                      const pct = section.maxScore > 0 ? Math.round((score / section.maxScore) * 100) : 0;
                      const strokeColor = pct >= 80 ? '#1a1a1a' : pct >= 60 ? '#555' : '#999';
                      return (
                        <div key={section.id} className="text-center">
                          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke={strokeColor} strokeWidth="5"
                              strokeLinecap="round" strokeDasharray={`${(pct / 100) * 263.9} 263.9`}
                              transform="rotate(-90 50 50)" />
                            <text x="50" y="55" textAnchor="middle" className="text-lg font-bold" fill="#1a1a1a" fontSize="22">{pct}%</text>
                          </svg>
                          <p className="text-xs text-neutral-600 mt-1 leading-tight">{section.title.split('&')[0].trim()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: QA Stamp */}
                <div className="flex items-center justify-center px-4">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#1a1a1a" strokeWidth="4" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                      {/* Curved text — QUALITY ASSURANCE */}
                      <defs>
                        <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" />
                        <path id="bottomArc" d="M 170 100 A 70 70 0 0 1 30 100" />
                      </defs>
                      <text fontSize="14" fontWeight="bold" fill="#1a1a1a" letterSpacing="3">
                        <textPath href="#topArc" startOffset="50%" textAnchor="middle">QUALITY ASSURANCE</textPath>
                      </text>
                      <text fontSize="14" fontWeight="bold" fill="#1a1a1a" letterSpacing="3">
                        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">QUALITY ASSURANCE</textPath>
                      </text>
                      <text x="100" y="108" textAnchor="middle" fontSize="42" fontWeight="900" fill="#1a1a1a">QA</text>
                      {/* Stars */}
                      <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#1a1a1a">★</text>
                      <text x="140" y="75" textAnchor="middle" fontSize="10" fill="#1a1a1a">★</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Row — QR, ISO, IQA */}
              <div className="flex items-end border-t border-neutral-200 px-8 py-4">
                {/* QR Code placeholder + ISO */}
                <div className="flex items-center gap-4 flex-1">
                  {/* QR Code */}
                  <div className="w-16 h-16 rounded overflow-hidden">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR verification code" className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 animate-pulse" />
                    )}
                  </div>

                  {/* ISO 9001 */}
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <div className="border-2 border-neutral-900 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-[6px] font-bold leading-tight text-neutral-900 text-center">QUALITY<br/>ASSURED<br/>SERVICES</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">ISO</p>
                        <p className="text-lg font-black text-neutral-900 leading-none">9001</p>
                      </div>
                    </div>
                    <p className="text-[8px] text-neutral-500 mt-0.5">Cert No. {setup.auditNumber}</p>
                  </div>

                  {/* UKAS */}
                  <div className="border border-neutral-400 rounded px-2 py-1 text-center">
                    <p className="text-[7px] font-bold text-neutral-700">UKAS</p>
                    <p className="text-[6px] text-neutral-500">MANAGEMENT<br/>SYSTEMS</p>
                  </div>
                </div>

                {/* Service name & overall score */}
                <div className="text-center flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{currentEndorsement.serviceName}</p>
                  <p className="text-xs text-neutral-500">Overall: {currentEndorsement.percentage}%</p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1">Ref: {currentEndorsement.referenceNumber}</p>
                </div>

                {/* IQA Badge */}
                <div className="flex items-center justify-end flex-1">
                  <div className="text-center">
                    <svg viewBox="0 0 80 90" className="w-14 h-16">
                      {/* Crown */}
                      <path d="M25 20 L30 10 L35 18 L40 5 L45 18 L50 10 L55 20" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                      {/* Wreath */}
                      <ellipse cx="40" cy="55" rx="28" ry="30" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                      <path d="M12 55 Q20 25 40 25 Q60 25 68 55" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                      {/* Text */}
                      <text x="40" y="58" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1a1a1a">IQA</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Print button overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-lg"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
