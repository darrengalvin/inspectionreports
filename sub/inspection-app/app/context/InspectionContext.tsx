'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  InspectionData, 
  SectionResponse, 
  Quote, 
  QuestionResponse,
  Action,
  getStatusFromScore,
  getVerdictFromScore
} from '../types/inspection';
import { inspectionSections } from '../data/sections';

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
}

const InspectionContext = createContext<InspectionContextType | null>(null);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [propertyName, setPropertyName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [residentsInterviewed, setResidentsInterviewed] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionResponses, setSectionResponses] = useState<Map<string, SectionResponse>>(new Map());
  const [actions, setActions] = useState<Action[]>([]);

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
    
    return {
      id: `QA-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`,
      propertyName,
      providerName,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      residentsInterviewed,
      totalResidents,
      sections,
      overallScore: Math.round(overallScore * 10) / 10,
      overallVerdict: getVerdictFromScore(overallScore),
      assessmentSummary: '', // To be written by inspector
      actions
    };
  }, [propertyName, providerName, residentsInterviewed, totalResidents, sectionResponses, actions]);

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
      currentSectionIndex,
      setCurrentSectionIndex,
      sectionResponses,
      updateSectionResponse,
      actions,
      addAction,
      removeAction,
      generateReportData,
      getProgress
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
