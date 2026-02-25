import { AuditSection } from '../types/audit';

export const scotlandSections: AuditSection[] = [
  {
    id: 'person-centred-care',
    title: 'PERSON-CENTRED CARE & CHOICE',
    countryPrefix: 'Scotland',
    maxScore: 20,
    wordCountMin: 335,
    wordCountMax: 350,
    questions: [
      { id: 'q1', number: 1, text: 'Personal support plans are up-to-date, individualised and detailed?' },
      { id: 'q2', number: 2, text: 'Service users have contributed to their own support plans?' },
      { id: 'q3', number: 3, text: 'Support planning reflects cultural, linguistic, and identity needs?' },
      { id: 'q4', number: 4, text: 'Plans contain clear outcomes meaningful to the person?' },
      { id: 'q5', number: 5, text: 'Routine preferences are recorded (sleep, meals, routines)?' },
      { id: 'q6', number: 6, text: 'Risk assessments are personalised and regularly reviewed?' },
      { id: 'q7', number: 7, text: 'Choices around daily activities are facilitated and documented?' },
      { id: 'q8', number: 8, text: 'Individuals are supported to make their own decisions wherever possible?' },
      { id: 'q9', number: 9, text: 'There is clear evidence of best interest decision-making where needed?' },
      { id: 'q10', number: 10, text: 'Alternative communication needs (Makaton, PECS, symbols) are recognised?' },
      { id: 'q11', number: 11, text: 'Service users can choose staff supporting them where practical?' },
      { id: 'q12', number: 12, text: 'Individuals choose their preferred social & community activities?' },
      { id: 'q13', number: 13, text: 'Support plans include aspirations and goals beyond daily care?' },
      { id: 'q14', number: 14, text: 'Plans reflect strengths, not just needs or deficits?' },
      { id: 'q15', number: 15, text: 'Evidence of advance planning (e.g., for changes in health)?' },
      { id: 'q16', number: 16, text: 'There is regular review of preferences (weekly or monthly)?' },
      { id: 'q17', number: 17, text: 'Service users are informed of their rights and responsibilities?' },
      { id: 'q18', number: 18, text: 'Consent to care and support is documented?' },
      { id: 'q19', number: 19, text: 'Plans indicate adjustments for sensory impairments?' },
      { id: 'q20', number: 20, text: 'Complaints and compliments are documented and linked to plans?' }
    ]
  },
  {
    id: 'dignity-respect-rights',
    title: 'DIGNITY, RESPECT & RIGHTS',
    countryPrefix: 'Scotland',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q21', number: 21, text: 'Staff address people using preferred names/title?' },
      { id: 'q22', number: 22, text: 'Interactions show respect, warmth, and inclusivity?' },
      { id: 'q23', number: 23, text: 'Privacy needs (bedrooms, personal care) are maintained?' },
      { id: 'q24', number: 24, text: 'Personal space is respected and personalised?' },
      { id: 'q25', number: 25, text: 'People have access to advocacy services if needed?' },
      { id: 'q26', number: 26, text: 'Supported rights around sexuality/intimacy are honoured?' },
      { id: 'q27', number: 27, text: 'No evidence of discriminatory language or practice?' },
      { id: 'q28', number: 28, text: 'Dignity is maintained during personal care tasks?' },
      { id: 'q29', number: 29, text: 'Cultural/religious practices are supported?' },
      { id: 'q30', number: 30, text: 'Individuals are supported to manage finances safeguarding?' },
      { id: 'q31', number: 31, text: 'Support respects gender identity and expression?' },
      { id: 'q32', number: 32, text: 'Service users receive information in accessible formats?' },
      { id: 'q33', number: 33, text: 'Individuals can independently access community facilities?' },
      { id: 'q34', number: 34, text: 'Staff intervene appropriately to uphold rights?' },
      { id: 'q35', number: 35, text: 'Family involvement is encouraged (if chosen by the person)?' }
    ]
  },
  {
    id: 'professionalism-staff-practice',
    title: 'PROFESSIONALISM & STAFF PRACTICE',
    countryPrefix: 'Scotland',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q36', number: 36, text: 'Staff present professionally (uniform, ID visible, respectful demeanour)?' },
      { id: 'q37', number: 37, text: 'Staff maintain boundaries and confidentiality?' },
      { id: 'q38', number: 38, text: 'Shift handovers are structured and recorded formally?' },
      { id: 'q39', number: 39, text: 'Staff complete documentation accurately and promptly?' },
      { id: 'q40', number: 40, text: 'Staff demonstrate knowledge of organisation policies?' },
      { id: 'q41', number: 41, text: 'Staff use appropriate language (no jargon, respectful)?' },
      { id: 'q42', number: 42, text: 'Feedback from service users about staff conduct is positive?' },
      { id: 'q43', number: 43, text: 'Supervisions are regular, documented and constructive?' },
      { id: 'q44', number: 44, text: 'Appraisals highlight strengths and areas for development?' },
      { id: 'q45', number: 45, text: 'Staff attendance and punctuality are monitored?' },
      { id: 'q46', number: 46, text: 'Professional conduct breaches are escalated?' },
      { id: 'q47', number: 47, text: 'Safeguarding concerns are recognised and reported?' },
      { id: 'q48', number: 48, text: 'Staff work collaboratively with health/social care partners?' },
      { id: 'q49', number: 49, text: 'Handovers include person-centred risk updates?' },
      { id: 'q50', number: 50, text: 'Staff role expectations are clearly understood and shared?' }
    ]
  },
  {
    id: 'staff-knowledge',
    title: 'STAFF KNOWLEDGE ON INDIVIDUALS SUPPORTED',
    countryPrefix: 'Scotland',
    maxScore: 10,
    wordCountMin: 260,
    wordCountMax: 275,
    questions: [
      { id: 'q51', number: 51, text: 'Staff can articulate individuals\' preferences confidently?' },
      { id: 'q52', number: 52, text: 'Staff demonstrate understanding of unique communication styles?' },
      { id: 'q53', number: 53, text: 'Staff knows triggers and supports for emotional regulation?' },
      { id: 'q54', number: 54, text: 'Staff understand each person\'s goals?' },
      { id: 'q55', number: 55, text: 'Staff can locate key personal documents quickly?' },
      { id: 'q56', number: 56, text: 'Staff know key health needs (diabetes, epilepsy, allergies)?' },
      { id: 'q57', number: 57, text: 'Staff recognise early signs of deterioration?' },
      { id: 'q58', number: 58, text: 'Staff know family involvement preferences?' },
      { id: 'q59', number: 59, text: 'Staff communicate effectively with other professionals on individuals\' needs?' },
      { id: 'q60', number: 60, text: 'New staff receive a structured induction on each person?' }
    ]
  },
  {
    id: 'positive-behaviour-support',
    title: 'POSITIVE BEHAVIOUR SUPPORT (PBS)',
    countryPrefix: 'Scotland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 315,
    questions: [
      { id: 'q61', number: 61, text: 'PBS plans exist for individuals who need them?' },
      { id: 'q62', number: 62, text: 'PBS plans are co-produced with people and relevant others?' },
      { id: 'q63', number: 63, text: 'PBS plans identify triggers, baseline behaviours, and proactive strategies?' },
      { id: 'q64', number: 64, text: 'PBS plans detail least restrictive approaches?' },
      { id: 'q65', number: 65, text: 'PBS plans reviewed regularly with data/evidence?' },
      { id: 'q66', number: 66, text: 'Staff receive PBS training?' },
      { id: 'q67', number: 67, text: 'Staff can describe safe de-escalation techniques?' },
      { id: 'q68', number: 68, text: 'Any restrictive practice is documented, justified, and monitored?' },
      { id: 'q69', number: 69, text: 'Behaviour data is collated and informs care decisions?' },
      { id: 'q70', number: 70, text: 'PBS approaches are consistent across shifts?' }
    ]
  },
  {
    id: 'medication-management',
    title: 'MEDICATION MANAGEMENT',
    countryPrefix: 'Scotland',
    maxScore: 10,
    wordCountMin: 280,
    wordCountMax: 310,
    questions: [
      { id: 'q71', number: 71, text: 'Medication policies follow safe administration standards?' },
      { id: 'q72', number: 72, text: 'Storage (locked, temperature monitored) is compliant?' },
      { id: 'q73', number: 73, text: 'MAR charts are fully completed with no omissions?' },
      { id: 'q74', number: 74, text: 'PRN medication guidance is clear and contextual?' },
      { id: 'q75', number: 75, text: 'Medicine reviews happen with GP/pharmacist regularly?' },
      { id: 'q76', number: 76, text: 'Staff administering meds are trained and competency checked?' },
      { id: 'q77', number: 77, text: 'Errors/near misses are logged and analysed?' },
      { id: 'q78', number: 78, text: 'Consent for medication is documented?' },
      { id: 'q79', number: 79, text: 'Allergies and adverse reactions are clearly recorded?' },
      { id: 'q80', number: 80, text: 'As-required medication use is reviewed for effectiveness?' }
    ]
  },
  {
    id: 'staff-training-compliance',
    title: 'STAFF TRAINING & COMPLIANCE',
    countryPrefix: 'Scotland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q81', number: 81, text: 'Mandatory training completion rates ≥ 95%?' },
      { id: 'q82', number: 82, text: 'Training files are current and centrally monitored?' },
      { id: 'q83', number: 83, text: 'Training includes adult support & protection?' },
      { id: 'q84', number: 84, text: 'Training includes equality, diversity, and inclusion?' },
      { id: 'q85', number: 85, text: 'Training on communication needs is provided?' },
      { id: 'q86', number: 86, text: 'Health conditions relevant to people supported are covered?' },
      { id: 'q87', number: 87, text: 'PBS training compliance is monitored?' },
      { id: 'q88', number: 88, text: 'First Aid and emergency training is current?' },
      { id: 'q89', number: 89, text: 'Refresher training is scheduled proactively?' },
      { id: 'q90', number: 90, text: 'Training effectiveness is evaluated in supervision?' }
    ]
  },
  {
    id: 'leadership-governance',
    title: 'LEADERSHIP, GOVERNANCE & QUALITY ASSURANCE',
    countryPrefix: 'Scotland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q91', number: 91, text: 'A governance framework exists and is understood?' },
      { id: 'q92', number: 92, text: 'Leadership roles and responsibilities are clear?' },
      { id: 'q93', number: 93, text: 'Internal Service audits occur regularly (monthly/quarterly)?' },
      { id: 'q94', number: 94, text: 'Actions from audits are followed up and evidenced?' },
      { id: 'q95', number: 95, text: 'Incident reporting is timely and analysed for trends?' },
      { id: 'q96', number: 96, text: 'Complaints are handled with documented outcomes, and compliments are recorded?' },
      { id: 'q97', number: 97, text: 'Regulatory requirements (SCSWIS/Care Inspectorate notices) are current?' },
      { id: 'q98', number: 98, text: 'External Partnership working is evident within the service?' },
      { id: 'q99', number: 99, text: 'Staff retention and turnover data reviewed?' },
      { id: 'q100', number: 100, text: 'Continuous improvement plans are in place and monitored?' }
    ]
  }
];

// Helper to get all sections for a country
export function getSectionsForCountry(country: string): AuditSection[] {
  // Currently only Scotland sections are implemented
  // Other countries can be added here with their specific sections
  switch (country) {
    case 'scotland':
      return scotlandSections;
    // Placeholder for other countries - they would have their own regulatory frameworks
    case 'england':
    case 'wales':
    case 'northern-ireland':
      // For now, return Scotland sections as template
      // In production, each country would have its own sections based on regulations
      return scotlandSections.map(s => ({
        ...s,
        countryPrefix: country === 'england' ? 'England' : 
                       country === 'wales' ? 'Wales' : 'Northern Ireland'
      }));
    default:
      return [];
  }
}

// Calculate total possible score across all sections
export function getTotalMaxScore(sections: AuditSection[]): number {
  return sections.reduce((sum, section) => sum + section.maxScore, 0);
}
