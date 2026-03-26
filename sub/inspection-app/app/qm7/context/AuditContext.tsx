'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  AuditSetupData,
  VisitDetails,
  SectionData,
  QuestionAnswer,
  Country,
  ServiceType,
  Contact,
  ObservationAuditData,
  AccreditationsData,
  ActionPlan,
  AuditEndorsement,
  AuditStep,
  COUNTRY_PREFIXES,
  PASS_THRESHOLD,
  calculateSectionScore,
  requiresVisitDetails,
  generateEndorsementRef,
  initialObservationAudit,
  initialAccreditations,
} from '../types/audit';
import { getSectionsForCountry } from '../data/scotland-sections';
import { AuditSection } from '../types/audit';
import {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  serializeMap,
  deserializeMap,
  saveAuditToHistory,
  addEndorsedService,
} from '../../lib/storage';

let globalSequence = 100;

export interface SerializedAuditState {
  setup: AuditSetupData;
  visitDetails: VisitDetails;
  observationAudit: ObservationAuditData;
  accreditations: AccreditationsData;
  currentStep: AuditStep;
  currentSectionIndex: number;
  sectionDataEntries: [string, SectionData][];
  actionPlan: ActionPlan | null;
  endorsement: AuditEndorsement | null;
  isSetupSaved: boolean;
  isVisitDetailsSaved: boolean;
  isObservationSaved: boolean;
  isAccreditationsSaved: boolean;
}

interface AuditContextType {
  setup: AuditSetupData;
  updateSetup: (data: Partial<AuditSetupData>) => void;
  setServiceType: (type: ServiceType) => void;
  setCountry: (country: Country) => void;

  visitDetails: VisitDetails;
  updateVisitDetails: (data: Partial<VisitDetails>) => void;

  observationAudit: ObservationAuditData;
  updateObservationAudit: (data: Partial<ObservationAuditData>) => void;
  isObservationValid: () => boolean;
  saveObservation: () => void;
  isObservationSaved: boolean;

  accreditations: AccreditationsData;
  updateAccreditations: (data: Partial<AccreditationsData>) => void;
  isAccreditationsValid: () => boolean;
  saveAccreditations: () => void;
  isAccreditationsSaved: boolean;

  currentStep: AuditStep;
  setCurrentStep: (step: AuditStep) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;

  sections: AuditSection[];
  sectionData: Map<string, SectionData>;
  updateSectionAnswer: (sectionId: string, questionId: string, answer: boolean) => void;
  updateSectionNarrative: (sectionId: string, narrative: string) => void;
  saveSectionScore: (sectionId: string) => void;
  saveSectionNarrative: (sectionId: string) => void;
  getSectionScore: (sectionId: string) => number;
  getTotalScore: () => number;
  getTotalMaxScore: () => number;
  getPercentage: () => number;
  isPassing: () => boolean;

  actionPlan: ActionPlan | null;
  setActionPlan: (plan: ActionPlan | null) => void;
  endorsement: AuditEndorsement | null;
  generateEndorsement: () => AuditEndorsement;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: AuditSetupData[];

  isSetupValid: () => boolean;
  isVisitDetailsValid: () => boolean;
  saveSetup: () => void;
  saveVisitDetails: () => void;
  isSetupSaved: boolean;
  isVisitDetailsSaved: boolean;

  saveCurrentState: () => void;
  loadSavedAudit: (auditNumber: string) => void;
  loadFromSupabase: (data: SerializedAuditState) => void;
  supabaseAuditId: string | null;
  setSupabaseAuditId: (id: string | null) => void;
  saveBackToSupabase: () => Promise<boolean>;
}

const AuditContext = createContext<AuditContextType | null>(null);

const emptyContact: Contact = { name: '', email: '', phone: '' };

const initialSetup: AuditSetupData = {
  auditNumber: '',
  serviceType: null,
  country: null,
  serviceName: '',
  providerName: '',
  auditorName: '',
  keyContact1: { ...emptyContact },
  keyContact2: { ...emptyContact }
};

const initialVisitDetails: VisitDetails = {
  dateOfVisit: '',
  timeOfVisit: '',
  greeterName: '',
  idChecked: null,
  clientsInService: 0,
  staffOnShift: 0,
  hasOtherVisitors: null,
  visitorNames: ['', '', ''],
  clientFocus1: '',
  clientFocus2: ''
};

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [setup, setSetup] = useState<AuditSetupData>(initialSetup);
  const [visitDetails, setVisitDetails] = useState<VisitDetails>(initialVisitDetails);
  const [observationAudit, setObservationAudit] = useState<ObservationAuditData>(initialObservationAudit);
  const [accreditations, setAccreditationsState] = useState<AccreditationsData>(initialAccreditations);
  const [currentStep, setCurrentStep] = useState<AuditStep>('setup');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionData, setSectionData] = useState<Map<string, SectionData>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSetupSaved, setIsSetupSaved] = useState(false);
  const [isVisitDetailsSaved, setIsVisitDetailsSaved] = useState(false);
  const [isObservationSaved, setIsObservationSaved] = useState(false);
  const [isAccreditationsSaved, setIsAccreditationsSaved] = useState(false);
  const [sections, setSections] = useState<AuditSection[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [endorsement, setEndorsement] = useState<AuditEndorsement | null>(null);
  const [supabaseAuditId, setSupabaseAuditId] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const saved = loadFromStorage<SerializedAuditState>(STORAGE_KEYS.QM7_AUDIT);
    if (!saved) return;

    setSetup(saved.setup);
    setVisitDetails(saved.visitDetails);
    setObservationAudit(saved.observationAudit);
    setAccreditationsState(saved.accreditations);
    setCurrentStep(saved.currentStep);
    setCurrentSectionIndex(saved.currentSectionIndex);
    setActionPlan(saved.actionPlan);
    setEndorsement(saved.endorsement);
    setIsSetupSaved(saved.isSetupSaved);
    setIsVisitDetailsSaved(saved.isVisitDetailsSaved);
    setIsObservationSaved(saved.isObservationSaved);
    setIsAccreditationsSaved(saved.isAccreditationsSaved);

    if (saved.sectionDataEntries?.length > 0) {
      setSectionData(deserializeMap(saved.sectionDataEntries));
    }
  }, []);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const serialized: SerializedAuditState = {
        setup,
        visitDetails,
        observationAudit,
        accreditations,
        currentStep,
        currentSectionIndex,
        sectionDataEntries: serializeMap(sectionData),
        actionPlan,
        endorsement,
        isSetupSaved,
        isVisitDetailsSaved,
        isObservationSaved,
        isAccreditationsSaved,
      };
      saveToStorage(STORAGE_KEYS.QM7_AUDIT, serialized);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    setup, visitDetails, observationAudit, accreditations,
    currentStep, currentSectionIndex, sectionData,
    actionPlan, endorsement,
    isSetupSaved, isVisitDetailsSaved, isObservationSaved, isAccreditationsSaved,
  ]);

  useEffect(() => {
    if (setup.country) {
      const countrySections = getSectionsForCountry(setup.country);
      setSections(countrySections);

      const newSectionData = new Map<string, SectionData>();
      countrySections.forEach(section => {
        newSectionData.set(section.id, {
          sectionId: section.id,
          answers: section.questions.map(q => ({ questionId: q.id, answer: null })),
          score: 0,
          narrative: '',
          isSaved: false,
          isNarrativeSaved: false
        });
      });
      setSectionData(newSectionData);
    }
  }, [setup.country]);

  const updateSetup = useCallback((data: Partial<AuditSetupData>) => {
    setSetup(prev => ({ ...prev, ...data }));
    setIsSetupSaved(false);
  }, []);

  const setServiceType = useCallback((type: ServiceType) => {
    setSetup(prev => ({ ...prev, serviceType: type }));
    setIsSetupSaved(false);
  }, []);

  const setCountry = useCallback((country: Country) => {
    globalSequence++;
    const prefix = COUNTRY_PREFIXES[country];
    const auditNumber = `${prefix}-${globalSequence}`;
    setSetup(prev => ({ ...prev, country, auditNumber }));
    setIsSetupSaved(false);
  }, []);

  const updateVisitDetails = useCallback((data: Partial<VisitDetails>) => {
    setVisitDetails(prev => ({ ...prev, ...data }));
    setIsVisitDetailsSaved(false);
  }, []);

  const updateObservationAudit = useCallback((data: Partial<ObservationAuditData>) => {
    setObservationAudit(prev => ({ ...prev, ...data }));
    setIsObservationSaved(false);
  }, []);

  const updateAccreditations = useCallback((data: Partial<AccreditationsData>) => {
    setAccreditationsState(prev => ({ ...prev, ...data }));
    setIsAccreditationsSaved(false);
  }, []);

  const updateSectionAnswer = useCallback((sectionId: string, questionId: string, answer: boolean) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        const updatedAnswers = existing.answers.map(a =>
          a.questionId === questionId ? { ...a, answer } : a
        );
        const score = calculateSectionScore(updatedAnswers);
        newMap.set(sectionId, { ...existing, answers: updatedAnswers, score, isSaved: false });
      }
      return newMap;
    });
  }, []);

  const updateSectionNarrative = useCallback((sectionId: string, narrative: string) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        newMap.set(sectionId, { ...existing, narrative, isNarrativeSaved: false });
      }
      return newMap;
    });
  }, []);

  const saveSectionScore = useCallback((sectionId: string) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        newMap.set(sectionId, { ...existing, isSaved: true });
      }
      return newMap;
    });
  }, []);

  const saveSectionNarrative = useCallback((sectionId: string) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        newMap.set(sectionId, { ...existing, isNarrativeSaved: true });
      }
      return newMap;
    });
  }, []);

  const getSectionScore = useCallback((sectionId: string): number => {
    const data = sectionData.get(sectionId);
    return data?.score ?? 0;
  }, [sectionData]);

  const getTotalScore = useCallback((): number => {
    let total = 0;
    sectionData.forEach(data => { total += data.score; });
    return total;
  }, [sectionData]);

  const getTotalMaxScore = useCallback((): number => {
    return sections.reduce((sum, s) => sum + s.maxScore, 0);
  }, [sections]);

  const getPercentage = useCallback((): number => {
    const max = sections.reduce((sum, s) => sum + s.maxScore, 0);
    if (max === 0) return 0;
    let total = 0;
    sectionData.forEach(data => { total += data.score; });
    return Math.round((total / max) * 100);
  }, [sections, sectionData]);

  const isPassing = useCallback((): boolean => {
    return getPercentage() >= PASS_THRESHOLD;
  }, [getPercentage]);

  const isSetupValid = useCallback((): boolean => {
    return !!(
      setup.serviceType &&
      setup.country &&
      setup.serviceName.trim() &&
      setup.keyContact1.name.trim() &&
      setup.keyContact1.email.trim() &&
      setup.keyContact1.phone.trim()
    );
  }, [setup]);

  const isVisitDetailsValid = useCallback((): boolean => {
    return !!(
      visitDetails.dateOfVisit &&
      visitDetails.timeOfVisit &&
      visitDetails.greeterName.trim() &&
      visitDetails.idChecked !== null &&
      visitDetails.clientsInService > 0 &&
      visitDetails.staffOnShift > 0 &&
      visitDetails.hasOtherVisitors !== null &&
      visitDetails.clientFocus1.trim()
    );
  }, [visitDetails]);

  const isObservationValid = useCallback((): boolean => {
    return !!(
      observationAudit.careSupportSystem &&
      observationAudit.recentCareNotes !== null &&
      observationAudit.staffSystemSkill &&
      observationAudit.effectiveSystem !== null &&
      observationAudit.hasRecommendations !== null
    );
  }, [observationAudit]);

  const isAccreditationsValid = useCallback((): boolean => {
    return !!(
      accreditations.cpi !== null &&
      accreditations.bildPbs !== null &&
      accreditations.stomp !== null
    );
  }, [accreditations]);

  const saveSetup = useCallback(() => {
    if (isSetupValid()) setIsSetupSaved(true);
  }, [isSetupValid]);

  const saveVisitDetails = useCallback(() => {
    if (isVisitDetailsValid()) setIsVisitDetailsSaved(true);
  }, [isVisitDetailsValid]);

  const saveObservation = useCallback(() => {
    if (isObservationValid()) setIsObservationSaved(true);
  }, [isObservationValid]);

  const saveAccreditations = useCallback(() => {
    if (isAccreditationsValid()) setIsAccreditationsSaved(true);
  }, [isAccreditationsValid]);

  const generateEndorsement = useCallback((): AuditEndorsement => {
    const pct = getPercentage();
    const ref = generateEndorsementRef(setup.auditNumber);
    const newEndorsement: AuditEndorsement = {
      referenceNumber: ref,
      passed: pct >= PASS_THRESHOLD,
      percentage: pct,
      serviceName: setup.serviceName,
      dateIssued: new Date().toISOString(),
      endorsedBy: 'DPB Quality Management',
    };
    setEndorsement(newEndorsement);

    saveAuditToHistory({
      auditNumber: setup.auditNumber,
      serviceName: setup.serviceName,
      country: setup.country ?? '',
      percentage: pct,
      dateCompleted: new Date().toISOString(),
      passed: pct >= PASS_THRESHOLD,
    });

    const followUpDate = pct < PASS_THRESHOLD
      ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : undefined;

    const actionPlanItems = pct < PASS_THRESHOLD && actionPlan
      ? actionPlan.items.map(item => ({
          area: item.area,
          action: item.action,
          priority: item.priority,
          deadline: item.deadline,
          completed: false,
        }))
      : undefined;

    fetch('/api/audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auditNumber: setup.auditNumber,
        serviceName: setup.serviceName,
        country: setup.country ?? '',
        percentage: pct,
        dateCompleted: new Date().toISOString(),
        passed: pct >= PASS_THRESHOLD,
        followUpDate,
        actionPlanItems,
        auditData: {
          setup,
          visitDetails,
          observationAudit,
          accreditations,
          sectionDataEntries: serializeMap(sectionData),
        },
      }),
    }).catch(() => {});

    if (pct >= PASS_THRESHOLD) {
      const endorsed = {
        referenceNumber: ref,
        auditNumber: setup.auditNumber,
        serviceName: setup.serviceName,
        percentage: pct,
        dateIssued: new Date().toISOString(),
        country: setup.country ?? '',
        endorsedBy: 'DPB Quality Management',
      };
      addEndorsedService(endorsed);
      fetch('/api/endorsed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endorsed),
      }).catch(() => {});
    }

    return newEndorsement;
  }, [getPercentage, setup, visitDetails, observationAudit, accreditations, sectionData]);

  const saveCurrentState = useCallback(() => {
    const serialized: SerializedAuditState = {
      setup,
      visitDetails,
      observationAudit,
      accreditations,
      currentStep,
      currentSectionIndex,
      sectionDataEntries: serializeMap(sectionData),
      actionPlan,
      endorsement,
      isSetupSaved,
      isVisitDetailsSaved,
      isObservationSaved,
      isAccreditationsSaved,
    };
    saveToStorage(STORAGE_KEYS.QM7_AUDIT, serialized);
  }, [
    setup, visitDetails, observationAudit, accreditations,
    currentStep, currentSectionIndex, sectionData,
    actionPlan, endorsement,
    isSetupSaved, isVisitDetailsSaved, isObservationSaved, isAccreditationsSaved,
  ]);

  const loadSavedAudit = useCallback((auditNumber: string) => {
    const saved = loadFromStorage<SerializedAuditState>(STORAGE_KEYS.QM7_AUDIT);
    if (saved && saved.setup.auditNumber === auditNumber) {
      setSetup(saved.setup);
      setVisitDetails(saved.visitDetails);
      setObservationAudit(saved.observationAudit);
      setAccreditationsState(saved.accreditations);
      setCurrentStep(saved.currentStep);
      setCurrentSectionIndex(saved.currentSectionIndex);
      setActionPlan(saved.actionPlan);
      setEndorsement(saved.endorsement);
      setIsSetupSaved(saved.isSetupSaved);
      setIsVisitDetailsSaved(saved.isVisitDetailsSaved);
      setIsObservationSaved(saved.isObservationSaved);
      setIsAccreditationsSaved(saved.isAccreditationsSaved);
      if (saved.sectionDataEntries?.length > 0) {
        setSectionData(deserializeMap(saved.sectionDataEntries));
      }
    }
  }, []);

  const loadFromSupabase = useCallback((data: SerializedAuditState) => {
    setSetup(data.setup);
    setVisitDetails(data.visitDetails);
    setObservationAudit(data.observationAudit);
    setAccreditationsState(data.accreditations);
    setCurrentStep(data.currentStep);
    setCurrentSectionIndex(data.currentSectionIndex);
    setActionPlan(data.actionPlan);
    setEndorsement(data.endorsement);
    setIsSetupSaved(data.isSetupSaved);
    setIsVisitDetailsSaved(data.isVisitDetailsSaved);
    setIsObservationSaved(data.isObservationSaved);
    setIsAccreditationsSaved(data.isAccreditationsSaved);
    if (data.sectionDataEntries?.length > 0) {
      setSectionData(deserializeMap(data.sectionDataEntries));
    }
  }, []);

  const saveBackToSupabase = useCallback(async (): Promise<boolean> => {
    if (!supabaseAuditId) return false;
    const pct = getPercentage();
    const serialized: SerializedAuditState = {
      setup, visitDetails, observationAudit, accreditations,
      currentStep, currentSectionIndex,
      sectionDataEntries: serializeMap(sectionData),
      actionPlan, endorsement,
      isSetupSaved, isVisitDetailsSaved, isObservationSaved, isAccreditationsSaved,
    };
    try {
      const res = await fetch('/api/audits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: supabaseAuditId,
          auditNumber: setup.auditNumber,
          serviceName: setup.serviceName,
          country: setup.country ?? '',
          percentage: pct,
          passed: pct >= PASS_THRESHOLD,
          auditData: serialized,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [supabaseAuditId, setup, visitDetails, observationAudit, accreditations, currentStep, currentSectionIndex, sectionData, actionPlan, endorsement, isSetupSaved, isVisitDetailsSaved, isObservationSaved, isAccreditationsSaved, getPercentage]);

  const searchResults: AuditSetupData[] = [];

  return (
    <AuditContext.Provider value={{
      setup, updateSetup, setServiceType, setCountry,
      visitDetails, updateVisitDetails,
      observationAudit, updateObservationAudit, isObservationValid, saveObservation, isObservationSaved,
      accreditations, updateAccreditations, isAccreditationsValid, saveAccreditations, isAccreditationsSaved,
      currentStep, setCurrentStep,
      currentSectionIndex, setCurrentSectionIndex,
      sections, sectionData,
      updateSectionAnswer, updateSectionNarrative,
      saveSectionScore, saveSectionNarrative,
      getSectionScore, getTotalScore, getTotalMaxScore, getPercentage, isPassing,
      actionPlan, setActionPlan,
      endorsement, generateEndorsement,
      searchQuery, setSearchQuery, searchResults,
      isSetupValid, isVisitDetailsValid,
      saveSetup, saveVisitDetails,
      isSetupSaved, isVisitDetailsSaved,
      saveCurrentState, loadSavedAudit,
      loadFromSupabase, supabaseAuditId, setSupabaseAuditId, saveBackToSupabase,
    }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}
