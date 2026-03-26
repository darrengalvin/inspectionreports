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
  auditNumber: string;
  serviceType: ServiceType | null;
  country: Country | null;
  serviceName: string;
  providerName: string;
  auditorName: string;
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
  visitorNames: string[];
  clientFocus1: string;
  clientFocus2: string;
}

// Care Support Systems
export type CareSupportSystem =
  | 'nourish'
  | 'cura-systems'
  | 'pcs'
  | 'total-care-manager'
  | 'plan-4-care'
  | 'care-beans'
  | 'care-control-systems'
  | 'whzan'
  | 'what-matters-most'
  | 'non-listed-effective'
  | 'none';

export const CARE_SYSTEM_LABELS: Record<CareSupportSystem, string> = {
  'nourish': 'Nourish',
  'cura-systems': 'Cura Systems',
  'pcs': 'PCS – Person Centred Software',
  'total-care-manager': 'Total Care Manager',
  'plan-4-care': 'Plan 4 Care',
  'care-beans': 'Care Beans',
  'care-control-systems': 'Care Control Systems',
  'whzan': 'Whzan',
  'what-matters-most': 'What Matters Most App – Mencap\'s Own',
  'non-listed-effective': 'Non-listed but software is used effectively',
  'none': 'None at all',
};

export const CARE_SYSTEMS_LIST: CareSupportSystem[] = [
  'nourish', 'cura-systems', 'pcs', 'total-care-manager',
  'plan-4-care', 'care-beans', 'care-control-systems', 'whzan',
  'what-matters-most', 'non-listed-effective', 'none',
];

// Observation Audit
export interface ObservationAuditData {
  recentCareNotes: boolean | null;
  redOverdueDates: boolean | null;
  staffSystemSkill: 'excellent' | 'good' | 'adequate' | 'poor' | null;
  notificationCount: string;
  effectiveSystem: boolean | null;
  observationOverview: string;
  hasRecommendations: boolean | null;
  recommendationsText: string;
  careSupportSystem: CareSupportSystem | null;
}

// Accreditations
export type AccreditationStatus = 'yes' | 'no' | 'in-progress' | 'expired' | null;

export interface AccreditationsData {
  cpi: AccreditationStatus;
  bildPbs: AccreditationStatus;
  stomp: AccreditationStatus;
  omg: AccreditationStatus;
  rrn: AccreditationStatus;
  bildObservationNotes: string;
}

export const ACCREDITATION_LABELS: Record<string, string> = {
  'cpi': 'CPI',
  'bildPbs': 'BILD PBS',
  'stomp': 'STOMP',
  'omg': 'OMG',
  'rrn': 'RRN',
};

export const ACCREDITATION_STATUS_LABELS: Record<string, string> = {
  'yes': 'Accredited',
  'no': 'Not Accredited',
  'in-progress': 'In Progress',
  'expired': 'Expired',
};

// Action Plan (generated when below pass threshold)
export interface ActionPlanItem {
  id: string;
  area: string;
  finding: string;
  action: string;
  responsible: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ActionPlan {
  items: ActionPlanItem[];
  generatedAt: string;
  followUpDate: string;
  overallRecommendation: string;
}

// Certificate / Endorsement
export interface AuditEndorsement {
  referenceNumber: string;
  passed: boolean;
  percentage: number;
  serviceName: string;
  dateIssued: string;
  endorsedBy: string;
}

export const PASS_THRESHOLD = 70;

export interface AuditQuestion {
  id: string;
  number: number;
  text: string;
}

export interface AuditSection {
  id: string;
  title: string;
  icon: string;
  countryPrefix: string;
  maxScore: number;
  questions: AuditQuestion[];
  wordCountMin: number;
  wordCountMax: number;
}

export interface QuestionAnswer {
  questionId: string;
  answer: boolean | null;
}

export interface SectionData {
  sectionId: string;
  answers: QuestionAnswer[];
  score: number;
  narrative: string;
  isSaved: boolean;
  isNarrativeSaved: boolean;
}

export type AuditStep = 'setup' | 'visit-details' | 'care-systems' | 'accreditations' | 'audit' | 'report';

export interface AuditState {
  setup: AuditSetupData;
  visitDetails: VisitDetails;
  observationAudit: ObservationAuditData;
  accreditations: AccreditationsData;
  sections: Map<string, SectionData>;
  currentStep: AuditStep;
  currentSectionIndex: number;
  actionPlan: ActionPlan | null;
  endorsement: AuditEndorsement | null;
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

// Section icons (SVG path data keyed by section id)
export const SECTION_ICONS: Record<string, string> = {
  'person-centred-care': '👤',
  'dignity-respect-rights': '🤝',
  'professionalism-staff-practice': '📋',
  'staff-knowledge': '🧠',
  'positive-behaviour-support': '💚',
  'medication-management': '💊',
  'staff-training-compliance': '🎓',
  'leadership-governance': '🏛️',
};

export function calculateSectionScore(answers: QuestionAnswer[]): number {
  return answers.filter(a => a.answer === true).length;
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function isNarrativeValid(text: string, minWords: number, maxWords: number): boolean {
  const count = getWordCount(text);
  return count >= minWords && count <= maxWords;
}

let auditSequence = 100;
export function generateAuditNumber(country: Country | null): string {
  if (!country) return '';
  const prefix = COUNTRY_PREFIXES[country];
  auditSequence++;
  return `${prefix}-${auditSequence}`;
}

export function requiresVisitDetails(serviceType: ServiceType | null): boolean {
  return serviceType === 'supported-living' || serviceType === 'day-service';
}

export function generateEndorsementRef(auditNumber: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `QM7-${auditNumber}-${timestamp}`;
}

export function isPassing(percentage: number): boolean {
  return percentage >= PASS_THRESHOLD;
}

export const initialObservationAudit: ObservationAuditData = {
  recentCareNotes: null,
  redOverdueDates: null,
  staffSystemSkill: null,
  notificationCount: '',
  effectiveSystem: null,
  observationOverview: '',
  hasRecommendations: null,
  recommendationsText: '',
  careSupportSystem: null,
};

export const initialAccreditations: AccreditationsData = {
  cpi: null,
  bildPbs: null,
  stomp: null,
  omg: null,
  rrn: null,
  bildObservationNotes: '',
};
