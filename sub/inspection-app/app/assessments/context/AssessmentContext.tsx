'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  IndividualInfo,
  ServiceFacility,
  StaffProfile,
  CurrentResidentProfile,
  MatchingResult,
  TransitionPlan,
  SupportLevel,
  initialIndividual,
  initialFacility,
  initialStaffProfile,
  calculateMatch,
  generateDefaultTransitionPlan,
} from '../types/assessment';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '../../lib/storage';

type AssessmentStep = 'individual' | 'facility' | 'staff' | 'residents' | 'results' | 'transition';

interface SerializedAssessmentState {
  individual: IndividualInfo;
  facility: ServiceFacility;
  staffProfile: StaffProfile;
  residents: CurrentResidentProfile[];
  matchingResult: MatchingResult | null;
  transitionPlan: TransitionPlan | null;
  currentStep: AssessmentStep;
}

interface AssessmentContextType {
  individual: IndividualInfo;
  updateIndividual: (data: Partial<IndividualInfo>) => void;

  facility: ServiceFacility;
  updateFacility: (data: Partial<ServiceFacility>) => void;

  staffProfile: StaffProfile;
  updateStaffProfile: (data: Partial<StaffProfile>) => void;

  residents: CurrentResidentProfile[];
  addResident: () => void;
  updateResident: (index: number, data: Partial<CurrentResidentProfile>) => void;
  removeResident: (index: number) => void;

  matchingResult: MatchingResult | null;
  runMatching: () => void;

  transitionPlan: TransitionPlan | null;
  generateTransition: (moveDate: string) => void;
  toggleTransitionItem: (itemId: string) => void;

  currentStep: AssessmentStep;
  setCurrentStep: (step: AssessmentStep) => void;

  saveCurrentState: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [individual, setIndividual] = useState<IndividualInfo>(initialIndividual);
  const [facility, setFacility] = useState<ServiceFacility>(initialFacility);
  const [staffProfile, setStaffProfile] = useState<StaffProfile>(initialStaffProfile);
  const [residents, setResidents] = useState<CurrentResidentProfile[]>([]);
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [transitionPlan, setTransitionPlan] = useState<TransitionPlan | null>(null);
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('individual');
  const hasLoadedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const saved = loadFromStorage<SerializedAssessmentState>(STORAGE_KEYS.ASSESSMENT);
    if (!saved) return;

    setIndividual(saved.individual);
    setFacility(saved.facility);
    setStaffProfile(saved.staffProfile);
    setResidents(saved.residents);
    setMatchingResult(saved.matchingResult);
    setTransitionPlan(saved.transitionPlan);
    setCurrentStep(saved.currentStep);
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const serialized: SerializedAssessmentState = {
        individual,
        facility,
        staffProfile,
        residents,
        matchingResult,
        transitionPlan,
        currentStep,
      };
      saveToStorage(STORAGE_KEYS.ASSESSMENT, serialized);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [individual, facility, staffProfile, residents, matchingResult, transitionPlan, currentStep]);

  const updateIndividual = useCallback((data: Partial<IndividualInfo>) => {
    setIndividual(prev => ({ ...prev, ...data }));
  }, []);

  const updateFacility = useCallback((data: Partial<ServiceFacility>) => {
    setFacility(prev => ({ ...prev, ...data }));
  }, []);

  const updateStaffProfile = useCallback((data: Partial<StaffProfile>) => {
    setStaffProfile(prev => ({ ...prev, ...data }));
  }, []);

  const addResident = useCallback(() => {
    setResidents(prev => [...prev, { name: '', supportLevel: null, keyNeeds: '', personalityMatch: null }]);
  }, []);

  const updateResident = useCallback((index: number, data: Partial<CurrentResidentProfile>) => {
    setResidents(prev => prev.map((r, i) => i === index ? { ...r, ...data } : r));
  }, []);

  const removeResident = useCallback((index: number) => {
    setResidents(prev => prev.filter((_, i) => i !== index));
  }, []);

  const runMatching = useCallback(() => {
    const result = calculateMatch(individual, facility, staffProfile, residents);
    setMatchingResult(result);
    setCurrentStep('results');

    fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        individualName: individual.name,
        facilityName: facility.name,
        supportLevel: result.calculatedSupportLevel,
        overallPercentage: result.overallPercentage,
        dateCompleted: new Date().toISOString(),
        hasTransitionPlan: false,
        assessmentData: { individual, facility, staffProfile, residents, matchingResult: result },
      }),
    }).catch(() => {});
  }, [individual, facility, staffProfile, residents]);

  const generateTransition = useCallback((moveDate: string) => {
    const plan = generateDefaultTransitionPlan(individual.name, facility.name, moveDate);
    setTransitionPlan(plan);
    setCurrentStep('transition');
  }, [individual.name, facility.name]);

  const toggleTransitionItem = useCallback((itemId: string) => {
    setTransitionPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      };
    });
  }, []);

  const saveCurrentState = useCallback(() => {
    const serialized: SerializedAssessmentState = {
      individual,
      facility,
      staffProfile,
      residents,
      matchingResult,
      transitionPlan,
      currentStep,
    };
    saveToStorage(STORAGE_KEYS.ASSESSMENT, serialized);
  }, [individual, facility, staffProfile, residents, matchingResult, transitionPlan, currentStep]);

  return (
    <AssessmentContext.Provider value={{
      individual, updateIndividual,
      facility, updateFacility,
      staffProfile, updateStaffProfile,
      residents, addResident, updateResident, removeResident,
      matchingResult, runMatching,
      transitionPlan, generateTransition, toggleTransitionItem,
      currentStep, setCurrentStep,
      saveCurrentState,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within AssessmentProvider');
  return context;
}
