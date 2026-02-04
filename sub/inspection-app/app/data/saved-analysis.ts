// Saved AI Analysis - Generated analysis of inspection questions vs authoritative guidance

export const savedAnalysis = {
  generatedAt: '2026-02-04',
  model: 'o1',
  score: 85,
  
  executiveSummary: {
    score: 85,
    strengths: [
      'Strong resident-centred focus aligned with CQC person-centred approach and Making Safeguarding Personal',
      'Comprehensive safeguarding coverage meeting Care Act 2014 duties',
      'Excellent coverage of complaints and raising concerns per Housing Ombudsman standards'
    ],
    criticalGaps: [
      'Mental Capacity Act compliance - no questions on capacity assessment or best interests',
      'Property condition and environmental safety not addressed',
      'Staff competency, training and governance largely missing'
    ]
  },

  strengths: [
    {
      area: 'Resident-Centred Focus',
      description: 'Questions require the resident\'s own perspective, aligning with CQC "Caring" and "Responsive" domains and Making Safeguarding Personal principles.',
      regulatoryRef: 'CQC KLOEs (Caring, Responsive); Making Safeguarding Personal'
    },
    {
      area: 'Safeguarding Coverage',
      description: 'Section 9 directly assesses risk of abuse or neglect.',
      regulatoryRef: 'Care Act 2014 Section 42; CQC "Safe" domain; RSH Tenant Safety Standard'
    },
    {
      area: 'Respect & Dignity',
      description: 'Section 3 tackles whether individuals feel respected and listened to.',
      regulatoryRef: 'CQC "Caring" domain; Human Rights Act Article 8'
    },
    {
      area: 'Consent and Control',
      description: 'Section 4 explicitly raises coercion and threats.',
      regulatoryRef: 'Mental Capacity Act 2005; Human Rights Act; NICE autonomy guidelines'
    },
    {
      area: 'Complaints Handling',
      description: 'Section 13 well aligned with complaint handling requirements.',
      regulatoryRef: 'Housing Ombudsman Complaint Handling Code; RSH Consumer Standards'
    },
    {
      area: 'Holistic Support',
      description: 'Sections 6, 7, 8, 12 cover practical help, mental health, medication, and coordination.',
      regulatoryRef: 'CQC "Effective" domain; NICE integrated support guidelines'
    }
  ],

  gaps: [
    {
      area: 'Mental Capacity & Best Interests',
      description: 'No probing about how staff handle situations where a resident may lack capacity.',
      regulatoryRef: 'Mental Capacity Act 2005',
      riskLevel: 'Critical',
      potentialHarm: 'Rights infringement, coercive practices, lack of decision-making support'
    },
    {
      area: 'Governance, Leadership & Staff Competence',
      description: 'Little exploration of staff training, professional competence, or quality assurance.',
      regulatoryRef: 'CQC "Well-led" and "Safe" domains; Supported Housing National Statement',
      riskLevel: 'High',
      potentialHarm: 'Inadequate staff responses, poor crisis management, unsafe practice'
    },
    {
      area: 'Confidentiality & Data Protection',
      description: 'No questions about personal information storage, sharing, or privacy in record-keeping.',
      regulatoryRef: 'UK GDPR; Human Rights Act Article 8; Care Act Code of Practice',
      riskLevel: 'High',
      potentialHarm: 'Privacy breaches, residents deterred from disclosing concerns'
    },
    {
      area: 'Trauma-Informed Approaches',
      description: 'No explicit mention of trauma-informed practice, triggers, or re-traumatisation risks.',
      regulatoryRef: 'Trauma-Informed Care principles; NICE mental health guidelines',
      riskLevel: 'High',
      potentialHarm: 'Re-traumatisation, escalating crises, disengagement from support'
    },
    {
      area: 'Environment/Housing Quality & Repairs',
      description: 'No specific questions on property condition, repairs, or environmental hazards.',
      regulatoryRef: 'RSH Home Standard; Housing Health and Safety Rating System',
      riskLevel: 'High',
      potentialHarm: 'Physical injury, health deterioration, fire risk'
    },
    {
      area: 'Service User Involvement in Policy',
      description: 'No questions about residents being engaged in shaping service policies.',
      regulatoryRef: 'RSH Tenant Involvement and Empowerment Standard',
      riskLevel: 'Medium',
      potentialHarm: 'Services not meeting resident needs, lack of accountability'
    }
  ],

  missingQuestions: [
    {
      theme: 'Mental Capacity & Decision-Making',
      questions: [
        {
          text: 'Have staff ever discussed with you how they determine if you can make certain decisions?',
          probes: ['If you needed help making decisions due to a health issue, do you know what would happen?'],
          regulatoryRef: 'Mental Capacity Act 2005 Sections 1-4'
        },
        {
          text: 'Do you feel staff understand how to support you if you struggle to make decisions?',
          probes: ['Do they explain your rights?', 'Have they ever made a decision for you without asking?'],
          regulatoryRef: 'MCA Code of Practice; CQC Safe domain'
        },
        {
          text: 'Has anyone ever talked to you about having an advocate to help you make decisions?',
          probes: ['Do you know what an Independent Mental Capacity Advocate is?'],
          regulatoryRef: 'Care Act 2014 Section 67; MCA IMCA provisions'
        }
      ]
    },
    {
      theme: 'Staff Training, Competence & Accountability',
      questions: [
        {
          text: 'Do staff appear properly trained or knowledgeable about your needs?',
          probes: ['Do they know how to de-escalate situations?', 'Do they seem confident handling crises?'],
          regulatoryRef: 'CQC Effective domain; Health and Care Act staff competency requirements'
        },
        {
          text: 'Are you aware of any processes if a staff member behaves unprofessionally?',
          probes: ['Apart from a general complaint, is there someone specific you can go to?'],
          regulatoryRef: 'CQC Well-led domain; Supported Housing National Statement'
        },
        {
          text: 'Do the same staff work with you regularly, or is there high turnover?',
          probes: ['How does staff changeover affect your support?'],
          regulatoryRef: 'CQC Caring domain; continuity of care principles'
        }
      ]
    },
    {
      theme: 'Confidentiality & Personal Data',
      questions: [
        {
          text: 'Are you comfortable that your personal information is kept private?',
          probes: ['Do you know who can see your records?', 'Is information stored securely?'],
          regulatoryRef: 'UK GDPR Article 5; Data Protection Act 2018'
        },
        {
          text: 'Have staff explained to you how they share your information with other agencies?',
          probes: ['Were you asked to consent?', 'Do you know your rights about your data?'],
          regulatoryRef: 'Human Rights Act Article 8; Caldicott Principles'
        }
      ]
    },
    {
      theme: 'Environment & Property Condition',
      questions: [
        {
          text: 'Do you feel your accommodation is well-maintained, clean, and safe?',
          probes: ['Do staff support you in reporting repairs?'],
          regulatoryRef: 'RSH Home Standard; Homes (Fitness for Human Habitation) Act 2018'
        },
        {
          text: 'Have you faced any issues like damp, faulty heating, or poor fire safety?',
          probes: ['How were they addressed?', 'How long did repairs take?'],
          regulatoryRef: 'Housing Health and Safety Rating System; Fire Safety Regulations 2022'
        },
        {
          text: 'Do you know what to do in case of a fire?',
          probes: ['Have you had fire drills?', 'Do you know where fire exits are?'],
          regulatoryRef: 'Fire Safety (England) Regulations 2022'
        }
      ]
    },
    {
      theme: 'Trauma-Informed Care',
      questions: [
        {
          text: 'Have staff acknowledged past experiences that might affect how you cope?',
          probes: ['Do they ask about triggers?', 'Do they know what helps you feel safe?'],
          regulatoryRef: 'Trauma-Informed Care principles; NICE PTSD guidelines'
        },
        {
          text: 'Do you feel staff use approaches that reduce re-traumatisation?',
          probes: ['Do they give you choices?', 'Do they explain what\'s happening before doing things?'],
          regulatoryRef: 'Trauma-Informed Care 6 principles; NICE mental health guidelines'
        }
      ]
    },
    {
      theme: 'Co-Production & Service User Involvement',
      questions: [
        {
          text: 'Are residents involved in decisions about the overall running of the service?',
          probes: ['Are there house meetings?', 'Can you influence policy changes?'],
          regulatoryRef: 'RSH Tenant Involvement and Empowerment Standard'
        },
        {
          text: 'Do you have any say in how the service could improve, beyond your individual support plan?',
          probes: ['Are there resident forums or feedback mechanisms?'],
          regulatoryRef: 'Think Local Act Personal; co-production best practice'
        }
      ]
    }
  ],

  questionQualityIssues: [
    {
      existingQuestion: 'Tell me about the last time you felt close to crisis — what happened?',
      issue: 'Presumes a crisis has occurred',
      suggestion: 'Can you describe a recent situation that felt difficult or overwhelming? What happened and how did staff respond?'
    },
    {
      existingQuestion: 'Do you ever feel like you\'re "chasing" for basic support?',
      issue: 'Emotive phrase "chasing" may discourage nuanced responses',
      suggestion: 'How do you request support when you need it? Do you find you have to follow up or remind staff?'
    }
  ],

  riskMatrix: [
    { gap: 'Mental Capacity compliance', impact: 5, likelihood: 4, riskScore: 20, priority: 'Critical' },
    { gap: 'Property/environmental safety', impact: 5, likelihood: 3, riskScore: 15, priority: 'High' },
    { gap: 'Trauma-informed practice', impact: 4, likelihood: 4, riskScore: 16, priority: 'High' },
    { gap: 'Confidentiality/data protection', impact: 4, likelihood: 3, riskScore: 12, priority: 'High' },
    { gap: 'Staff competency/governance', impact: 4, likelihood: 3, riskScore: 12, priority: 'High' },
    { gap: 'Service user involvement', impact: 3, likelihood: 3, riskScore: 9, priority: 'Medium' }
  ],

  implementationRoadmap: {
    immediate: [
      'Add Mental Capacity Act questions to Section 4 (Choice, Control & Consent)',
      'Add property condition and fire safety questions as new Section 16',
      'Add staff competency questions to Section 10 (Staff Boundaries)'
    ],
    highPriority: [
      'Create new Section 17: Confidentiality & Information Governance',
      'Embed trauma-informed questions throughout Sections 3, 7, 9',
      'Add advocacy awareness questions to Section 12'
    ],
    mediumPriority: [
      'Add co-production and service involvement questions',
      'Review and refine question wording for neutrality',
      'Add move-on planning questions to Section 15'
    ],
    enhancement: [
      'Add digital exclusion questions',
      'Add modern slavery/county lines awareness questions',
      'Add out-of-hours support questions'
    ]
  }
};
