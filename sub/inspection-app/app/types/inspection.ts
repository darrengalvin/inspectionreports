// Core types for the inspection system

export interface Question {
  id: string;
  text: string;
  probes?: string[]; // Follow-up probing questions
}

export interface Section {
  id: string;
  number: number;
  title: string;
  purpose: string;
  questions: Question[];
}

export interface Quote {
  text: string;
  residentId: string;
  sentiment: 'positive' | 'concern' | 'neutral';
}

export interface QuestionResponse {
  questionId: string;
  finding: string;
  details?: string;
}

export interface SectionResponse {
  sectionId: string;
  score: number; // 1-10
  status: 'meeting-standard' | 'improvement-needed' | 'inadequate';
  responses: QuestionResponse[];
  quotes: Quote[];
  whyThisScore: string;
}

export interface InspectionData {
  id: string;
  propertyName: string;
  providerName: string;
  date: string;
  residentsInterviewed: number;
  totalResidents: number;
  sections: SectionResponse[];
  overallScore: number;
  overallVerdict: 'good' | 'requires-improvement' | 'inadequate';
  assessmentSummary: string;
  actions: Action[];
}

export interface Action {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  deadline: string;
}

// Helper to determine status from score
export function getStatusFromScore(score: number): SectionResponse['status'] {
  if (score >= 7) return 'meeting-standard';
  if (score >= 5) return 'improvement-needed';
  return 'inadequate';
}

// Helper to determine overall verdict
export function getVerdictFromScore(score: number): InspectionData['overallVerdict'] {
  if (score >= 7) return 'good';
  if (score >= 5) return 'requires-improvement';
  return 'inadequate';
}
