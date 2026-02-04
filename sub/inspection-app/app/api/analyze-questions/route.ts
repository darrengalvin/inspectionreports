import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { inspectionSections } from '../../data/sections';

export async function POST() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Format all questions for analysis
  const questionsData = inspectionSections.map(section => ({
    sectionNumber: section.number,
    sectionTitle: section.title,
    purpose: section.purpose,
    questions: section.questions.map(q => ({
      text: q.text,
      probes: q.probes || []
    }))
  }));

  const analysisPrompt = `You are an expert in supported housing regulation, care quality assessment, and social care inspection frameworks in the UK. You have deep knowledge of all regulatory bodies, legislation, and best practice guidance.

Your task is to critically evaluate a set of inspection questions designed to assess the quality of supported housing services. Compare these questions against ALL authoritative guidance and regulatory standards including:

**Regulatory Bodies & Standards:**
1. CQC (Care Quality Commission) - All 5 Key Questions (Safe, Effective, Caring, Responsive, Well-led) and Key Lines of Enquiry (KLOEs)
2. Housing Ombudsman - Complaint Handling Code, Spotlight reports, resident voice standards
3. Regulator of Social Housing - All Consumer Standards (Safety & Quality, Transparency, Tenancy, Neighbourhood & Community)
4. NICE Guidelines - Mental health, substance misuse, trauma, supported living
5. The Care Act 2014 - All safeguarding principles, wellbeing duties, advocacy requirements
6. Making Safeguarding Personal - Outcome-focused, person-led approach
7. Supported Housing National Statement of Expectations - All quality standards
8. Trauma-Informed Care principles - ACEs awareness, re-traumatisation prevention
9. Mental Capacity Act 2005 - Capacity assessment, best interests, DoLS
10. Human Rights Act - Articles 2, 3, 5, 8, 14
11. Equality Act 2010 - Protected characteristics, reasonable adjustments
12. Health and Safety at Work Act - Environmental safety
13. Fire Safety (England) Regulations 2022 - Building safety
14. Data Protection Act 2018 / UK GDPR - Confidentiality, information governance

**Provide an EXHAUSTIVE analysis with the following structure:**

# EXECUTIVE SUMMARY
- Overall score out of 100 with clear justification
- Top 3 strengths
- Top 3 critical gaps

# DETAILED STRENGTHS ANALYSIS
For each strength, cite the specific regulatory requirement it addresses.

# COMPREHENSIVE GAP ANALYSIS
Organise by regulatory framework. For EACH gap:
- Which specific clause/standard is not addressed
- Why this matters for residents
- Risk level (Critical/High/Medium/Low)
- Specific harm that could occur if unaddressed

# MISSING QUESTIONS - DETAILED SUGGESTIONS
For each gap identified, provide:
- 3-5 specific questions that should be added
- The exact wording to use
- Which probing questions to include
- Which regulatory requirement each addresses
- Where in the inspection framework it should sit

Focus especially on these commonly missed areas:
- Mental Capacity Act compliance (capacity assessments, best interests, advocacy)
- Deprivation of Liberty considerations
- Environmental safety and property conditions
- Staff competency, training, and supervision
- Governance and leadership accountability
- Confidentiality and data protection
- Trauma-informed practice in detail
- Co-production and service user involvement in service design
- Tenancy security and eviction processes
- Financial exploitation and appointeeship
- Modern slavery and county lines awareness
- Digital exclusion and accessibility
- Move-on planning and transition support
- Emergency and out-of-hours support
- Lone working and staff safety
- Incident reporting and learning
- Quality assurance and audit processes

# QUESTION QUALITY CRITIQUE
Review each existing question for:
- Leading language
- Assumptions embedded
- Clarity and accessibility
- Whether it will actually elicit useful information
Suggest improved wording where needed.

# RISK MATRIX
Create a priority matrix showing:
- Impact if gap unaddressed (1-5)
- Likelihood of occurrence (1-5)
- Overall risk score
- Recommended action

# IMPLEMENTATION ROADMAP
Prioritised list of changes:
1. Immediate/Critical (implement now)
2. High priority (implement within 1 month)
3. Medium priority (implement within 3 months)
4. Enhancement (nice to have)

Be exhaustive, specific, and evidence-based. Reference specific clauses of legislation and guidance. This analysis will be used to create a comprehensive, regulation-compliant inspection framework.

---

QUESTIONS TO ANALYSE:

${JSON.stringify(questionsData, null, 2)}

Provide your complete, detailed analysis.`;

  try {
    // Use GPT-5.2 - the latest model with extended thinking capabilities
    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 16000,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content || 'No analysis generated';

    return NextResponse.json({ 
      success: true, 
      analysis,
      model: response.model,
      usage: response.usage
    });

  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: `API Error: ${errorMessage}. Ensure OPENAI_API_KEY is set and has access to gpt-5.2.`
    }, { status: 500 });
  }
}
