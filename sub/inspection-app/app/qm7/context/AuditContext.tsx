'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  AuditSetupData,
  VisitDetails,
  SectionData,
  QuestionAnswer,
  Country,
  ServiceType,
  Contact,
  COUNTRY_PREFIXES,
  calculateSectionScore,
  requiresVisitDetails
} from '../types/audit';
import { getSectionsForCountry } from '../data/scotland-sections';
import { AuditSection } from '../types/audit';

// Sequence number storage (in production, this would be in a database)
let globalSequence = 100;

interface AuditContextType {
  // Setup data
  setup: AuditSetupData;
  updateSetup: (data: Partial<AuditSetupData>) => void;
  setServiceType: (type: ServiceType) => void;
  setCountry: (country: Country) => void;
  
  // Visit details
  visitDetails: VisitDetails;
  updateVisitDetails: (data: Partial<VisitDetails>) => void;
  
  // Navigation
  currentStep: 'setup' | 'visit-details' | 'audit' | 'report';
  setCurrentStep: (step: 'setup' | 'visit-details' | 'audit' | 'report') => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  
  // Sections
  sections: AuditSection[];
  sectionData: Map<string, SectionData>;
  updateSectionAnswer: (sectionId: string, questionId: string, answer: boolean) => void;
  updateSectionNarrative: (sectionId: string, narrative: string) => void;
  saveSectionScore: (sectionId: string) => void;
  saveSectionNarrative: (sectionId: string) => void;
  getSectionScore: (sectionId: string) => number;
  getTotalScore: () => number;
  getTotalMaxScore: () => number;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: AuditSetupData[];
  
  // Validation
  isSetupValid: () => boolean;
  isVisitDetailsValid: () => boolean;
  
  // Save all
  saveSetup: () => void;
  saveVisitDetails: () => void;
  isSetupSaved: boolean;
  isVisitDetailsSaved: boolean;
}

const AuditContext = createContext<AuditContextType | null>(null);

const emptyContact: Contact = { name: '', email: '', phone: '' };

const initialSetup: AuditSetupData = {
  auditNumber: '',
  serviceType: null,
  country: null,
  serviceName: '',
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
  const [currentStep, setCurrentStep] = useState<'setup' | 'visit-details' | 'audit' | 'report'>('setup');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionData, setSectionData] = useState<Map<string, SectionData>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSetupSaved, setIsSetupSaved] = useState(false);
  const [isVisitDetailsSaved, setIsVisitDetailsSaved] = useState(false);
  const [sections, setSections] = useState<AuditSection[]>([]);

  // Update sections when country changes
  useEffect(() => {
    if (setup.country) {
      const countrySections = getSectionsForCountry(setup.country);
      setSections(countrySections);
      
      // Initialize section data for each section
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

  const updateSectionAnswer = useCallback((sectionId: string, questionId: string, answer: boolean) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        const updatedAnswers = existing.answers.map(a =>
          a.questionId === questionId ? { ...a, answer } : a
        );
        const score = calculateSectionScore(updatedAnswers);
        newMap.set(sectionId, {
          ...existing,
          answers: updatedAnswers,
          score,
          isSaved: false
        });
      }
      return newMap;
    });
  }, []);

  const updateSectionNarrative = useCallback((sectionId: string, narrative: string) => {
    setSectionData(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      if (existing) {
        newMap.set(sectionId, {
          ...existing,
          narrative,
          isNarrativeSaved: false
        });
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
    sectionData.forEach(data => {
      total += data.score;
    });
    return total;
  }, [sectionData]);

  const getTotalMaxScore = useCallback((): number => {
    return sections.reduce((sum, s) => sum + s.maxScore, 0);
  }, [sections]);

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

  const saveSetup = useCallback(() => {
    if (isSetupValid()) {
      setIsSetupSaved(true);
    }
  }, [isSetupValid]);

  const saveVisitDetails = useCallback(() => {
    if (isVisitDetailsValid()) {
      setIsVisitDetailsSaved(true);
    }
  }, [isVisitDetailsValid]);

  // Search results (mock - in production this would query a database)
  const searchResults: AuditSetupData[] = [];

  return (
    <AuditContext.Provider value={{
      setup,
      updateSetup,
      setServiceType,
      setCountry,
      visitDetails,
      updateVisitDetails,
      currentStep,
      setCurrentStep,
      currentSectionIndex,
      setCurrentSectionIndex,
      sections,
      sectionData,
      updateSectionAnswer,
      updateSectionNarrative,
      saveSectionScore,
      saveSectionNarrative,
      getSectionScore,
      getTotalScore,
      getTotalMaxScore,
      searchQuery,
      setSearchQuery,
      searchResults,
      isSetupValid,
      isVisitDetailsValid,
      saveSetup,
      saveVisitDetails,
      isSetupSaved,
      isVisitDetailsSaved
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
