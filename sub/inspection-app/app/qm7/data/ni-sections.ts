import { AuditSection } from '../types/audit';

export const niSections: AuditSection[] = [
  {
    id: 'person-centred-care',
    title: 'PERSON-CENTRED CARE & CHOICE',
    icon: '👤',
    countryPrefix: 'Northern Ireland',
    maxScore: 20,
    wordCountMin: 335,
    wordCountMax: 350,
    questions: [
      { id: 'q1', number: 1, text: 'Care plans are individualised, up-to-date and comply with RQIA quality standards?' },
      { id: 'q2', number: 2, text: 'Service users are actively involved in developing and reviewing their care plans?' },
      { id: 'q3', number: 3, text: 'Care planning addresses the person\'s cultural, religious and identity needs?' },
      { id: 'q4', number: 4, text: 'Personal outcomes are identified, recorded and reviewed regularly?' },
      { id: 'q5', number: 5, text: 'Daily routines, preferences and lifestyle choices are documented and respected?' },
      { id: 'q6', number: 6, text: 'Risk assessments are personalised and reviewed in line with RQIA standards?' },
      { id: 'q7', number: 7, text: 'People are supported to exercise choice and control over their daily lives?' },
      { id: 'q8', number: 8, text: 'Mental Capacity Act (Northern Ireland) 2016 principles are applied to decision-making?' },
      { id: 'q9', number: 9, text: 'Best interest and substitute decision-making follows the statutory framework?' },
      { id: 'q10', number: 10, text: 'Communication needs are assessed and appropriate support provided?' },
      { id: 'q11', number: 11, text: 'People have choice over who provides their care where practicable?' },
      { id: 'q12', number: 12, text: 'Activities promote well-being, inclusion and personal development?' },
      { id: 'q13', number: 13, text: 'Care plans include the person\'s aspirations, goals and what matters most?' },
      { id: 'q14', number: 14, text: 'A strengths-based approach is evident in care planning and delivery?' },
      { id: 'q15', number: 15, text: 'Anticipatory care planning is documented for foreseeable changes in need?' },
      { id: 'q16', number: 16, text: 'Care plans are reviewed at defined intervals or when needs change?' },
      { id: 'q17', number: 17, text: 'People are informed of their rights under DHSSPS care standards?' },
      { id: 'q18', number: 18, text: 'Consent to care and treatment is obtained, recorded and reviewed?' },
      { id: 'q19', number: 19, text: 'Reasonable adjustments are made for sensory, physical or cognitive impairments?' },
      { id: 'q20', number: 20, text: 'Complaints and compliments are used to improve person-centred care delivery?' }
    ]
  },
  {
    id: 'dignity-respect-rights',
    title: 'DIGNITY, RESPECT & RIGHTS',
    icon: '🤝',
    countryPrefix: 'Northern Ireland',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q21', number: 21, text: 'Staff consistently use people\'s preferred names and forms of address?' },
      { id: 'q22', number: 22, text: 'Staff interactions demonstrate warmth, respect and genuine compassion?' },
      { id: 'q23', number: 23, text: 'Privacy is maintained during personal care and private activities?' },
      { id: 'q24', number: 24, text: 'People\'s personal space and belongings are respected and secured?' },
      { id: 'q25', number: 25, text: 'Access to independent advocacy is facilitated when needed?' },
      { id: 'q26', number: 26, text: 'People\'s rights regarding relationships and sexuality are respected and supported?' },
      { id: 'q27', number: 27, text: 'No evidence of discriminatory language, attitudes or institutional practices?' },
      { id: 'q28', number: 28, text: 'Dignity is upheld in all aspects of care and daily living?' },
      { id: 'q29', number: 29, text: 'Cultural, religious and spiritual practices are identified and supported?' },
      { id: 'q30', number: 30, text: 'Financial safeguarding arrangements are robust with clear oversight?' },
      { id: 'q31', number: 31, text: 'Gender identity and expression are respected without discrimination?' },
      { id: 'q32', number: 32, text: 'Information is provided in accessible formats appropriate to the individual?' },
      { id: 'q33', number: 33, text: 'People are supported to maintain community connections and social networks?' },
      { id: 'q34', number: 34, text: 'Staff challenge poor practice and advocate for people\'s rights?' },
      { id: 'q35', number: 35, text: 'Family involvement is encouraged with the person\'s knowledge and consent?' }
    ]
  },
  {
    id: 'professionalism-staff-practice',
    title: 'PROFESSIONALISM & STAFF PRACTICE',
    icon: '📋',
    countryPrefix: 'Northern Ireland',
    maxScore: 15,
    wordCountMin: 300,
    wordCountMax: 310,
    questions: [
      { id: 'q36', number: 36, text: 'Staff present professionally with visible identification as per RQIA expectations?' },
      { id: 'q37', number: 37, text: 'Staff maintain professional boundaries, confidentiality and data protection compliance?' },
      { id: 'q38', number: 38, text: 'Shift handovers are structured with clear communication of key information?' },
      { id: 'q39', number: 39, text: 'Care records are accurate, contemporaneous and meet RQIA documentation standards?' },
      { id: 'q40', number: 40, text: 'Staff demonstrate knowledge of DHSSPS minimum standards and organisational policies?' },
      { id: 'q41', number: 41, text: 'Staff use respectful, person-centred language in all interactions?' },
      { id: 'q42', number: 42, text: 'Feedback from service users about staff conduct is consistently positive?' },
      { id: 'q43', number: 43, text: 'Supervisions are conducted regularly and documented effectively?' },
      { id: 'q44', number: 44, text: 'Appraisals include professional development goals and NISCC registration requirements?' },
      { id: 'q45', number: 45, text: 'Staff attendance and sickness patterns are monitored and managed?' },
      { id: 'q46', number: 46, text: 'Professional conduct concerns are escalated through appropriate procedures?' },
      { id: 'q47', number: 47, text: 'Staff understand safeguarding duties under the Adult Safeguarding Prevention and Protection in Partnership policy?' },
      { id: 'q48', number: 48, text: 'Staff work collaboratively with HSC Trusts and external partner agencies?' },
      { id: 'q49', number: 49, text: 'Handovers include person-centred updates on wellbeing and risk?' },
      { id: 'q50', number: 50, text: 'Staff are registered with NISCC (Northern Ireland Social Care Council) where required?' }
    ]
  },
  {
    id: 'staff-knowledge',
    title: 'STAFF KNOWLEDGE ON INDIVIDUALS SUPPORTED',
    icon: '🧠',
    countryPrefix: 'Northern Ireland',
    maxScore: 10,
    wordCountMin: 260,
    wordCountMax: 275,
    questions: [
      { id: 'q51', number: 51, text: 'Staff can describe each person\'s preferences, routines and what matters to them?' },
      { id: 'q52', number: 52, text: 'Staff understand and respond to each person\'s communication needs and style?' },
      { id: 'q53', number: 53, text: 'Staff know individual triggers and have effective support strategies?' },
      { id: 'q54', number: 54, text: 'Staff can articulate the personal outcomes and goals for each individual?' },
      { id: 'q55', number: 55, text: 'Staff can access care plans, risk assessments and key documents promptly?' },
      { id: 'q56', number: 56, text: 'Staff have detailed knowledge of each person\'s health conditions and care needs?' },
      { id: 'q57', number: 57, text: 'Staff recognise early warning signs and know the HSC Trust escalation pathway?' },
      { id: 'q58', number: 58, text: 'Staff know each person\'s family contact preferences and arrangements?' },
      { id: 'q59', number: 59, text: 'Staff communicate effectively with GPs, community teams and HSC professionals?' },
      { id: 'q60', number: 60, text: 'New staff complete a structured induction including person-specific orientation?' }
    ]
  },
  {
    id: 'positive-behaviour-support',
    title: 'POSITIVE BEHAVIOUR SUPPORT (PBS)',
    icon: '💚',
    countryPrefix: 'Northern Ireland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 315,
    questions: [
      { id: 'q61', number: 61, text: 'PBS plans are in place for all individuals who require behavioural support?' },
      { id: 'q62', number: 62, text: 'PBS plans are co-produced with the individual, their family and involved professionals?' },
      { id: 'q63', number: 63, text: 'PBS plans identify the function of behaviour, triggers and proactive strategies?' },
      { id: 'q64', number: 64, text: 'Least restrictive interventions are prioritised in line with RQIA guidance and human rights principles?' },
      { id: 'q65', number: 65, text: 'PBS plans are reviewed regularly using behavioural data and functional analysis?' },
      { id: 'q66', number: 66, text: 'Staff receive PBS training from BILD-accredited or recognised providers?' },
      { id: 'q67', number: 67, text: 'Staff demonstrate competence in de-escalation and proactive support techniques?' },
      { id: 'q68', number: 68, text: 'Any restrictive practice is authorised, documented and reported to RQIA?' },
      { id: 'q69', number: 69, text: 'Behavioural data is systematically collected, analysed and used to inform care?' },
      { id: 'q70', number: 70, text: 'PBS approaches are implemented consistently across all staff and shifts?' }
    ]
  },
  {
    id: 'medication-management',
    title: 'MEDICATION MANAGEMENT',
    icon: '💊',
    countryPrefix: 'Northern Ireland',
    maxScore: 10,
    wordCountMin: 280,
    wordCountMax: 310,
    questions: [
      { id: 'q71', number: 71, text: 'Medication management meets RQIA standards and DHSSPS guidelines?' },
      { id: 'q72', number: 72, text: 'Medicines are stored securely with appropriate temperature monitoring and controlled drug procedures?' },
      { id: 'q73', number: 73, text: 'MAR charts are completed accurately with no gaps or unexplained omissions?' },
      { id: 'q74', number: 74, text: 'PRN protocols are clear with documented rationale, dose and effectiveness review?' },
      { id: 'q75', number: 75, text: 'Medication reviews with GP or community pharmacist occur at recommended intervals?' },
      { id: 'q76', number: 76, text: 'Staff administering medication are trained and competency-assessed regularly?' },
      { id: 'q77', number: 77, text: 'Medication errors and near misses are reported, investigated and lessons learned?' },
      { id: 'q78', number: 78, text: 'Consent for medication is documented with capacity considerations under MCA (NI) 2016?' },
      { id: 'q79', number: 79, text: 'Allergies and adverse drug reactions are clearly recorded and communicated?' },
      { id: 'q80', number: 80, text: 'STOMP principles are applied to reduce inappropriate psychotropic medication use?' }
    ]
  },
  {
    id: 'staff-training-compliance',
    title: 'STAFF TRAINING & COMPLIANCE',
    icon: '🎓',
    countryPrefix: 'Northern Ireland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q81', number: 81, text: 'Mandatory training completion rates meet the 95% target?' },
      { id: 'q82', number: 82, text: 'A training matrix is maintained centrally and monitored regularly?' },
      { id: 'q83', number: 83, text: 'Safeguarding training meets the requirements of the DHSSPS Adult Safeguarding policy?' },
      { id: 'q84', number: 84, text: 'Equality, diversity and human rights training is completed by all staff?' },
      { id: 'q85', number: 85, text: 'Communication needs training is provided and linked to individual requirements?' },
      { id: 'q86', number: 86, text: 'Condition-specific training covers the health needs of people supported?' },
      { id: 'q87', number: 87, text: 'PBS training compliance is tracked and refresher training is scheduled?' },
      { id: 'q88', number: 88, text: 'First aid, fire safety and basic life support training is current?' },
      { id: 'q89', number: 89, text: 'Refresher training is planned proactively before certification expiry?' },
      { id: 'q90', number: 90, text: 'Training impact is evaluated through supervision, observation and competency assessment?' }
    ]
  },
  {
    id: 'leadership-governance',
    title: 'LEADERSHIP, GOVERNANCE & QUALITY ASSURANCE',
    icon: '🏛️',
    countryPrefix: 'Northern Ireland',
    maxScore: 10,
    wordCountMin: 300,
    wordCountMax: 320,
    questions: [
      { id: 'q91', number: 91, text: 'A governance framework exists and meets the requirements of The Quality Standards for Health and Social Care 2006?' },
      { id: 'q92', number: 92, text: 'The registered manager provides visible, effective and accountable leadership?' },
      { id: 'q93', number: 93, text: 'Internal quality monitoring audits are conducted at least monthly as required by RQIA?' },
      { id: 'q94', number: 94, text: 'Audit findings generate action plans that are followed through and evidenced?' },
      { id: 'q95', number: 95, text: 'Incidents and safeguarding concerns are reported to RQIA and analysed for trends?' },
      { id: 'q96', number: 96, text: 'Complaints are managed in line with DHSSPS complaints procedures with documented outcomes?' },
      { id: 'q97', number: 97, text: 'RQIA registration conditions, improvement notices and inspection requirements are met?' },
      { id: 'q98', number: 98, text: 'Partnership working with HSC Trusts, commissioners and external agencies is evidenced?' },
      { id: 'q99', number: 99, text: 'Staff recruitment, retention and well-being data is monitored and acted upon?' },
      { id: 'q100', number: 100, text: 'A continuous improvement plan is in place with measurable objectives and progress tracking?' }
    ]
  }
];

export default niSections;
