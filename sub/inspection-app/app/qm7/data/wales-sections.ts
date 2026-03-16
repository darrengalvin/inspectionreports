import { AuditSection } from '../types/audit';

export const walesSections: AuditSection[] = [
  {
    id: 'person-centred-care',
    title: 'PERSON-CENTRED CARE & CHOICE',
    icon: '👤',
    countryPrefix: 'Wales',
    maxScore: 20,
    wordCountMin: 335,
    wordCountMax: 350,
    questions: [
      { id: 'q1', number: 1, text: 'Personal plans meet the requirements of the Regulation and Inspection of Social Care (Wales) Act 2016?' },
      { id: 'q2', number: 2, text: 'Individuals have been actively involved in creating their personal plan (What Matters conversation)?' },
      { id: 'q3', number: 3, text: 'Personal plans reflect the person\'s cultural identity and Welsh language needs (Active Offer)?' },
      { id: 'q4', number: 4, text: 'Personal outcomes are identified and recorded in line with the Social Services and Well-being Act 2014?' },
      { id: 'q5', number: 5, text: 'Daily routines, preferences and lifestyle choices are documented within the personal plan?' },
      { id: 'q6', number: 6, text: 'Risk assessments are proportionate, person-centred and reviewed as required by CIW?' },
      { id: 'q7', number: 7, text: 'Choice and control over daily life is promoted in line with the well-being duty?' },
      { id: 'q8', number: 8, text: 'Mental Capacity Act 2005 principles underpin all decision-making support?' },
      { id: 'q9', number: 9, text: 'Best interest decisions follow the correct process with appropriate representation?' },
      { id: 'q10', number: 10, text: 'Communication needs are assessed and addressed, including Welsh language provision?' },
      { id: 'q11', number: 11, text: 'People have choice over their care and support workers where practicable?' },
      { id: 'q12', number: 12, text: 'Activities support personal well-being outcomes as defined in the 2014 Act?' },
      { id: 'q13', number: 13, text: 'Personal plans include aspirations, goals and what matters to the individual?' },
      { id: 'q14', number: 14, text: 'A strengths-based approach is used throughout the personal plan?' },
      { id: 'q15', number: 15, text: 'Anticipatory care and future planning needs are documented?' },
      { id: 'q16', number: 16, text: 'Personal plans are reviewed at least every three months or when circumstances change?' },
      { id: 'q17', number: 17, text: 'Individuals are informed of their rights under the Social Services and Well-being Act 2014?' },
      { id: 'q18', number: 18, text: 'Consent is obtained, recorded and reviewed in line with CIW requirements?' },
      { id: 'q19', number: 19, text: 'Reasonable adjustments are made for people with sensory or physical impairments?' },
      { id: 'q20', number: 20, text: 'Complaints and representations are used to improve person-centred care?' }
    ]
  },
  {
    id: 'dignity-respect-rights',
    title: 'DIGNITY, RESPECT & RIGHTS',
    icon: '🤝',
    countryPrefix: 'Wales',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q21', number: 21, text: 'Staff address people using their preferred name and language (including Welsh)?' },
      { id: 'q22', number: 22, text: 'Staff interactions reflect the well-being principles of the 2014 Act?' },
      { id: 'q23', number: 23, text: 'Privacy is maintained during all aspects of personal care and support?' },
      { id: 'q24', number: 24, text: 'Personal space is respected and people can personalise their environment?' },
      { id: 'q25', number: 25, text: 'Access to independent professional advocacy is facilitated (Part 10, 2014 Act)?' },
      { id: 'q26', number: 26, text: 'People\'s rights regarding relationships and sexuality are upheld?' },
      { id: 'q27', number: 27, text: 'No evidence of discriminatory language, attitudes or institutional practice?' },
      { id: 'q28', number: 28, text: 'Dignity is maintained at all times in line with CIW standards?' },
      { id: 'q29', number: 29, text: 'Cultural, religious, spiritual and linguistic needs are identified and supported?' },
      { id: 'q30', number: 30, text: 'Financial safeguarding is robust with clear policies and oversight?' },
      { id: 'q31', number: 31, text: 'Gender identity, sexual orientation and expression are respected?' },
      { id: 'q32', number: 32, text: 'Information is available in accessible formats including Welsh language?' },
      { id: 'q33', number: 33, text: 'People are supported to maintain community connections and social participation?' },
      { id: 'q34', number: 34, text: 'Staff challenge poor practice and act as advocates for people\'s rights?' },
      { id: 'q35', number: 35, text: 'Family and carer involvement is encouraged with the person\'s informed consent?' }
    ]
  },
  {
    id: 'professionalism-staff-practice',
    title: 'PROFESSIONALISM & STAFF PRACTICE',
    icon: '📋',
    countryPrefix: 'Wales',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q36', number: 36, text: 'Staff present professionally with visible identification at all times?' },
      { id: 'q37', number: 37, text: 'Staff maintain professional boundaries, confidentiality and GDPR compliance?' },
      { id: 'q38', number: 38, text: 'Shift handovers are structured and ensure continuity of care?' },
      { id: 'q39', number: 39, text: 'Records are accurate, contemporaneous and meet CIW documentation standards?' },
      { id: 'q40', number: 40, text: 'Staff are aware of CIW regulatory requirements and service-specific policies?' },
      { id: 'q41', number: 41, text: 'Staff communicate respectfully using person-centred language?' },
      { id: 'q42', number: 42, text: 'Feedback from individuals about staff practice is positive and acted upon?' },
      { id: 'q43', number: 43, text: 'Staff supervisions are regular and meet Social Care Wales registration requirements?' },
      { id: 'q44', number: 44, text: 'Appraisals link to professional development and Social Care Wales competencies?' },
      { id: 'q45', number: 45, text: 'Staff attendance, sickness and absence are monitored effectively?' },
      { id: 'q46', number: 46, text: 'Professional conduct concerns are escalated through appropriate channels?' },
      { id: 'q47', number: 47, text: 'Staff understand safeguarding duties under the Wales Safeguarding Procedures 2019?' },
      { id: 'q48', number: 48, text: 'Staff work collaboratively with multi-agency partners and commissioners?' },
      { id: 'q49', number: 49, text: 'Handovers include person-centred wellbeing and risk information?' },
      { id: 'q50', number: 50, text: 'Staff are registered with Social Care Wales where required?' }
    ]
  },
  {
    id: 'staff-knowledge',
    title: 'STAFF KNOWLEDGE ON INDIVIDUALS SUPPORTED',
    icon: '🧠',
    countryPrefix: 'Wales',
    maxScore: 10,
    wordCountMin: 260,
    wordCountMax: 275,
    questions: [
      { id: 'q51', number: 51, text: 'Staff can describe each person\'s preferences, routines and what matters to them?' },
      { id: 'q52', number: 52, text: 'Staff understand and respond to each person\'s communication style and needs?' },
      { id: 'q53', number: 53, text: 'Staff know individual triggers and proactive support strategies?' },
      { id: 'q54', number: 54, text: 'Staff can articulate each person\'s personal outcomes and goals?' },
      { id: 'q55', number: 55, text: 'Staff can access personal plans and key information promptly?' },
      { id: 'q56', number: 56, text: 'Staff have knowledge of each person\'s health conditions and care requirements?' },
      { id: 'q57', number: 57, text: 'Staff recognise signs of deterioration and know the appropriate escalation process?' },
      { id: 'q58', number: 58, text: 'Staff understand each person\'s preferences for family and social contact?' },
      { id: 'q59', number: 59, text: 'Staff communicate effectively with health professionals and partner agencies?' },
      { id: 'q60', number: 60, text: 'New staff complete an All Wales Induction Framework and person-specific orientation?' }
    ]
  },
  {
    id: 'positive-behaviour-support',
    title: 'POSITIVE BEHAVIOUR SUPPORT (PBS)',
    icon: '💚',
    countryPrefix: 'Wales',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 315,
    questions: [
      { id: 'q61', number: 61, text: 'PBS plans are in place for individuals who display behaviours that challenge?' },
      { id: 'q62', number: 62, text: 'PBS plans are developed collaboratively with the individual, family and professionals?' },
      { id: 'q63', number: 63, text: 'PBS plans identify function of behaviour, triggers and setting events?' },
      { id: 'q64', number: 64, text: 'Least restrictive practices are used in line with the Reducing Restrictive Practices Framework (Wales)?' },
      { id: 'q65', number: 65, text: 'PBS plans are reviewed regularly using behavioural data and outcome evidence?' },
      { id: 'q66', number: 66, text: 'Staff receive PBS training from recognised providers?' },
      { id: 'q67', number: 67, text: 'Staff demonstrate competence in de-escalation and proactive strategies?' },
      { id: 'q68', number: 68, text: 'Any restrictive practice is documented, authorised and reported to CIW?' },
      { id: 'q69', number: 69, text: 'Behavioural data is collected, analysed and used to inform personal plans?' },
      { id: 'q70', number: 70, text: 'PBS strategies are applied consistently by all staff across shifts?' }
    ]
  },
  {
    id: 'medication-management',
    title: 'MEDICATION MANAGEMENT',
    icon: '💊',
    countryPrefix: 'Wales',
    maxScore: 10,
    wordCountMin: 280,
    wordCountMax: 310,
    questions: [
      { id: 'q71', number: 71, text: 'Medication management follows CIW standards and the All Wales Medication Policy?' },
      { id: 'q72', number: 72, text: 'Medicines are stored securely with appropriate temperature monitoring?' },
      { id: 'q73', number: 73, text: 'MAR charts are completed accurately with no unexplained gaps?' },
      { id: 'q74', number: 74, text: 'PRN protocols are clear and include reason, dose and effectiveness review?' },
      { id: 'q75', number: 75, text: 'Medication reviews with prescribers occur at recommended intervals?' },
      { id: 'q76', number: 76, text: 'Staff administering medication are trained and competency-assessed?' },
      { id: 'q77', number: 77, text: 'Medication errors and near misses are reported, investigated and learned from?' },
      { id: 'q78', number: 78, text: 'Consent for medication is documented with capacity consideration?' },
      { id: 'q79', number: 79, text: 'Allergies and adverse reactions are clearly recorded and communicated?' },
      { id: 'q80', number: 80, text: 'STOMP principles are applied to review psychotropic medication use?' }
    ]
  },
  {
    id: 'staff-training-compliance',
    title: 'STAFF TRAINING & COMPLIANCE',
    icon: '🎓',
    countryPrefix: 'Wales',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q81', number: 81, text: 'Mandatory training completion rates meet the 95% target?' },
      { id: 'q82', number: 82, text: 'A training matrix is maintained centrally and monitored regularly?' },
      { id: 'q83', number: 83, text: 'Safeguarding training aligns with the Wales Safeguarding Procedures 2019?' },
      { id: 'q84', number: 84, text: 'Equality, diversity and Welsh language awareness training is completed?' },
      { id: 'q85', number: 85, text: 'Communication training includes awareness of the Active Offer (Welsh language)?' },
      { id: 'q86', number: 86, text: 'Condition-specific training is provided for the needs of people supported?' },
      { id: 'q87', number: 87, text: 'PBS training compliance is monitored and refreshed?' },
      { id: 'q88', number: 88, text: 'First aid, fire safety and basic life support training is current?' },
      { id: 'q89', number: 89, text: 'Refresher training is planned proactively before certificates expire?' },
      { id: 'q90', number: 90, text: 'Training effectiveness is evaluated through supervision and practice observation?' }
    ]
  },
  {
    id: 'leadership-governance',
    title: 'LEADERSHIP, GOVERNANCE & QUALITY ASSURANCE',
    icon: '🏛️',
    countryPrefix: 'Wales',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q91', number: 91, text: 'A governance framework exists and meets the requirements of RISCA 2016?' },
      { id: 'q92', number: 92, text: 'The responsible individual and person in charge provide effective leadership?' },
      { id: 'q93', number: 93, text: 'Quality of care reviews are completed at least every six months (RISCA Regulation 73)?' },
      { id: 'q94', number: 94, text: 'Action plans from reviews and inspections are completed and evidenced?' },
      { id: 'q95', number: 95, text: 'Incidents and safeguarding events are reported and analysed for trends?' },
      { id: 'q96', number: 96, text: 'Complaints and representations are managed with documented outcomes and learning?' },
      { id: 'q97', number: 97, text: 'CIW registration conditions, notifications and inspection actions are met?' },
      { id: 'q98', number: 98, text: 'Partnership working with health boards, local authorities and commissioners is evidenced?' },
      { id: 'q99', number: 99, text: 'Staff recruitment, retention and well-being data is reviewed and acted upon?' },
      { id: 'q100', number: 100, text: 'An annual improvement plan is produced with measurable outcomes and progress tracking?' }
    ]
  }
];

export default walesSections;
