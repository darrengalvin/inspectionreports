import { Section } from '../types/inspection';

export const inspectionSections: Section[] = [
  {
    id: 'support-understanding',
    number: 1,
    title: 'Understanding of Support Offer',
    purpose: 'Establish the "promise" vs reality — what were residents told vs what they receive.',
    questions: [
      {
        id: 'q1-1',
        text: 'When you moved in, what were you told the support would include?',
        probes: ['If I looked at your support plan, what would it say they do for you?']
      },
      {
        id: 'q1-2',
        text: 'What did you think you were signing up for?'
      },
      {
        id: 'q1-3',
        text: 'How often are staff meant to check in with you?',
        probes: ['Daily? Weekly? 24/7? On-call?']
      },
      {
        id: 'q1-4',
        text: 'What support do you actually receive in a normal week?'
      },
      {
        id: 'q1-5',
        text: 'Who provides the support? Is it the same people or lots of different staff?'
      },
      {
        id: 'q1-6',
        text: 'If support was reduced or changed, were you told why and asked for your view?',
        probes: ['What support do you wish you had but don\'t?']
      }
    ]
  },
  {
    id: 'reliability',
    number: 2,
    title: 'Reliability & Consistency of Support',
    purpose: 'Test delivery quality, not just intentions.',
    questions: [
      {
        id: 'q2-1',
        text: 'Do staff come when they say they will?'
      },
      {
        id: 'q2-2',
        text: 'How often do visits get cancelled or turn up late?'
      },
      {
        id: 'q2-3',
        text: 'If they don\'t show up, do you get told, and do they rearrange?'
      },
      {
        id: 'q2-4',
        text: 'Do you ever feel like you\'re "chasing" for basic support?',
        probes: [
          'Tell me about the last time you needed help quickly — what happened?',
          'Over the last month, how many times has support not happened as planned?'
        ]
      }
    ]
  },
  {
    id: 'respect-dignity',
    number: 3,
    title: 'Relationship, Respect & Dignity',
    purpose: '"Care quality" in the human sense.',
    questions: [
      {
        id: 'q3-1',
        text: 'Do staff speak to you with respect?'
      },
      {
        id: 'q3-2',
        text: 'Do they listen properly, or do they rush you / talk over you?'
      },
      {
        id: 'q3-3',
        text: 'Do you feel judged, blamed, or spoken to like a child?'
      },
      {
        id: 'q3-4',
        text: 'Do staff understand what matters to you (your routines, triggers, preferences)?'
      },
      {
        id: 'q3-5',
        text: 'Do you feel emotionally safe with staff?',
        probes: [
          'If you disagree with staff, what happens?',
          'Have you ever felt intimidated, threatened, or pressured?'
        ]
      }
    ]
  },
  {
    id: 'choice-control',
    number: 4,
    title: 'Choice, Control & Consent',
    purpose: 'Ensure support isn\'t controlling or coercive.',
    questions: [
      {
        id: 'q4-1',
        text: 'Do you get a say in when support happens, or is it just "when staff can do it"?'
      },
      {
        id: 'q4-2',
        text: 'Do staff ask your permission before entering your home or doing things?',
        probes: ['Have staff ever entered without proper notice or consent?']
      },
      {
        id: 'q4-3',
        text: 'Do you have privacy in your own home?'
      },
      {
        id: 'q4-4',
        text: 'Are there rules that feel unfair or not explained?'
      },
      {
        id: 'q4-5',
        text: 'Are you ever told you "have to" do something or you\'ll lose housing/support?',
        probes: ['Do you feel you can say "no" without consequences?']
      }
    ]
  },
  {
    id: 'support-planning',
    number: 5,
    title: 'Support Planning',
    purpose: 'Avoid copy/paste plans — check for genuine personalisation.',
    questions: [
      {
        id: 'q5-1',
        text: 'Do you have a written support plan? Have you seen it?'
      },
      {
        id: 'q5-2',
        text: 'Were you involved in making it?'
      },
      {
        id: 'q5-3',
        text: 'Does it reflect your goals (not just "engage with support")?',
        probes: ['What are the top 3 goals in your plan right now?']
      },
      {
        id: 'q5-4',
        text: 'How often is it reviewed, and do you feel reviews change anything?',
        probes: ['When was the last review? What changed afterwards?']
      }
    ]
  },
  {
    id: 'practical-support',
    number: 6,
    title: 'Practical Day-to-Day Support',
    purpose: 'Test real-life impact of support.',
    questions: [
      {
        id: 'q6-1',
        text: 'What do staff help you with day to day?',
        probes: ['Cooking/nutrition? Cleaning/laundry? Shopping? Routines and appointments? Forms, benefits, budgeting?']
      },
      {
        id: 'q6-2',
        text: 'Do they support you to build skills/independence, or do they do things to you / for you?',
        probes: ['Give me an example of something you can do now that you couldn\'t do before.']
      },
      {
        id: 'q6-3',
        text: 'Do they help you manage the home properly (so issues don\'t spiral)?'
      },
      {
        id: 'q6-4',
        text: 'What happens if your mental health drops — do they increase support?'
      }
    ]
  },
  {
    id: 'health-wellbeing',
    number: 7,
    title: 'Health, Mental Health & Wellbeing',
    purpose: 'Check competent support, not "signposting only".',
    questions: [
      {
        id: 'q7-1',
        text: 'If you\'re struggling mentally, what do staff do?'
      },
      {
        id: 'q7-2',
        text: 'Do they help you access GP/mental health services, or are you left to cope alone?'
      },
      {
        id: 'q7-3',
        text: 'Do they check in after a crisis, hospital visit, or difficult event?'
      },
      {
        id: 'q7-4',
        text: 'Do they understand your triggers and early warning signs?'
      },
      {
        id: 'q7-5',
        text: 'Do you feel staff responses calm situations down or make them worse?',
        probes: [
          'Tell me about the last time you felt close to crisis — what support did you get?',
          'Is there a plan for what to do if you feel unsafe or unwell?'
        ]
      }
    ]
  },
  {
    id: 'medication',
    number: 8,
    title: 'Medication Support',
    purpose: 'High-risk area — check safety and respect.',
    questions: [
      {
        id: 'q8-1',
        text: 'Do staff support you with medication at all?'
      },
      {
        id: 'q8-2',
        text: 'If yes: what exactly do they do?',
        probes: ['Remind? Prompt? Administer? Store?']
      },
      {
        id: 'q8-3',
        text: 'Do you feel medication is handled safely and respectfully?'
      },
      {
        id: 'q8-4',
        text: 'Have there been mistakes, missed doses, or confusion?',
        probes: [
          'What happens if you refuse medication?',
          'Do you know who to tell if something goes wrong?'
        ]
      }
    ]
  },
  {
    id: 'safeguarding',
    number: 9,
    title: 'Safeguarding & Feeling Safe',
    purpose: 'Detect abuse, exploitation, neglect, and unsafe environments.',
    questions: [
      {
        id: 'q9-1',
        text: 'Do you feel safe where you live?'
      },
      {
        id: 'q9-2',
        text: 'Has anyone taken advantage of you here?',
        probes: ['Money, belongings, pressure, visitors?']
      },
      {
        id: 'q9-3',
        text: 'Have you ever felt unsafe with other residents or visitors?'
      },
      {
        id: 'q9-4',
        text: 'Have staff responded properly to concerns about harassment, exploitation, or threats?'
      },
      {
        id: 'q9-5',
        text: 'Do staff take concerns seriously or minimise them?',
        probes: [
          'If you raised a safeguarding concern, what happened next?',
          'Did anyone explain your options, or did you feel pushed into one path?'
        ]
      }
    ]
  },
  {
    id: 'boundaries',
    number: 10,
    title: 'Staff Boundaries & Professionalism',
    purpose: 'Spot inappropriate relationships or misconduct.',
    questions: [
      {
        id: 'q10-1',
        text: 'Do staff keep professional boundaries?'
      },
      {
        id: 'q10-2',
        text: 'Do staff ever share personal problems with you?'
      },
      {
        id: 'q10-3',
        text: 'Do staff ever ask you for favours or money?'
      },
      {
        id: 'q10-4',
        text: 'Do staff message you outside work in ways that feel uncomfortable?'
      },
      {
        id: 'q10-5',
        text: 'Do you feel staff treat everyone fairly, or do they have favourites?',
        probes: ['Have you ever felt uncomfortable but worried to say something?']
      }
    ]
  },
  {
    id: 'communication',
    number: 11,
    title: 'Communication & Information',
    purpose: '"Do you understand what\'s going on?"',
    questions: [
      {
        id: 'q11-1',
        text: 'Do staff explain decisions clearly?'
      },
      {
        id: 'q11-2',
        text: 'Do you know who your key worker is (if applicable)?'
      },
      {
        id: 'q11-3',
        text: 'Do you know how to contact support quickly?'
      },
      {
        id: 'q11-4',
        text: 'Are you kept informed about changes (staffing, visits, rules, repairs)?',
        probes: ['If I asked you "what happens next with your support?", would you know?']
      }
    ]
  },
  {
    id: 'coordination',
    number: 12,
    title: 'Coordination with Other Services',
    purpose: 'Whether they "hold" the person or just refer them away.',
    questions: [
      {
        id: 'q12-1',
        text: 'Do staff help you engage with other services?',
        probes: ['GP? Mental health team? Social worker? Substance misuse services? Probation?']
      },
      {
        id: 'q12-2',
        text: 'Do they attend meetings with you or help you prepare?'
      },
      {
        id: 'q12-3',
        text: 'Do they support you to be heard, or speak over you?',
        probes: ['Tell me about the last professionals meeting — did it help?']
      },
      {
        id: 'q12-4',
        text: 'If you needed an advocate, would staff help you get one?'
      }
    ]
  },
  {
    id: 'complaints',
    number: 13,
    title: 'Complaints & Raising Concerns',
    purpose: 'This is where the truth often comes out.',
    questions: [
      {
        id: 'q13-1',
        text: 'Do you know how to complain (and to who)?'
      },
      {
        id: 'q13-2',
        text: 'Have you complained? What happened?',
        probes: ['Were you taken seriously?']
      },
      {
        id: 'q13-3',
        text: 'Do you worry complaining could affect your housing or support?',
        probes: [
          'If you complained today, what do you think would happen?',
          'Has anyone ever implied you\'ll be punished, moved, or "labelled" for complaining?'
        ]
      }
    ]
  },
  {
    id: 'equality',
    number: 14,
    title: 'Equality, Accessibility & Adjustments',
    purpose: 'Fair access to support.',
    questions: [
      {
        id: 'q14-1',
        text: 'Do you have needs relating to disability, sensory issues, language, culture, faith, or trauma?'
      },
      {
        id: 'q14-2',
        text: 'Have adjustments been offered and actually put in place?'
      },
      {
        id: 'q14-3',
        text: 'Do staff communicate in a way that works for you?',
        probes: [
          'What do staff do that helps you feel regulated / safe?',
          'What do they do that makes things worse?'
        ]
      }
    ]
  },
  {
    id: 'outcomes',
    number: 15,
    title: 'Outcomes & Impact',
    purpose: 'The big question: "is this working?"',
    questions: [
      {
        id: 'q15-1',
        text: 'Since receiving this housing + support, is your life more stable?'
      },
      {
        id: 'q15-2',
        text: 'Is your life safer?'
      },
      {
        id: 'q15-3',
        text: 'Is your life healthier?'
      },
      {
        id: 'q15-4',
        text: 'Is your life less isolated?'
      },
      {
        id: 'q15-5',
        text: 'Has anything improved because of the support?',
        probes: ['What are you most proud of achieving since moving in?']
      },
      {
        id: 'q15-6',
        text: 'What still isn\'t working?'
      },
      {
        id: 'q15-7',
        text: 'If support stopped tomorrow, what would be the risk to you?',
        probes: ['What are the top 3 changes you want the provider to make?']
      }
    ]
  }
];

// Direct closing questions for the end
export const closingQuestions = [
  'On a scale of 0–10, how supported do you feel here?',
  'What\'s the biggest problem you\'ve had with staff/support?',
  'If your friend needed help, would you recommend this place/provider? Why/why not?',
  'What would you want me to tell the provider\'s senior leadership?'
];
