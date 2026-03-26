'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { 
  InspectionData, 
  SectionResponse, 
  Quote, 
  QuestionResponse,
  Action,
  InspectorInfo,
  getStatusFromScore,
  getVerdictFromScore
} from '../types/inspection';
import { inspectionSections } from '../data/sections';
import {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  serializeMap,
  deserializeMap,
} from '../lib/storage';

interface SerializedInspectionState {
  propertyName: string;
  providerName: string;
  residentsInterviewed: number;
  totalResidents: number;
  inspectorName: string;
  currentSectionIndex: number;
  sectionResponseEntries: [string, SectionResponse][];
  actions: Action[];
}

interface InspectionContextType {
  // Property info
  propertyName: string;
  setPropertyName: (name: string) => void;
  providerName: string;
  setProviderName: (name: string) => void;
  residentsInterviewed: number;
  setResidentsInterviewed: (count: number) => void;
  totalResidents: number;
  setTotalResidents: (count: number) => void;
  inspectorName: string;
  setInspectorName: (name: string) => void;
  
  // Navigation
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  
  // Section responses
  sectionResponses: Map<string, SectionResponse>;
  updateSectionResponse: (sectionId: string, response: Partial<SectionResponse>) => void;
  
  // Actions
  actions: Action[];
  addAction: (action: Action) => void;
  removeAction: (actionId: string) => void;
  
  // Generate final report data
  generateReportData: () => InspectionData;
  
  // Progress
  getProgress: () => number;

  saveCurrentState: () => void;
}

const InspectionContext = createContext<InspectionContextType | null>(null);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [propertyName, setPropertyName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [residentsInterviewed, setResidentsInterviewed] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);
  const [inspectorName, setInspectorName] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionResponses, setSectionResponses] = useState<Map<string, SectionResponse>>(new Map());
  const [actions, setActions] = useState<Action[]>([]);
  const hasLoadedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const saved = loadFromStorage<SerializedInspectionState>(STORAGE_KEYS.INSPECTION);
    if (!saved) return;

    setPropertyName(saved.propertyName);
    setProviderName(saved.providerName);
    setResidentsInterviewed(saved.residentsInterviewed);
    setTotalResidents(saved.totalResidents);
    setInspectorName(saved.inspectorName);
    setCurrentSectionIndex(saved.currentSectionIndex);
    setActions(saved.actions);
    if (saved.sectionResponseEntries?.length > 0) {
      setSectionResponses(deserializeMap(saved.sectionResponseEntries));
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const serialized: SerializedInspectionState = {
        propertyName,
        providerName,
        residentsInterviewed,
        totalResidents,
        inspectorName,
        currentSectionIndex,
        sectionResponseEntries: serializeMap(sectionResponses),
        actions,
      };
      saveToStorage(STORAGE_KEYS.INSPECTION, serialized);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    propertyName, providerName, residentsInterviewed, totalResidents,
    inspectorName, currentSectionIndex, sectionResponses, actions,
  ]);

  const updateSectionResponse = useCallback((sectionId: string, response: Partial<SectionResponse>) => {
    setSectionResponses(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId) || {
        sectionId,
        score: 5,
        status: 'improvement-needed' as const,
        responses: [],
        quotes: [],
        whyThisScore: ''
      };
      
      const updated = { ...existing, ...response };
      // Auto-update status based on score
      if (response.score !== undefined) {
        updated.status = getStatusFromScore(response.score);
      }
      
      newMap.set(sectionId, updated);
      return newMap;
    });
  }, []);

  const addAction = useCallback((action: Action) => {
    setActions(prev => [...prev, action]);
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
  }, []);

  const getProgress = useCallback(() => {
    const completedSections = Array.from(sectionResponses.values()).filter(
      r => r.whyThisScore.length > 0
    ).length;
    return (completedSections / inspectionSections.length) * 100;
  }, [sectionResponses]);

  const generateReportData = useCallback((): InspectionData => {
    const sections = Array.from(sectionResponses.values());
    const totalScore = sections.reduce((sum, s) => sum + s.score, 0);
    const overallScore = sections.length > 0 ? totalScore / sections.length : 0;

    const autoActions: Action[] = sections
      .filter(s => s.score < 5)
      .map((s, i) => {
        const sectionDef = inspectionSections.find(sec => sec.id === s.sectionId);
        return {
          id: `auto-${i + 1}`,
          priority: s.score < 3 ? 'high' as const : 'medium' as const,
          title: `Improve ${sectionDef?.title || s.sectionId}`,
          description: `Score of ${s.score}/10 is below acceptable threshold. ${s.whyThisScore ? `Inspector noted: ${s.whyThisScore.slice(0, 120)}` : 'Immediate review required.'}`,
          deadline: new Date(Date.now() + (s.score < 3 ? 30 : 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
      });

    const allActions = [...actions, ...autoActions];
    const followUp = allActions.length > 0
      ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : undefined;

    const reportData: InspectionData = {
      id: `QA-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      propertyName,
      providerName,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      residentsInterviewed,
      totalResidents,
      sections,
      overallScore: Math.round(overallScore * 10) / 10,
      overallVerdict: getVerdictFromScore(overallScore),
      assessmentSummary: '',
      actions: allActions,
      inspector: inspectorName ? { name: inspectorName, role: 'Lead Quality Inspector' } : undefined,
      followUpDate: followUp,
    };

    fetch('/api/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyName,
        providerName,
        overallScore: reportData.overallScore,
        dateCompleted: new Date().toISOString(),
        reportData,
      }),
    }).catch(() => {});

    return reportData;
  }, [propertyName, providerName, residentsInterviewed, totalResidents, sectionResponses, actions, inspectorName]);

  const saveCurrentState = useCallback(() => {
    const serialized: SerializedInspectionState = {
      propertyName,
      providerName,
      residentsInterviewed,
      totalResidents,
      inspectorName,
      currentSectionIndex,
      sectionResponseEntries: serializeMap(sectionResponses),
      actions,
    };
    saveToStorage(STORAGE_KEYS.INSPECTION, serialized);
  }, [
    propertyName, providerName, residentsInterviewed, totalResidents,
    inspectorName, currentSectionIndex, sectionResponses, actions,
  ]);

  return (
    <InspectionContext.Provider value={{
      propertyName,
      setPropertyName,
      providerName,
      setProviderName,
      residentsInterviewed,
      setResidentsInterviewed,
      totalResidents,
      setTotalResidents,
      inspectorName,
      setInspectorName,
      currentSectionIndex,
      setCurrentSectionIndex,
      sectionResponses,
      updateSectionResponse,
      actions,
      addAction,
      removeAction,
      generateReportData,
      getProgress,
      saveCurrentState,
    }}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within InspectionProvider');
  }
  return context;
}
