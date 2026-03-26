'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuditProvider, useAudit } from '../../../qm7/context/AuditContext';
import type { SerializedAuditState } from '../../../qm7/context/AuditContext';
import AuditSetup from '../../../qm7/components/AuditSetup';
import VisitDetails from '../../../qm7/components/VisitDetails';
import CareSystemsObservation from '../../../qm7/components/CareSystemsObservation';
import Accreditations from '../../../qm7/components/Accreditations';
import AuditSection from '../../../qm7/components/AuditSection';
import AuditSidebar from '../../../qm7/components/AuditSidebar';
import AuditReport from '../../../qm7/components/AuditReport';
import { requiresVisitDetails } from '../../../qm7/types/audit';
import { createClient } from '../../../lib/supabase-browser';
import type {
  AuditSetupData,
  VisitDetails as VisitDetailsType,
  ObservationAuditData,
  AccreditationsData,
  AuditStep,
  Country,
} from '../../../qm7/types/audit';
import { getSectionsForCountry } from '../../../qm7/data/scotland-sections';

function buildSerializedState(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auditData: any,
  mode: string,
  auditNumber: string,
  serviceName: string,
  country: string,
  percentage: number,
  passed: boolean,
): SerializedAuditState {
  const emptyContact = { name: '', email: '', phone: '' };
  const raw = auditData?.setup ?? {};
  const setup: AuditSetupData = {
    auditNumber: raw.auditNumber || auditNumber || '',
    serviceType: raw.serviceType ?? 'supported-living',
    country: (raw.country || country || 'england') as Country,
    serviceName: raw.serviceName || serviceName || '',
    providerName: raw.providerName || '',
    auditorName: raw.auditorName || '',
    keyContact1: raw.keyContact1 ? { ...emptyContact, ...raw.keyContact1 } : { ...emptyContact },
    keyContact2: raw.keyContact2 ? { ...emptyContact, ...raw.keyContact2 } : { ...emptyContact },
  };

  const rawVisit = auditData?.visitDetails ?? {};
  const visitDetails: VisitDetailsType = {
    dateOfVisit: rawVisit.dateOfVisit ?? '',
    timeOfVisit: rawVisit.timeOfVisit ?? '',
    greeterName: rawVisit.greeterName ?? '',
    idChecked: rawVisit.idChecked ?? null,
    clientsInService: rawVisit.clientsInService ?? 0,
    staffOnShift: rawVisit.staffOnShift ?? 0,
    hasOtherVisitors: rawVisit.hasOtherVisitors ?? null,
    visitorNames: rawVisit.visitorNames ?? ['', '', ''],
    clientFocus1: rawVisit.clientFocus1 ?? '',
    clientFocus2: rawVisit.clientFocus2 ?? '',
  };

  const rawObs = auditData?.observationAudit ?? {};
  const observationAudit: ObservationAuditData = {
    careSupportSystem: rawObs.careSupportSystem ?? null,
    recentCareNotes: rawObs.recentCareNotes ?? null,
    redOverdueDates: rawObs.redOverdueDates ?? null,
    staffSystemSkill: rawObs.staffSystemSkill ?? null,
    notificationCount: rawObs.notificationCount ?? '',
    effectiveSystem: rawObs.effectiveSystem ?? null,
    observationOverview: rawObs.observationOverview ?? '',
    hasRecommendations: rawObs.hasRecommendations ?? null,
    recommendationsText: rawObs.recommendationsText ?? '',
  };

  const rawAcc = auditData?.accreditations ?? {};
  const accreditations: AccreditationsData = {
    cpi: rawAcc.cpi ?? null,
    bildPbs: rawAcc.bildPbs ?? null,
    stomp: rawAcc.stomp ?? null,
    omg: rawAcc.omg ?? null,
    rrn: rawAcc.rrn ?? null,
    bildObservationNotes: rawAcc.bildObservationNotes ?? '',
  };

  let sectionDataEntries: [string, unknown][] = auditData?.sectionDataEntries ?? [];

  if (sectionDataEntries.length === 0 && auditData?.sectionSummaries) {
    const countrySections = getSectionsForCountry((setup.country || 'england') as Country);
    sectionDataEntries = countrySections.map((sec, idx) => {
      const summary = auditData.sectionSummaries[idx];
      return [sec.id, {
        sectionId: sec.id,
        answers: sec.questions.map((q, qi) => ({
          questionId: q.id,
          answer: summary ? qi < summary.score : null,
        })),
        score: summary?.score ?? 0,
        narrative: summary?.narrative ?? '',
        isSaved: true,
        isNarrativeSaved: !!summary?.narrative,
      }];
    });
  }

  const targetStep: AuditStep = mode === 'report' ? 'report' : 'setup';

  return {
    setup,
    visitDetails,
    observationAudit,
    accreditations,
    currentStep: targetStep,
    currentSectionIndex: 0,
    sectionDataEntries: sectionDataEntries as SerializedAuditState['sectionDataEntries'],
    actionPlan: null,
    endorsement: passed ? {
      referenceNumber: `DPB-${auditNumber}-QM7`,
      passed: true,
      percentage,
      serviceName,
      dateIssued: new Date().toISOString(),
      endorsedBy: 'DPB Quality Management',
    } : null,
    isSetupSaved: true,
    isVisitDetailsSaved: true,
    isObservationSaved: true,
    isAccreditationsSaved: true,
  };
}

function AuditLoader({ auditId, mode }: { auditId: string; mode: string }) {
  const audit = useAudit();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('audit_history')
        .select('*')
        .eq('id', auditId)
        .single();

      if (fetchError || !data) {
        setError(fetchError?.message || 'Audit not found');
        setLoading(false);
        return;
      }

      const state = buildSerializedState(
        data.audit_data,
        mode,
        data.audit_number,
        data.service_name,
        data.country,
        data.percentage,
        data.passed,
      );

      audit.loadFromSupabase(state);
      audit.setSupabaseAuditId(auditId);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/admin" className="text-neutral-600 hover:text-neutral-900 text-sm">← Back to Admin</Link>
        </div>
      </div>
    );
  }

  return <AuditApp mode={mode} />;
}

function AuditApp({ mode }: { mode: string }) {
  const {
    setup,
    currentStep,
    currentSectionIndex,
    setCurrentSectionIndex,
    sections,
    setCurrentStep,
    supabaseAuditId,
    saveBackToSupabase,
  } = useAudit();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    const ok = await saveBackToSupabase();
    setSaveStatus(ok ? 'saved' : 'error');
    setSaving(false);
    if (ok) setTimeout(() => setSaveStatus('idle'), 3000);
  };

  useEffect(() => {
    if (currentStep === 'visit-details' && !requiresVisitDetails(setup.serviceType)) {
      setCurrentStep('care-systems');
    }
  }, [currentStep, setup.serviceType, setCurrentStep]);

  useEffect(() => {
    if (mode === 'report') {
      setCurrentStep('report');
    }
  }, [mode, setCurrentStep]);

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setCurrentStep('report');
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSectionSelect = (index: number) => {
    setCurrentSectionIndex(index);
    window.scrollTo(0, 0);
  };

  const adminBar = (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="font-medium hover:underline">← Admin</Link>
        <span className="opacity-70">|</span>
        <span className="font-medium">{setup.auditNumber} — {setup.serviceName}</span>
        {supabaseAuditId && <span className="opacity-50 text-xs">ID: {supabaseAuditId.slice(0, 8)}</span>}
      </div>
      <div className="flex items-center gap-2">
        {currentStep !== 'report' && (
          <>
            <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-white text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error — Retry' : 'Save Changes'}
            </button>
            <button onClick={() => setCurrentStep('report')} className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              View Report
            </button>
          </>
        )}
        {currentStep === 'report' && (
          <button onClick={() => setCurrentStep('setup')} className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            Edit Audit
          </button>
        )}
      </div>
    </div>
  );

  if (currentStep === 'setup') {
    return <>{adminBar}<div className="pt-10"><AuditSetup /></div></>;
  }

  if (currentStep === 'visit-details') {
    if (!requiresVisitDetails(setup.serviceType)) return null;
    return <>{adminBar}<div className="pt-10"><VisitDetails /></div></>;
  }

  if (currentStep === 'care-systems') {
    return <>{adminBar}<div className="pt-10"><CareSystemsObservation /></div></>;
  }

  if (currentStep === 'accreditations') {
    return <>{adminBar}<div className="pt-10"><Accreditations /></div></>;
  }

  if (currentStep === 'audit') {
    if (sections.length === 0) {
      return (
        <>
          {adminBar}
          <div className="min-h-screen flex items-center justify-center bg-white pt-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">No Sections Available</h2>
              <p className="text-neutral-600 mb-4">Please select a country to load the audit sections.</p>
              <button onClick={() => setCurrentStep('setup')} className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800">
                Go to Setup
              </button>
            </div>
          </div>
        </>
      );
    }

    const currentSection = sections[currentSectionIndex];
    return (
      <>
        {adminBar}
        <div className="flex min-h-screen bg-white pt-10">
          <AuditSidebar onSectionSelect={handleSectionSelect} />
          <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
            <AuditSection
              section={currentSection}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentSectionIndex === 0}
              isLast={currentSectionIndex === sections.length - 1}
            />
          </main>
        </div>
      </>
    );
  }

  if (currentStep === 'report') {
    return <>{adminBar}<div className="pt-10"><AuditReport /></div></>;
  }

  return null;
}

function AdminAuditContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'report';

  return (
    <AuditProvider>
      <AuditLoader auditId={resolvedParams.id} mode={mode} />
    </AuditProvider>
  );
}

export default function AdminAuditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    }>
      <AdminAuditContent params={params} />
    </Suspense>
  );
}
