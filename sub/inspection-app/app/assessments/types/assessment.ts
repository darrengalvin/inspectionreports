export type SupportLevel = 'low' | 'medium' | 'high';

export const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  low: 'Low Support',
  medium: 'Medium Support',
  high: 'High Support',
};

export const SUPPORT_LEVEL_DESCRIPTIONS: Record<SupportLevel, string> = {
  low: 'Individual requires minimal support. Largely independent with daily tasks and personal care. Needs prompting or occasional assistance. Suitable for shared housing with staff on-call or visiting support.',
  medium: 'Individual requires regular support throughout the day. Needs assistance with some daily tasks, medication management, and/or community access. Staff presence during waking hours with sleep-in or on-call overnight.',
  high: 'Individual requires intensive, continuous support. May have complex health needs, challenging behaviour, or significant personal care requirements. 1:1 or 2:1 staffing during waking hours, waking night support.',
};

export interface IndividualInfo {
  name: string;
  dateOfBirth: string;
  referralSource: string;
  currentPlacement: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  communicationNeeds: string;
  mobilityNeeds: string;
  personalCareLevel: SupportLevel | null;
  medicationComplexity: SupportLevel | null;
  behaviourSupportLevel: SupportLevel | null;
  mentalHealthNeeds: SupportLevel | null;
  communityAccessLevel: SupportLevel | null;
  socialInteractionLevel: SupportLevel | null;
  nightSupportLevel: SupportLevel | null;
  personalityTraits: string;
  interests: string;
  triggers: string;
  preferences: string;
}

export interface ServiceFacility {
  name: string;
  location: string;
  totalBeds: number;
  currentOccupancy: number;
  specialisms: string[];
  environmentType: 'urban' | 'suburban' | 'rural' | null;
  accessibility: string;
  staffingRatio: string;
  maxSupportLevel: SupportLevel | null;
  hasWakingNight: boolean | null;
  hasSensoryRoom: boolean | null;
  hasCommunityAccess: boolean | null;
  nearPublicTransport: boolean | null;
}

export interface StaffProfile {
  totalStaff: number;
  trainedInPbs: boolean;
  trainedInMedication: boolean;
  trainedInEpilepsy: boolean;
  trainedInAutism: boolean;
  trainedInMentalHealth: boolean;
  trainedInManualHandling: boolean;
  averageExperienceYears: number;
  trainingCompliance: number;
}

export interface CurrentResidentProfile {
  name: string;
  supportLevel: SupportLevel | null;
  keyNeeds: string;
  personalityMatch: 'compatible' | 'neutral' | 'risk' | null;
}

export interface MatchingResult {
  overallPercentage: number;
  supportLevelMatch: number;
  facilityMatch: number;
  staffSkillMatch: number;
  residentCompatibility: number;
  environmentMatch: number;
  calculatedSupportLevel: SupportLevel;
  notes: string[];
  risks: string[];
}

export interface TransitionPlanItem {
  id: string;
  phase: 'pre-move' | 'move-day' | 'settling-in' | 'review';
  task: string;
  responsible: string;
  targetDate: string;
  completed: boolean;
}

export interface TransitionPlan {
  individualName: string;
  serviceName: string;
  plannedMoveDate: string;
  items: TransitionPlanItem[];
}

export interface AssessmentState {
  individual: IndividualInfo;
  facility: ServiceFacility;
  staffProfile: StaffProfile;
  currentResidents: CurrentResidentProfile[];
  matchingResult: MatchingResult | null;
  transitionPlan: TransitionPlan | null;
  currentStep: 'individual' | 'facility' | 'staff' | 'residents' | 'results' | 'transition';
}

export const initialIndividual: IndividualInfo = {
  name: '',
  dateOfBirth: '',
  referralSource: '',
  currentPlacement: '',
  primaryDiagnosis: '',
  secondaryDiagnosis: '',
  communicationNeeds: '',
  mobilityNeeds: '',
  personalCareLevel: null,
  medicationComplexity: null,
  behaviourSupportLevel: null,
  mentalHealthNeeds: null,
  communityAccessLevel: null,
  socialInteractionLevel: null,
  nightSupportLevel: null,
  personalityTraits: '',
  interests: '',
  triggers: '',
  preferences: '',
};

export const initialFacility: ServiceFacility = {
  name: '',
  location: '',
  totalBeds: 0,
  currentOccupancy: 0,
  specialisms: [],
  environmentType: null,
  accessibility: '',
  staffingRatio: '',
  maxSupportLevel: null,
  hasWakingNight: null,
  hasSensoryRoom: null,
  hasCommunityAccess: null,
  nearPublicTransport: null,
};

export const initialStaffProfile: StaffProfile = {
  totalStaff: 0,
  trainedInPbs: false,
  trainedInMedication: false,
  trainedInEpilepsy: false,
  trainedInAutism: false,
  trainedInMentalHealth: false,
  trainedInManualHandling: false,
  averageExperienceYears: 0,
  trainingCompliance: 0,
};

export function calculateSupportLevel(individual: IndividualInfo): SupportLevel {
  const levels: (SupportLevel | null)[] = [
    individual.personalCareLevel,
    individual.medicationComplexity,
    individual.behaviourSupportLevel,
    individual.mentalHealthNeeds,
    individual.communityAccessLevel,
    individual.nightSupportLevel,
  ];

  const scores = levels.filter(Boolean).map(l => l === 'high' ? 3 : l === 'medium' ? 2 : 1);
  if (scores.length === 0) return 'low';

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 2.5) return 'high';
  if (avg >= 1.5) return 'medium';
  return 'low';
}

export function calculateMatch(
  individual: IndividualInfo,
  facility: ServiceFacility,
  staff: StaffProfile,
  residents: CurrentResidentProfile[]
): MatchingResult {
  const calculatedLevel = calculateSupportLevel(individual);
  const notes: string[] = [];
  const risks: string[] = [];

  // Support level match (0-100)
  let supportLevelMatch = 100;
  if (facility.maxSupportLevel) {
    const levelOrder: Record<SupportLevel, number> = { low: 1, medium: 2, high: 3 };
    const facilityLevel = levelOrder[facility.maxSupportLevel];
    const individualLevel = levelOrder[calculatedLevel];
    if (individualLevel > facilityLevel) {
      supportLevelMatch = Math.max(0, 100 - (individualLevel - facilityLevel) * 40);
      risks.push(`Individual requires ${calculatedLevel} support but facility max is ${facility.maxSupportLevel}.`);
    } else {
      notes.push(`Support level is compatible: individual needs ${calculatedLevel}, facility supports up to ${facility.maxSupportLevel}.`);
    }
  }

  // Facility match (0-100)
  let facilityMatch = 50;
  if (facility.totalBeds > 0 && facility.currentOccupancy < facility.totalBeds) {
    facilityMatch += 20;
    notes.push('Bed space available.');
  } else if (facility.totalBeds > 0) {
    facilityMatch -= 30;
    risks.push('No bed spaces currently available.');
  }
  if (calculatedLevel === 'high' && facility.hasWakingNight) facilityMatch += 15;
  if (individual.behaviourSupportLevel === 'high' && facility.hasSensoryRoom) facilityMatch += 15;
  facilityMatch = Math.min(100, Math.max(0, facilityMatch));

  // Staff skill match (0-100)
  let staffSkillMatch = 50;
  if (individual.behaviourSupportLevel === 'high' && staff.trainedInPbs) staffSkillMatch += 15;
  if (individual.medicationComplexity === 'high' && staff.trainedInMedication) staffSkillMatch += 10;
  if (staff.trainedInAutism) staffSkillMatch += 10;
  if (staff.trainingCompliance >= 95) staffSkillMatch += 15;
  else if (staff.trainingCompliance >= 80) staffSkillMatch += 5;
  else risks.push(`Training compliance is ${staff.trainingCompliance}% — below recommended 95%.`);
  staffSkillMatch = Math.min(100, Math.max(0, staffSkillMatch));

  // Resident compatibility (0-100)
  let residentCompatibility = 75;
  const riskResidents = residents.filter(r => r.personalityMatch === 'risk');
  if (riskResidents.length > 0) {
    residentCompatibility -= riskResidents.length * 20;
    risks.push(`Potential compatibility risk with ${riskResidents.length} current resident(s).`);
  }
  const compatibleResidents = residents.filter(r => r.personalityMatch === 'compatible');
  if (compatibleResidents.length > 0) {
    residentCompatibility += compatibleResidents.length * 5;
    notes.push(`Good compatibility indicated with ${compatibleResidents.length} current resident(s).`);
  }
  residentCompatibility = Math.min(100, Math.max(0, residentCompatibility));

  // Environment match (0-100)
  let environmentMatch = 70;
  if (individual.communityAccessLevel === 'high' && facility.hasCommunityAccess) environmentMatch += 15;
  if (facility.nearPublicTransport) environmentMatch += 10;
  environmentMatch = Math.min(100, Math.max(0, environmentMatch));

  const overallPercentage = Math.round(
    (supportLevelMatch * 0.3 +
     facilityMatch * 0.2 +
     staffSkillMatch * 0.2 +
     residentCompatibility * 0.15 +
     environmentMatch * 0.15)
  );

  return {
    overallPercentage,
    supportLevelMatch,
    facilityMatch,
    staffSkillMatch,
    residentCompatibility,
    environmentMatch,
    calculatedSupportLevel: calculatedLevel,
    notes,
    risks,
  };
}

export function generateDefaultTransitionPlan(
  individualName: string,
  serviceName: string,
  moveDate: string
): TransitionPlan {
  const move = new Date(moveDate);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

  return {
    individualName,
    serviceName,
    plannedMoveDate: moveDate,
    items: [
      { id: 'tp-1', phase: 'pre-move', task: 'Initial visit to service for individual and family/advocate', responsible: 'Social Worker', targetDate: fmt(addDays(move, -28)), completed: false },
      { id: 'tp-2', phase: 'pre-move', task: 'Complete risk assessments and support plan drafts', responsible: 'Service Manager', targetDate: fmt(addDays(move, -21)), completed: false },
      { id: 'tp-3', phase: 'pre-move', task: 'Second visit — meet staff team and current residents', responsible: 'Key Worker', targetDate: fmt(addDays(move, -14)), completed: false },
      { id: 'tp-4', phase: 'pre-move', task: 'Trial overnight stay', responsible: 'Service Manager', targetDate: fmt(addDays(move, -7)), completed: false },
      { id: 'tp-5', phase: 'pre-move', task: 'Finalise personalisation of room and environment', responsible: 'Key Worker', targetDate: fmt(addDays(move, -3)), completed: false },
      { id: 'tp-6', phase: 'move-day', task: 'Welcome individual and family — orientation walkthrough', responsible: 'Service Manager', targetDate: moveDate, completed: false },
      { id: 'tp-7', phase: 'move-day', task: 'Set up belongings and personal items in room', responsible: 'Key Worker', targetDate: moveDate, completed: false },
      { id: 'tp-8', phase: 'settling-in', task: '24-hour welfare check', responsible: 'Key Worker', targetDate: fmt(addDays(move, 1)), completed: false },
      { id: 'tp-9', phase: 'settling-in', task: 'Week 1 review with individual', responsible: 'Key Worker', targetDate: fmt(addDays(move, 7)), completed: false },
      { id: 'tp-10', phase: 'settling-in', task: 'Week 2 review with family/advocate', responsible: 'Service Manager', targetDate: fmt(addDays(move, 14)), completed: false },
      { id: 'tp-11', phase: 'review', task: '4-week formal placement review', responsible: 'Social Worker', targetDate: fmt(addDays(move, 28)), completed: false },
      { id: 'tp-12', phase: 'review', task: '12-week comprehensive review and support plan update', responsible: 'Service Manager', targetDate: fmt(addDays(move, 84)), completed: false },
    ],
  };
}
