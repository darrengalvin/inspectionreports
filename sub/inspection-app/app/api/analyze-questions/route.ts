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

  const systemPrompt = `You are an expert in supported housing regulation, care quality assessment, and social care inspection frameworks in the UK.

Your task is to critically evaluate a set of inspection questions designed to assess the quality of supported housing services. You must compare these questions against authoritative guidance and regulatory standards including:

1. **CQC (Care Quality Commission)** - Key Lines of Enquiry (KLOEs) and inspection frameworks
2. **Housing Ombudsman** - Complaint handling and resident voice standards
3. **Regulator of Social Housing** - Consumer standards and tenant satisfaction measures
4. **NICE Guidelines** - For mental health and wellbeing in supported living
5. **The Care Act 2014** - Safeguarding adults principles
6. **Making Safeguarding Personal** - Best practice guidance
7. **Supported Housing National Statement of Expectations** - Quality standards
8. **Trauma-Informed Care principles** - Best practice in vulnerable populations
9. **Mental Capacity Act 2005** - Consent and decision-making
10. **Human Rights Act** - Article 8 (private life) considerations

Provide a thorough, critical analysis with:

1. **Overall Assessment**: How comprehensive are these questions overall? (Score out of 100)

2. **Strengths**: What does this question set do well? Which regulatory areas are well covered?

3. **Gaps & Weaknesses**: What critical areas are missing or underexplored? Be specific about which authoritative guidance is not adequately addressed.

4. **Missing Question Areas**: Suggest specific additional questions that should be asked, organised by theme. For each, explain WHY it matters and which authoritative source requires it.

5. **Question Quality Issues**: Are any existing questions poorly worded, leading, or unlikely to elicit useful information? Suggest improvements.

6. **Risk Areas**: Which gaps represent the highest safeguarding or quality risks if left unaddressed?

7. **Recommendations**: Prioritised list of improvements, from most critical to nice-to-have.

Be direct, specific, and evidence-based. Reference the actual guidance documents where relevant. This analysis will be used to improve the inspection framework.`;

  const userPrompt = `Analyse the following supported housing inspection questions against authoritative UK care and housing guidance:

${JSON.stringify(questionsData, null, 2)}

Provide your detailed critical analysis.`;

  try {
    // Use o1 model for deep reasoning, or gpt-4o if o1 not available
    const response = await openai.chat.completions.create({
      model: 'o1', // Latest reasoning model
      messages: [
        { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
      ],
      // o1 models don't use max_tokens the same way, they reason automatically
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
    
    // Try fallback to gpt-4o if o1 fails
    try {
      const fallbackResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.7
      });

      const analysis = fallbackResponse.choices[0]?.message?.content || 'No analysis generated';

      return NextResponse.json({ 
        success: true, 
        analysis,
        model: fallbackResponse.model,
        usage: fallbackResponse.usage
      });

    } catch (fallbackError: unknown) {
      const errorMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
      return NextResponse.json({ 
        success: false, 
        error: errorMessage 
      }, { status: 500 });
    }
  }
}
