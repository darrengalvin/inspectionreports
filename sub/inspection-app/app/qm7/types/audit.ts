// QM7 Quality Management Audit Types

export type Country = 'england' | 'wales' | 'scotland' | 'northern-ireland';

export type ServiceType = 
  | 'prep4life' 
  | 'training-craft-audit' 
  | 'supported-living' 
  | 'day-service';

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface AuditSetupData {
  auditNumber: string;          // e.g., "S-107" for Scotland
  serviceType: ServiceType | null;
  country: Country | null;
  serviceName: string;
  keyContact1: Contact;
  keyContact2: Contact;
}

export interface VisitDetails {
  dateOfVisit: string;
  timeOfVisit: string;
  greeterName: string;
  idChecked: boolean | null;
  clientsInService: number;
  staffOnShift: number;
  hasOtherVisitors: boolean | null;
  visitorNames: string[];       // up to 3
  clientFocus1: string;
  clientFocus2: string;
}

export interface AuditQuestion {
  id: string;
  number: number;
  text: string;
}

export interface AuditSection {
  id: string;
  title: string;
  countryPrefix: string;        // e.g., "Scotland" for display
  maxScore: number;
  questions: AuditQuestion[];
  wordCountMin: number;
  wordCountMax: number;
}

export interface QuestionAnswer {
  questionId: string;
  answer: boolean | null;       // true = Yes (1 point), false = No (0 points), null = unanswered
}

export interface SectionData {
  sectionId: string;
  answers: QuestionAnswer[];
  score: number;
  narrative: string;
  isSaved: boolean;
  isNarrativeSaved: boolean;
}

export interface AuditState {
  setup: AuditSetupData;
  visitDetails: VisitDetails;
  sections: Map<string, SectionData>;
  currentStep: 'setup' | 'visit-details' | 'audit' | 'report';
  currentSectionIndex: number;
}

// Country prefixes for audit numbers
export const COUNTRY_PREFIXES: Record<Country, string> = {
  'england': 'E',
  'wales': 'W',
  'scotland': 'S',
  'northern-ireland': 'NI'
};

// Service type labels
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  'prep4life': 'Prep4life',
  'training-craft-audit': 'Training Craft Audit – Care training provider\'s audit',
  'supported-living': 'Supported Living Service',
  'day-service': 'Day Service'
};

// Country labels
export const COUNTRY_LABELS: Record<Country, string> = {
  'england': 'England',
  'wales': 'Wales',
  'scotland': 'Scotland',
  'northern-ireland': 'Northern Ireland'
};

// Helper to calculate section score from answers
export function calculateSectionScore(answers: QuestionAnswer[]): number {
  return answers.filter(a => a.answer === true).length;
}

// Helper to get word count from text
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Helper to check if narrative meets word count requirements
export function isNarrativeValid(text: string, minWords: number, maxWords: number): boolean {
  const count = getWordCount(text);
  return count >= minWords && count <= maxWords;
}

// Helper to generate audit number
let auditSequence = 100; // Starting sequence
export function generateAuditNumber(country: Country | null): string {
  if (!country) return '';
  const prefix = COUNTRY_PREFIXES[country];
  auditSequence++;
  return `${prefix}-${auditSequence}`;
}

// Check if service type requires visit details (options 3 & 4)
export function requiresVisitDetails(serviceType: ServiceType | null): boolean {
  return serviceType === 'supported-living' || serviceType === 'day-service';
}
