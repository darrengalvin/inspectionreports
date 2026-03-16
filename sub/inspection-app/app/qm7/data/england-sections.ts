import { AuditSection } from '../types/audit';

export const englandSections: AuditSection[] = [
  {
    id: 'person-centred-care',
    title: 'PERSON-CENTRED CARE & CHOICE',
    icon: '👤',
    countryPrefix: 'England',
    maxScore: 20,
    wordCountMin: 335,
    wordCountMax: 350,
    questions: [
      { id: 'q1', number: 1, text: 'Care plans are personalised, up-to-date and reflect individual needs under CQC Regulation 9?' },
      { id: 'q2', number: 2, text: 'People are actively involved in planning and reviewing their own care?' },
      { id: 'q3', number: 3, text: 'Care planning addresses protected characteristics under the Equality Act 2010?' },
      { id: 'q4', number: 4, text: 'Plans contain SMART outcomes meaningful to the individual?' },
      { id: 'q5', number: 5, text: 'Daily routines, preferences and lifestyle choices are clearly recorded?' },
      { id: 'q6', number: 6, text: 'Risk assessments follow the CQC Safe KLOE and are regularly reviewed?' },
      { id: 'q7', number: 7, text: 'The service promotes choice and independence in daily activities (CQC Responsive KLOE)?' },
      { id: 'q8', number: 8, text: 'Mental Capacity Act 2005 principles are applied to support decision-making?' },
      { id: 'q9', number: 9, text: 'Best interest decisions are documented with appropriate stakeholders involved?' },
      { id: 'q10', number: 10, text: 'Communication passports or profiles address individual communication needs?' },
      { id: 'q11', number: 11, text: 'People have choice over who provides their care and support?' },
      { id: 'q12', number: 12, text: 'Activities are person-centred and promote social inclusion (CQC Responsive KLOE)?' },
      { id: 'q13', number: 13, text: 'Care plans include personal goals, aspirations and things that matter most?' },
      { id: 'q14', number: 14, text: 'Strengths-based approaches are evident in care planning?' },
      { id: 'q15', number: 15, text: 'Advance care planning and anticipatory care needs are documented?' },
      { id: 'q16', number: 16, text: 'Care plan reviews occur at least monthly or when needs change?' },
      { id: 'q17', number: 17, text: 'People are given information about their rights under the Care Act 2014?' },
      { id: 'q18', number: 18, text: 'Consent to care is obtained and recorded in line with Regulation 11?' },
      { id: 'q19', number: 19, text: 'Reasonable adjustments are made for sensory or physical impairments?' },
      { id: 'q20', number: 20, text: 'Complaints and feedback are used to improve person-centred care delivery?' }
    ]
  },
  {
    id: 'dignity-respect-rights',
    title: 'DIGNITY, RESPECT & RIGHTS',
    icon: '🤝',
    countryPrefix: 'England',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q21', number: 21, text: 'Staff consistently use people\'s preferred names and forms of address?' },
      { id: 'q22', number: 22, text: 'Staff interactions demonstrate warmth, respect and compassion (CQC Caring KLOE)?' },
      { id: 'q23', number: 23, text: 'Privacy is maintained during personal care in line with Regulation 10?' },
      { id: 'q24', number: 24, text: 'People\'s personal space and belongings are respected and secure?' },
      { id: 'q25', number: 25, text: 'Access to independent advocacy is facilitated under the Care Act 2014?' },
      { id: 'q26', number: 26, text: 'People\'s rights regarding relationships and sexuality are respected?' },
      { id: 'q27', number: 27, text: 'No evidence of discriminatory language, attitudes or practice?' },
      { id: 'q28', number: 28, text: 'Dignity is upheld in all aspects of personal care (Regulation 10)?' },
      { id: 'q29', number: 29, text: 'Cultural, religious and spiritual needs are identified and supported?' },
      { id: 'q30', number: 30, text: 'Financial safeguarding arrangements comply with CQC fundamental standards?' },
      { id: 'q31', number: 31, text: 'Gender identity and expression are respected without discrimination?' },
      { id: 'q32', number: 32, text: 'Information is provided in accessible formats meeting the Accessible Information Standard?' },
      { id: 'q33', number: 33, text: 'People are supported to access community resources and maintain social connections?' },
      { id: 'q34', number: 34, text: 'Staff challenge poor practice and uphold people\'s rights (duty of candour)?' },
      { id: 'q35', number: 35, text: 'Family and carer involvement is encouraged with the person\'s consent?' }
    ]
  },
  {
    id: 'professionalism-staff-practice',
    title: 'PROFESSIONALISM & STAFF PRACTICE',
    icon: '📋',
    countryPrefix: 'England',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q36', number: 36, text: 'Staff present professionally with visible ID badges as per CQC expectations?' },
      { id: 'q37', number: 37, text: 'Staff maintain professional boundaries and confidentiality (GDPR/Data Protection Act 2018)?' },
      { id: 'q38', number: 38, text: 'Shift handovers are structured with clear communication of risks and updates?' },
      { id: 'q39', number: 39, text: 'Care records are completed contemporaneously and accurately (Regulation 17)?' },
      { id: 'q40', number: 40, text: 'Staff demonstrate knowledge of the provider\'s policies and CQC fundamental standards?' },
      { id: 'q41', number: 41, text: 'Staff communicate respectfully using person-first language?' },
      { id: 'q42', number: 42, text: 'Feedback from people using the service about staff is consistently positive?' },
      { id: 'q43', number: 43, text: 'Supervisions occur at least every 6-8 weeks and are documented (Regulation 18)?' },
      { id: 'q44', number: 44, text: 'Annual appraisals include professional development planning?' },
      { id: 'q45', number: 45, text: 'Staff attendance and sickness patterns are monitored and managed?' },
      { id: 'q46', number: 46, text: 'Conduct and capability issues are addressed through the disciplinary framework?' },
      { id: 'q47', number: 47, text: 'Staff understand safeguarding procedures and reporting to the local authority?' },
      { id: 'q48', number: 48, text: 'Staff work effectively with multi-disciplinary teams and external agencies?' },
      { id: 'q49', number: 49, text: 'Handovers include person-centred updates on wellbeing and risk?' },
      { id: 'q50', number: 50, text: 'Job descriptions and role expectations meet CQC Regulation 19 (fit and proper persons)?' }
    ]
  },
  {
    id: 'staff-knowledge',
    title: 'STAFF KNOWLEDGE ON INDIVIDUALS SUPPORTED',
    icon: '🧠',
    countryPrefix: 'England',
    maxScore: 10,
    wordCountMin: 260,
    wordCountMax: 275,
    questions: [
      { id: 'q51', number: 51, text: 'Staff can clearly describe each person\'s preferences, likes and dislikes?' },
      { id: 'q52', number: 52, text: 'Staff understand and use each person\'s preferred communication methods?' },
      { id: 'q53', number: 53, text: 'Staff know individual triggers and de-escalation strategies?' },
      { id: 'q54', number: 54, text: 'Staff can articulate the personal goals and outcomes for each person?' },
      { id: 'q55', number: 55, text: 'Staff can quickly access key information including care plans and risk assessments?' },
      { id: 'q56', number: 56, text: 'Staff have detailed knowledge of health conditions and associated care needs?' },
      { id: 'q57', number: 57, text: 'Staff recognise early warning signs of deterioration and know the escalation pathway?' },
      { id: 'q58', number: 58, text: 'Staff know each person\'s preferences regarding family and social contact?' },
      { id: 'q59', number: 59, text: 'Staff communicate effectively with GPs, pharmacists and other professionals?' },
      { id: 'q60', number: 60, text: 'New staff complete the Care Certificate and a person-specific induction?' }
    ]
  },
  {
    id: 'positive-behaviour-support',
    title: 'POSITIVE BEHAVIOUR SUPPORT (PBS)',
    icon: '💚',
    countryPrefix: 'England',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 315,
    questions: [
      { id: 'q61', number: 61, text: 'PBS plans are in place for all individuals who require them?' },
      { id: 'q62', number: 62, text: 'PBS plans are co-produced with the person, their family and professionals?' },
      { id: 'q63', number: 63, text: 'PBS plans identify setting conditions, triggers and early warning signs?' },
      { id: 'q64', number: 64, text: 'Least restrictive interventions are prioritised (Regulation 13, Mental Capacity Act)?' },
      { id: 'q65', number: 65, text: 'PBS plans are reviewed using functional analysis and outcome data?' },
      { id: 'q66', number: 66, text: 'Staff are trained in PBS approaches by BILD-accredited or equivalent trainers?' },
      { id: 'q67', number: 67, text: 'Staff demonstrate competence in proactive and reactive strategies?' },
      { id: 'q68', number: 68, text: 'Any restrictive practice is authorised, recorded and reported to CQC (Regulation 13)?' },
      { id: 'q69', number: 69, text: 'ABC charts and behaviour data are analysed to inform care planning?' },
      { id: 'q70', number: 70, text: 'PBS implementation is consistent across all staff and shifts?' }
    ]
  },
  {
    id: 'medication-management',
    title: 'MEDICATION MANAGEMENT',
    icon: '💊',
    countryPrefix: 'England',
    maxScore: 10,
    wordCountMin: 280,
    wordCountMax: 310,
    questions: [
      { id: 'q71', number: 71, text: 'Medication management complies with NICE guidelines and CQC Regulation 12?' },
      { id: 'q72', number: 72, text: 'Medicines are stored securely with temperature monitoring (including controlled drugs)?' },
      { id: 'q73', number: 73, text: 'MAR charts are completed accurately with no gaps or unexplained omissions?' },
      { id: 'q74', number: 74, text: 'PRN protocols include clear guidance on indication, dose and review?' },
      { id: 'q75', number: 75, text: 'Medication reviews with GP or pharmacist occur at least annually?' },
      { id: 'q76', number: 76, text: 'Staff administering medication are trained and competency-assessed regularly?' },
      { id: 'q77', number: 77, text: 'Medication errors and near misses are reported, investigated and learned from?' },
      { id: 'q78', number: 78, text: 'Consent for medication is recorded, including capacity assessments where needed?' },
      { id: 'q79', number: 79, text: 'Allergies and adverse reactions are clearly documented and communicated?' },
      { id: 'q80', number: 80, text: 'STOMP principles are applied to reduce over-medication of psychotropic drugs?' }
    ]
  },
  {
    id: 'staff-training-compliance',
    title: 'STAFF TRAINING & COMPLIANCE',
    icon: '🎓',
    countryPrefix: 'England',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q81', number: 81, text: 'Mandatory training completion rates meet the 95% target?' },
      { id: 'q82', number: 82, text: 'A training matrix is maintained and monitored centrally?' },
      { id: 'q83', number: 83, text: 'Safeguarding adults training meets local authority requirements?' },
      { id: 'q84', number: 84, text: 'Equality, diversity and human rights training is completed by all staff?' },
      { id: 'q85', number: 85, text: 'Communication and person-centred care training is provided?' },
      { id: 'q86', number: 86, text: 'Condition-specific training covers health needs of people supported?' },
      { id: 'q87', number: 87, text: 'PBS and restrictive practice reduction training compliance is tracked?' },
      { id: 'q88', number: 88, text: 'First aid, fire safety and basic life support training is current?' },
      { id: 'q89', number: 89, text: 'Refresher and update training is scheduled proactively before expiry?' },
      { id: 'q90', number: 90, text: 'Training impact is evaluated through supervision, observation and competency checks?' }
    ]
  },
  {
    id: 'leadership-governance',
    title: 'LEADERSHIP, GOVERNANCE & QUALITY ASSURANCE',
    icon: '🏛️',
    countryPrefix: 'England',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q91', number: 91, text: 'A robust governance framework is in place and understood by all staff (CQC Well-Led KLOE)?' },
      { id: 'q92', number: 92, text: 'The registered manager is visible, accessible and provides effective leadership?' },
      { id: 'q93', number: 93, text: 'Internal quality audits are conducted regularly (monthly/quarterly) per Regulation 17?' },
      { id: 'q94', number: 94, text: 'Audit findings generate action plans that are completed and evidenced?' },
      { id: 'q95', number: 95, text: 'Incidents and safeguarding concerns are reported, analysed and statutory notifications submitted to CQC?' },
      { id: 'q96', number: 96, text: 'Complaints are managed in line with Regulation 16 with documented outcomes and learning?' },
      { id: 'q97', number: 97, text: 'CQC registration conditions and inspection recommendations are met and maintained?' },
      { id: 'q98', number: 98, text: 'Multi-agency partnership working is evidenced (local authority, health, commissioners)?' },
      { id: 'q99', number: 99, text: 'Staff recruitment, retention and wellbeing data is monitored and acted upon?' },
      { id: 'q100', number: 100, text: 'A continuous improvement plan is in place with measurable objectives and progress tracking?' }
    ]
  }
];

export default englandSections;
