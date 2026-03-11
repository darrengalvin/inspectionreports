'use client';

import ReportPreview from '../components/ReportPreview';
import type { InspectionData } from '../types/inspection';

const exampleReport: InspectionData = {
  id: 'QA-2026-0131',
  propertyName: 'Maple House',
  providerName: 'Sunrise Supported Living Ltd',
  date: '31 January 2026',
  residentsInterviewed: 6,
  totalResidents: 8,
  overallScore: 5.9,
  overallVerdict: 'requires-improvement',
  assessmentSummary: '',
  inspector: {
    name: 'Sarah Mitchell',
    role: 'Lead Quality Inspector',
  },
  followUpDate: '28 March 2026',
  sections: [
    {
      sectionId: 'support-understanding',
      score: 6,
      status: 'improvement-needed',
      whyThisScore: 'Most residents had a general understanding of what support was available, but 3 of 6 said it didn\'t match what they were told at move-in. Support plans exist but feel generic. Two residents couldn\'t name what was in theirs.',
      responses: [
        { questionId: 'q1-1', finding: 'Residents were told "24/7 support" but in practice staff are on-call overnight, not on-site.' },
        { questionId: 'q1-4', finding: 'Actual support averages 2 visits per week. Most expected daily contact.' },
        { questionId: 'q1-6', finding: 'Reductions in support hours happened in October with no consultation.' },
      ],
      quotes: [
        { text: 'They said someone would be here all the time. That\'s not what happens.', residentId: 'Resident A', sentiment: 'concern' },
        { text: 'My key worker is good, she explains things properly.', residentId: 'Resident D', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'reliability',
      score: 4,
      status: 'inadequate',
      whyThisScore: 'Significant reliability issues. 4 of 6 residents reported cancelled visits in the past month. No rearrangement offered in most cases. Staff turnover is creating inconsistency.',
      responses: [
        { questionId: 'q2-1', finding: 'Only 2 of 6 said staff reliably come when scheduled.' },
        { questionId: 'q2-2', finding: '4 residents reported at least 2 cancelled visits in the past month.' },
        { questionId: 'q2-3', finding: 'Cancellations are rarely communicated in advance. No rearrangement offered.' },
      ],
      quotes: [
        { text: 'They just don\'t turn up sometimes. No text, nothing.', residentId: 'Resident B', sentiment: 'concern' },
        { text: 'I\'ve had 4 different key workers in 6 months. I have to keep explaining everything.', residentId: 'Resident E', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'respect-dignity',
      score: 8,
      status: 'meeting-standard',
      whyThisScore: 'Strong performance. Residents consistently report feeling treated with respect. Staff listen and don\'t rush. Two residents mentioned occasionally feeling "talked down to" but acknowledged it was rare.',
      responses: [
        { questionId: 'q3-1', finding: '6 of 6 said staff speak to them respectfully.' },
        { questionId: 'q3-4', finding: 'Most staff understand individual routines and preferences.' },
      ],
      quotes: [
        { text: 'They treat me like a person, not a number.', residentId: 'Resident C', sentiment: 'positive' },
        { text: 'My key worker remembers the small things. That matters.', residentId: 'Resident A', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'choice-control',
      score: 5,
      status: 'improvement-needed',
      whyThisScore: 'Mixed. Support timing is largely dictated by staff availability. Privacy is generally respected but 2 residents reported staff entering with "just a quick knock" rather than waiting. House rules feel rigid.',
      responses: [
        { questionId: 'q4-1', finding: 'Support happens when staff are available, not when residents prefer.' },
        { questionId: 'q4-2', finding: '6 of 8 said staff knock. 2 said staff enter with just a quick knock.' },
        { questionId: 'q4-4', finding: 'Several "no visitor" rules feel disproportionate and poorly explained.' },
      ],
      quotes: [
        { text: 'I can\'t have anyone over after 9pm. It feels like I\'m in a hostel, not my home.', residentId: 'Resident F', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'support-planning',
      score: 5,
      status: 'improvement-needed',
      whyThisScore: 'Plans exist but lack personalisation. Goals are vague ("engage with support", "maintain tenancy"). Reviews happen quarterly on paper but residents don\'t feel they change anything.',
      responses: [
        { questionId: 'q5-1', finding: 'All residents have a support plan. Only 3 of 6 have seen it recently.' },
        { questionId: 'q5-3', finding: 'Goals are generic. No resident could name specific, measurable goals.' },
        { questionId: 'q5-4', finding: 'Reviews happen but feel like a tick-box exercise.' },
      ],
      quotes: [
        { text: 'They write stuff down but nothing changes after a review.', residentId: 'Resident B', sentiment: 'concern' },
        { text: 'I don\'t even know what my goals are supposed to be.', residentId: 'Resident E', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'practical-support',
      score: 7,
      status: 'meeting-standard',
      whyThisScore: 'Good day-to-day practical support. Staff help with cooking, appointments, and benefits. Some residents feel staff "do things for them" rather than building independence, but overall this area is functional.',
      responses: [
        { questionId: 'q6-1', finding: 'Staff help with cooking, shopping, appointments, and benefits paperwork.' },
        { questionId: 'q6-2', finding: 'Mixed approach — some staff build skills, others just complete tasks.' },
      ],
      quotes: [
        { text: 'They helped me learn to cook basic meals. I\'m proud of that.', residentId: 'Resident D', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'health-wellbeing',
      score: 6,
      status: 'improvement-needed',
      whyThisScore: 'Staff respond to crises but proactive mental health support is limited. Check-ins after hospital visits are inconsistent. Staff understand some triggers but lack formal training in trauma-informed approaches.',
      responses: [
        { questionId: 'q7-1', finding: 'Staff try to help but lack confidence with mental health crises.' },
        { questionId: 'q7-3', finding: 'Post-crisis follow-up is inconsistent — depends on which staff member.' },
        { questionId: 'q7-4', finding: 'Some staff understand triggers, others don\'t read support plans.' },
      ],
      quotes: [
        { text: 'When I was really struggling, one staff member sat with me for an hour. But another time, nobody checked on me for days.', residentId: 'Resident A', sentiment: 'neutral' },
      ],
    },
    {
      sectionId: 'medication',
      score: 7,
      status: 'meeting-standard',
      whyThisScore: 'Medication is handled safely overall. Clear records, no errors reported. Staff prompt rather than administer. One resident unsure who to tell if something goes wrong.',
      responses: [
        { questionId: 'q8-2', finding: 'Staff prompt and remind. They don\'t administer.' },
        { questionId: 'q8-3', finding: 'Handled respectfully. Secure storage in place.' },
      ],
      quotes: [
        { text: 'They remind me every morning. It\'s helpful because I forget.', residentId: 'Resident C', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'safeguarding',
      score: 7,
      status: 'meeting-standard',
      whyThisScore: 'Most residents feel safe. No reports of exploitation or abuse. Staff respond to concerns, though 1 resident felt a concern was "brushed off". Visitors policy helps manage external risks.',
      responses: [
        { questionId: 'q9-1', finding: '5 of 6 feel safe. 1 resident occasionally feels unsafe due to another resident\'s behaviour.' },
        { questionId: 'q9-4', finding: 'Staff responded to a harassment concern but the resident felt it took too long.' },
      ],
      quotes: [
        { text: 'I feel safer here than I have anywhere else.', residentId: 'Resident D', sentiment: 'positive' },
        { text: 'I told them about the shouting next door and it took a week before anyone did anything.', residentId: 'Resident F', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'boundaries',
      score: 8,
      status: 'meeting-standard',
      whyThisScore: 'Professional boundaries are well maintained. No reports of inappropriate relationships, borrowing, or personal disclosures. Staff treat residents fairly.',
      responses: [
        { questionId: 'q10-1', finding: 'All residents report professional behaviour from staff.' },
        { questionId: 'q10-5', finding: 'No perception of favouritism. Staff seen as fair.' },
      ],
      quotes: [
        { text: 'They keep it professional but they\'re still friendly. That\'s how it should be.', residentId: 'Resident C', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'communication',
      score: 5,
      status: 'improvement-needed',
      whyThisScore: 'Communication is a weakness. Residents are not always informed of staffing changes or visit cancellations. 3 residents didn\'t know who their current key worker was after a recent staff change.',
      responses: [
        { questionId: 'q11-2', finding: '3 of 6 couldn\'t name their current key worker.' },
        { questionId: 'q11-4', finding: 'Staffing changes and rota updates are not communicated to residents.' },
      ],
      quotes: [
        { text: 'I found out my key worker left when someone new turned up. Nobody told me.', residentId: 'Resident E', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'coordination',
      score: 6,
      status: 'improvement-needed',
      whyThisScore: 'Staff attend some multi-agency meetings but advocacy support is not proactively offered. Coordination with mental health teams is patchy.',
      responses: [
        { questionId: 'q12-1', finding: 'Staff help with GP appointments but mental health team liaison is weak.' },
        { questionId: 'q12-4', finding: 'No resident had been offered advocacy support.' },
      ],
      quotes: [
        { text: 'They come to my meetings with me. That helps because I get nervous.', residentId: 'Resident A', sentiment: 'positive' },
      ],
    },
    {
      sectionId: 'complaints',
      score: 3,
      status: 'inadequate',
      whyThisScore: 'Serious concerns. 3 of 6 residents fear that complaining will affect their housing. The complaints process is not well understood. One resident reported being told they were "difficult" after raising a concern.',
      responses: [
        { questionId: 'q13-1', finding: 'Only 2 of 6 knew how to formally complain.' },
        { questionId: 'q13-3', finding: '3 residents fear complaining will lead to being moved or losing support.' },
      ],
      quotes: [
        { text: 'I was told I was being difficult when I complained about the cancelled visits. So I stopped saying anything.', residentId: 'Resident B', sentiment: 'concern' },
        { text: 'I wouldn\'t complain. What if they move me?', residentId: 'Resident F', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'equality',
      score: 6,
      status: 'improvement-needed',
      whyThisScore: 'Reasonable adjustments are made when requested but not proactively offered. Communication methods are not adapted for residents with learning difficulties. Cultural needs are acknowledged but not always met.',
      responses: [
        { questionId: 'q14-1', finding: '2 residents have accessibility needs. Adjustments are partial.' },
        { questionId: 'q14-3', finding: 'Staff communicate clearly but don\'t adapt methods for different needs.' },
      ],
      quotes: [
        { text: 'They know I can\'t read well but they still give me letters to sign without reading them to me.', residentId: 'Resident E', sentiment: 'concern' },
      ],
    },
    {
      sectionId: 'outcomes',
      score: 6,
      status: 'improvement-needed',
      whyThisScore: 'Life is more stable for most residents but progress feels slow. Isolation is still an issue for 3 residents. Move-on planning is not discussed. The support is maintaining rather than progressing.',
      responses: [
        { questionId: 'q15-1', finding: '5 of 6 say life is more stable since moving in.' },
        { questionId: 'q15-4', finding: '3 residents report ongoing isolation with no activities offered.' },
        { questionId: 'q15-6', finding: 'Residents want more meaningful activities and connection to community.' },
      ],
      quotes: [
        { text: 'I\'m safe here but I\'m lonely. I sit in my room most days.', residentId: 'Resident F', sentiment: 'concern' },
        { text: 'I\'ve come a long way since I moved in. I can manage my money now.', residentId: 'Resident D', sentiment: 'positive' },
      ],
    },
  ],
  actions: [
    {
      id: 'a1',
      priority: 'high',
      title: 'Address complaints culture immediately',
      description: 'Residents fear retaliation for complaining. Retrain all staff on complaints handling. Introduce anonymous feedback. Investigate the "difficult" labelling incident.',
      deadline: '7 days',
    },
    {
      id: 'a2',
      priority: 'high',
      title: 'Fix visit reliability and cancellation process',
      description: 'Implement mandatory advance notice for cancellations with rearrangement within 48 hours. Track and report cancellation rates monthly.',
      deadline: '14 days',
    },
    {
      id: 'a3',
      priority: 'medium',
      title: 'Improve communication on staffing changes',
      description: 'Residents must be informed of key worker changes before they happen. Introduce a handover meeting between outgoing and incoming key workers with the resident present.',
      deadline: '30 days',
    },
    {
      id: 'a4',
      priority: 'medium',
      title: 'Personalise support plans with measurable goals',
      description: 'Replace generic goals with specific, resident-led objectives. Review all plans within 30 days with resident involvement.',
      deadline: '30 days',
    },
    {
      id: 'a5',
      priority: 'low',
      title: 'Introduce community activities to reduce isolation',
      description: 'At least 2 group activities per week. Explore partnerships with local community organisations.',
      deadline: '60 days',
    },
  ],
};

export default function ReportDemoPage() {
  return (
    <ReportPreview
      data={exampleReport}
      onBack={() => window.location.href = '/'}
    />
  );
}
