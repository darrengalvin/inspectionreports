import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

const SECTION_NAMES = [
  'Person-Centred Planning',
  'Safeguarding & Protection',
  'Medication Management',
  'Health & Wellbeing',
  'Staff Training & Compliance',
  'Communication & Engagement',
  'Environment & Safety',
  'Governance & Leadership',
];

function makeSectionSummaries(percentage: number) {
  return SECTION_NAMES.map((name, i) => {
    const base = percentage / 100;
    const score = Math.max(3, Math.min(13, Math.round((base + (i % 2 === 0 ? 0.05 : -0.08)) * 13)));
    return {
      sectionId: name.toLowerCase().replace(/[^a-z]+/g, '-'),
      title: name,
      score,
      maxScore: 13,
      percentage: Math.round((score / 13) * 100),
      narrative: `During the audit of ${name.toLowerCase()}, the service demonstrated ${score >= 10 ? 'excellent' : score >= 8 ? 'good' : score >= 6 ? 'adequate' : 'poor'} practice. Staff were observed engaging with individuals in a ${score >= 8 ? 'person-centred and respectful' : 'broadly appropriate'} manner. Documentation reviewed ${score >= 8 ? 'was thorough and up to date' : 'had some gaps that require attention'}. ${score < 8 ? 'Improvements are recommended in this area as detailed in the action plan.' : 'This area is a strength of the service.'}`,
    };
  });
}

function makeActionPlan(percentage: number) {
  if (percentage >= 70) return [];
  const items = [
    { area: 'Staff Training', action: 'Ensure all staff complete mandatory training modules within 4 weeks', priority: 'high', deadline: daysAgo(-30).split('T')[0], completed: false },
    { area: 'Medication', action: 'Implement double-signing for controlled medications and update MAR sheets', priority: 'high', deadline: daysAgo(-14).split('T')[0], completed: false },
    { area: 'Care Plans', action: 'Review and update all care plans to include person-centred goals', priority: 'medium', deadline: daysAgo(-45).split('T')[0], completed: false },
    { area: 'Environment', action: 'Address maintenance issues identified during the walkthrough', priority: 'medium', deadline: daysAgo(-21).split('T')[0], completed: false },
    { area: 'Governance', action: 'Establish monthly quality monitoring meetings with documented minutes', priority: 'low', deadline: daysAgo(-60).split('T')[0], completed: false },
    { area: 'Safeguarding', action: 'Ensure safeguarding policy is updated and all staff are re-trained', priority: 'high', deadline: daysAgo(-14).split('T')[0], completed: false },
  ];
  return items.slice(0, percentage < 50 ? 6 : 4);
}

function makeInspectionReport(propertyName: string, providerName: string, score: number) {
  const sections = [
    'Physical Environment', 'Safety & Security', 'Cleanliness & Hygiene',
    'Communal Spaces', 'Bedrooms & Personal Space', 'Kitchen & Dining',
    'Bathroom Facilities', 'Garden & Outdoor Areas', 'Accessibility',
    'Maintenance & Repairs', 'Fire Safety', 'Staff Interactions',
    'Resident Wellbeing', 'Activities & Engagement', 'Documentation',
  ];
  return {
    id: `QA-2026-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    propertyName,
    providerName,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    residentsInterviewed: 8,
    totalResidents: 12,
    overallScore: score,
    overallVerdict: score >= 7 ? 'Good' : score >= 5 ? 'Requires Improvement' : 'Inadequate',
    inspector: { name: 'Dave Sherwood', role: 'Lead Quality Inspector' },
    sections: sections.map((title, i) => {
      const sectionScore = Math.max(2, Math.min(10, Math.round(score + (i % 3 === 0 ? 1 : -0.5))));
      return {
        sectionId: title.toLowerCase().replace(/[^a-z]+/g, '-'),
        title,
        score: sectionScore,
        responses: [
          { questionId: `q${i}-1`, finding: `${title} was assessed during the visit. ${sectionScore >= 7 ? 'Standards were met with good practice observed.' : 'Some areas require improvement as noted.'}` },
          { questionId: `q${i}-2`, finding: `Staff demonstrated ${sectionScore >= 7 ? 'good' : 'basic'} knowledge of requirements in this area.` },
        ],
        quotes: i < 3 ? [{
          text: sectionScore >= 7 ? 'I really like living here, the staff are brilliant.' : 'It\'s okay here but some things could be better.',
          residentId: `Resident ${String.fromCharCode(65 + i)}`,
          sentiment: sectionScore >= 7 ? 'positive' : 'neutral',
        }] : [],
        whyThisScore: `Score of ${sectionScore}/10 reflects ${sectionScore >= 7 ? 'good overall compliance with strong evidence of person-centred practice' : 'basic compliance with notable gaps that need addressing'}. ${sectionScore < 7 ? 'Key improvements are documented in the action plan.' : ''}`,
      };
    }),
    actions: score < 7 ? [
      { id: 'a1', priority: 'high', title: 'Fire safety improvements', description: 'Update fire risk assessment and ensure all emergency lighting is functional.', deadline: daysAgo(-30).split('T')[0] },
      { id: 'a2', priority: 'medium', title: 'Bathroom refurbishment', description: 'Address mould issues in shared bathrooms and replace damaged tiles.', deadline: daysAgo(-45).split('T')[0] },
      { id: 'a3', priority: 'medium', title: 'Activity programme', description: 'Develop a more structured weekly activity programme with resident input.', deadline: daysAgo(-30).split('T')[0] },
    ] : [],
    followUpDate: score < 7 ? daysAgo(-90).split('T')[0] : undefined,
  };
}

function makeAssessmentData(individualName: string, facilityName: string, percentage: number, supportLevel: string) {
  return {
    individual: {
      name: individualName,
      dateOfBirth: '1998-03-15',
      referralSource: 'NHS Community Learning Disability Team',
      currentPlacement: 'Residential school (transitioning)',
      primaryDiagnosis: supportLevel === 'high' ? 'Autism Spectrum Disorder' : supportLevel === 'medium' ? 'Learning Disability' : 'Mild Learning Disability',
      secondaryDiagnosis: supportLevel === 'high' ? 'ADHD' : '',
      communicationNeeds: supportLevel === 'high' ? 'Verbal with Makaton support. Uses visual timetables and social stories.' : 'Verbal communication. Benefits from clear, simple instructions.',
      mobilityNeeds: 'Fully mobile',
      personalCareLevel: supportLevel,
      behaviourSupportLevel: supportLevel,
      mentalHealthNeeds: supportLevel === 'high' ? 'medium' : 'low',
      communityAccessLevel: 'medium',
      personalityTraits: `${individualName} is ${supportLevel === 'low' ? 'outgoing and sociable' : 'warm but prefers familiar company'}. Enjoys routine and predictability.`,
      interests: 'Music, cooking, outdoor walks, gaming',
      triggers: supportLevel === 'high' ? 'Sudden routine changes, loud noises, crowded spaces' : 'Unstructured time',
      preferences: 'Quiet room, structured mealtimes, access to garden',
    },
    facility: {
      name: facilityName,
      location: 'Manchester',
      totalBeds: 6,
      currentOccupancy: 4,
      maxSupportLevel: 'high',
      specialisms: ['Learning Disabilities', 'Autism Spectrum', 'Challenging Behaviour'],
      hasSensoryRoom: true,
      hasCommunityAccess: true,
      nearPublicTransport: true,
    },
    matchingResult: {
      overallPercentage: percentage,
      calculatedSupportLevel: supportLevel,
      supportLevelMatch: percentage >= 80 ? 100 : 60,
      facilityMatch: Math.min(100, percentage + 5),
      staffSkillMatch: Math.min(100, percentage + 10),
      residentCompatibility: Math.max(40, percentage - 10),
      environmentMatch: Math.min(100, percentage + 8),
      notes: [
        `${individualName} has been assessed as requiring ${supportLevel} support.`,
        `${facilityName} can accommodate up to high support level.`,
        percentage >= 70 ? 'Overall compatibility is good.' : 'Some concerns about compatibility — see risk notes.',
      ],
      risks: percentage < 70 ? [
        'Resident compatibility may be challenging given current mix of individuals.',
        'Additional training may be needed for staff to meet specific needs.',
      ] : [],
    },
    transitionPlan: {
      phases: [
        { name: 'Pre-Move', items: ['Initial visit to facility', 'Meet key worker', 'Trial overnight stays (x3)', 'Finalise transition date'], startDate: daysAgo(-60).split('T')[0] },
        { name: 'Move Day', items: ['Familiar items packed', 'Key worker welcome', 'Settling-in protocol', 'Family/carer visit scheduled'], startDate: daysAgo(-30).split('T')[0] },
        { name: 'Settling In', items: ['Daily wellbeing checks', 'Activity schedule introduced', 'PBS plan activated', 'Communication passport shared'], startDate: daysAgo(-14).split('T')[0] },
        { name: 'Review', items: ['2-week review meeting', '6-week formal review', 'Placement confirmation', 'Care plan updated'], startDate: daysAgo(0).split('T')[0] },
      ],
    },
  };
}

const DEMO_ENQUIRIES = [
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@oakridgecare.co.uk',
    phone: '07712 345678',
    organisation: 'Oakridge Care Services',
    service: 'qm7-audit',
    country: 'england',
    message: 'We are a supported living provider in Manchester supporting 24 individuals with learning disabilities. We would like to arrange a QM7 quality audit ahead of our CQC inspection in September. Can you advise on availability and costs?',
    submitted_at: daysAgo(2),
    read: false,
  },
  {
    name: 'James Walker',
    email: 'j.walker@willowhouse.org.uk',
    phone: '07891 234567',
    organisation: 'Willow House Residential',
    service: 'housing-inspection',
    country: 'wales',
    message: 'Our registered manager would like to arrange a full housing inspection of our 3 properties in Cardiff before the CIW visit. Looking for dates in March/April.',
    submitted_at: daysAgo(5),
    read: true,
  },
  {
    name: 'Emma Richardson',
    email: 'emma.r@brightfutures.org',
    phone: '07654 321098',
    organisation: 'Bright Futures Support Ltd',
    service: 'placement-assessment',
    country: 'england',
    message: 'We have a new referral for a young adult with complex needs (ASD + ADHD) transitioning from residential school. Need a placement assessment for our Coventry service. Individual has high behaviour support needs.',
    submitted_at: daysAgo(8),
    read: false,
  },
  {
    name: 'Robert Dunne',
    email: 'rdunne@pinnaclecare.co.uk',
    phone: '07998 776655',
    organisation: 'Pinnacle Care Group',
    service: 're-audit',
    country: 'scotland',
    message: 'Following our QM7 audit last month (ref SC-112) we scored 62% and received an action plan. We have addressed all 6 action items and would like to arrange the follow-up re-audit.',
    submitted_at: daysAgo(1),
    read: false,
  },
];

const DEMO_AUDITS = [
  {
    audit_number: 'EN-101',
    service_name: 'Sunrise Supported Living',
    country: 'england',
    percentage: 84,
    date_completed: daysAgo(14),
    passed: true,
    audit_data: {
      setup: { serviceName: 'Sunrise Supported Living', serviceType: 'supported-living', country: 'england', keyContact1: { name: 'Karen Phillips', email: 'karen@sunrisesl.co.uk', phone: '07712 345678' } },
      visitDetails: { dateOfVisit: daysAgo(14).split('T')[0], greeterName: 'Karen Phillips', clientsInService: 8, staffOnShift: 4 },
      observationAudit: { careSupportSystem: 'nourish', recentCareNotes: true, redOverdueDates: false, staffSystemSkill: 'good', notificationCount: '6-10', effectiveSystem: true, observationOverview: 'Nourish is used effectively throughout the service. Staff demonstrated good proficiency navigating the system and records were up to date with detailed daily entries.' },
      accreditations: { cpi: 'yes', bildPbs: 'in-progress', stomp: 'yes', omg: 'no', rrn: 'yes' },
      sectionSummaries: makeSectionSummaries(84),
    },
  },
  {
    audit_number: 'SC-112',
    service_name: 'Highland Care Partnership',
    country: 'scotland',
    percentage: 62,
    date_completed: daysAgo(30),
    passed: false,
    follow_up_date: daysAgo(-60).split('T')[0],
    action_plan_items: makeActionPlan(62),
    audit_data: {
      setup: { serviceName: 'Highland Care Partnership', serviceType: 'supported-living', country: 'scotland', keyContact1: { name: 'Robert Dunne', email: 'rdunne@highlandcare.co.uk', phone: '07998 776655' } },
      visitDetails: { dateOfVisit: daysAgo(30).split('T')[0], greeterName: 'Margaret Burns', clientsInService: 12, staffOnShift: 5 },
      observationAudit: { careSupportSystem: 'care-control-systems', recentCareNotes: false, redOverdueDates: true, staffSystemSkill: 'adequate', notificationCount: '21-50', effectiveSystem: false, observationOverview: 'The care support system had significant overdue items and staff appeared unfamiliar with several modules. A number of care plans were out of date.', hasRecommendations: true, recommendationsText: 'Urgent action needed on overdue care plans and risk assessments. Staff require refresher training on the system. Notification backlog needs clearing.' },
      accreditations: { cpi: 'no', bildPbs: 'no', stomp: 'no', omg: 'no', rrn: 'no' },
      sectionSummaries: makeSectionSummaries(62),
    },
  },
  {
    audit_number: 'WA-105',
    service_name: 'Valleys Community Support',
    country: 'wales',
    percentage: 91,
    date_completed: daysAgo(45),
    passed: true,
    audit_data: {
      setup: { serviceName: 'Valleys Community Support', serviceType: 'supported-living', country: 'wales', keyContact1: { name: 'Rhian Evans', email: 'rhian@valleycs.co.uk', phone: '07654 321098' } },
      visitDetails: { dateOfVisit: daysAgo(45).split('T')[0], greeterName: 'Rhian Evans', clientsInService: 6, staffOnShift: 3 },
      observationAudit: { careSupportSystem: 'pcs', recentCareNotes: true, redOverdueDates: false, staffSystemSkill: 'excellent', notificationCount: '1-5', effectiveSystem: true, observationOverview: 'Excellent use of PCS throughout the service. All records fully up to date. Staff showed outstanding proficiency and the system is embedded into daily practice.' },
      accreditations: { cpi: 'yes', bildPbs: 'yes', stomp: 'yes', omg: 'in-progress', rrn: 'yes' },
      sectionSummaries: makeSectionSummaries(91),
    },
  },
  {
    audit_number: 'EN-108',
    service_name: 'Oakridge Care Services',
    country: 'england',
    percentage: 55,
    date_completed: daysAgo(60),
    passed: false,
    follow_up_date: daysAgo(-30).split('T')[0],
    action_plan_items: makeActionPlan(55),
    audit_data: {
      setup: { serviceName: 'Oakridge Care Services', serviceType: 'supported-living', country: 'england', keyContact1: { name: 'Sarah Mitchell', email: 'sarah@oakridgecare.co.uk', phone: '07712 345678' } },
      visitDetails: { dateOfVisit: daysAgo(60).split('T')[0], greeterName: 'Mark Davies', clientsInService: 24, staffOnShift: 8 },
      observationAudit: { careSupportSystem: 'care-beans', recentCareNotes: false, redOverdueDates: true, staffSystemSkill: 'poor', notificationCount: '50+', effectiveSystem: false, observationOverview: 'Significant concerns with the care system. Over 50 unread notifications, many care plans overdue by weeks. Staff could not demonstrate basic system tasks.', hasRecommendations: true, recommendationsText: 'Urgent system training required for all staff. Consider appointing a digital champion. All overdue records must be updated within 14 days.' },
      accreditations: { cpi: 'expired', bildPbs: 'no', stomp: 'no', omg: 'no', rrn: 'no' },
      sectionSummaries: makeSectionSummaries(55),
    },
  },
  {
    audit_number: 'NI-103',
    service_name: 'Belfast Bridge Housing',
    country: 'northern-ireland',
    percentage: 78,
    date_completed: daysAgo(7),
    passed: true,
    audit_data: {
      setup: { serviceName: 'Belfast Bridge Housing', serviceType: 'supported-living', country: 'northern-ireland', keyContact1: { name: 'Ciara O\'Neill', email: 'ciara@belfastbridge.co.uk', phone: '07555 123456' } },
      visitDetails: { dateOfVisit: daysAgo(7).split('T')[0], greeterName: 'Ciara O\'Neill', clientsInService: 10, staffOnShift: 5 },
      observationAudit: { careSupportSystem: 'total-care-manager', recentCareNotes: true, redOverdueDates: false, staffSystemSkill: 'good', notificationCount: '6-10', effectiveSystem: true, observationOverview: 'Total Care Manager is used consistently. Notes are up to date and staff navigate the system competently. Minor improvement needed in report generation.' },
      accreditations: { cpi: 'yes', bildPbs: 'in-progress', stomp: 'yes', omg: 'no', rrn: 'in-progress' },
      sectionSummaries: makeSectionSummaries(78),
    },
  },
];

const DEMO_ENDORSED = [
  { reference_number: 'DPB-EN-101-QM7', audit_number: 'EN-101', service_name: 'Sunrise Supported Living', percentage: 84, date_issued: daysAgo(14), country: 'england' },
  { reference_number: 'DPB-WA-105-QM7', audit_number: 'WA-105', service_name: 'Valleys Community Support', percentage: 91, date_issued: daysAgo(45), country: 'wales' },
  { reference_number: 'DPB-NI-103-QM7', audit_number: 'NI-103', service_name: 'Belfast Bridge Housing', percentage: 78, date_issued: daysAgo(7), country: 'northern-ireland' },
];

const DEMO_INSPECTIONS = [
  {
    property_name: 'Maple House',
    provider_name: 'Bright Futures Support Ltd',
    overall_score: 7.8,
    date_completed: daysAgo(10),
    report_data: makeInspectionReport('Maple House', 'Bright Futures Support Ltd', 7.8),
  },
  {
    property_name: 'The Willows',
    provider_name: 'Pinnacle Care Group',
    overall_score: 5.2,
    date_completed: daysAgo(21),
    report_data: makeInspectionReport('The Willows', 'Pinnacle Care Group', 5.2),
  },
  {
    property_name: 'Riverside View',
    provider_name: 'Oakridge Care Services',
    overall_score: 8.9,
    date_completed: daysAgo(35),
    report_data: makeInspectionReport('Riverside View', 'Oakridge Care Services', 8.9),
  },
];

const DEMO_ASSESSMENTS = [
  {
    individual_name: 'Michael Thompson',
    facility_name: 'Sunrise Supported Living',
    support_level: 'high',
    overall_percentage: 72,
    date_completed: daysAgo(5),
    has_transition_plan: true,
    assessment_data: makeAssessmentData('Michael Thompson', 'Sunrise Supported Living', 72, 'high'),
  },
  {
    individual_name: 'Lucy Adams',
    facility_name: 'Maple House',
    support_level: 'medium',
    overall_percentage: 88,
    date_completed: daysAgo(12),
    has_transition_plan: true,
    assessment_data: makeAssessmentData('Lucy Adams', 'Maple House', 88, 'medium'),
  },
  {
    individual_name: 'Daniel Fraser',
    facility_name: 'Highland Care Partnership',
    support_level: 'low',
    overall_percentage: 45,
    date_completed: daysAgo(20),
    has_transition_plan: false,
    assessment_data: makeAssessmentData('Daniel Fraser', 'Highland Care Partnership', 45, 'low'),
  },
];

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    const supabase = createServiceClient();

    if (action === 'clear') {
      await Promise.all([
        supabase.from('enquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('audit_history').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('endorsed_services').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('inspections').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);
      return NextResponse.json({ success: true, message: 'All demo data cleared' });
    }

    if (action === 'seed') {
      await Promise.all([
        supabase.from('enquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('audit_history').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('endorsed_services').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('inspections').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);

      const results = await Promise.all([
        supabase.from('enquiries').insert(DEMO_ENQUIRIES),
        supabase.from('audit_history').insert(DEMO_AUDITS),
        supabase.from('endorsed_services').insert(DEMO_ENDORSED),
        supabase.from('inspections').insert(DEMO_INSPECTIONS),
        supabase.from('assessments').insert(DEMO_ASSESSMENTS),
      ]);

      const errors = results.filter(r => r.error).map(r => r.error?.message);
      if (errors.length > 0) {
        return NextResponse.json({ error: errors.join(', ') }, { status: 500 });
      }

      return NextResponse.json({ success: true, counts: { enquiries: DEMO_ENQUIRIES.length, audits: DEMO_AUDITS.length, endorsed: DEMO_ENDORSED.length, inspections: DEMO_INSPECTIONS.length, assessments: DEMO_ASSESSMENTS.length } });
    }

    return NextResponse.json({ error: 'Invalid action. Use "seed" or "clear".' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
