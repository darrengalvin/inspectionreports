import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface SectionSummary {
  title: string;
  score: number;
  maxScore: number;
  narrative: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const sectionLines = (data.sections as SectionSummary[]).map(s => {
      const pct = s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0;
      return `- ${s.title}: ${s.score}/${s.maxScore} (${pct}%)${s.narrative ? `\n  Narrative: ${s.narrative.slice(0, 200)}` : ''}`;
    }).join('\n');

    const prompt = `You are a UK care quality auditor. Generate a detailed action plan for a service that scored ${data.percentage}% on a QM7 Quality Management Audit (below the 70% pass threshold).

SERVICE: ${data.serviceName}
OVERALL SCORE: ${data.percentage}%

SECTION SCORES:
${sectionLines}

${data.observationOverview ? `OBSERVATION OVERVIEW:\n${data.observationOverview.slice(0, 300)}` : ''}
${data.recommendations ? `RECOMMENDATIONS:\n${data.recommendations.slice(0, 300)}` : ''}

Generate a JSON action plan. Focus on sections scoring below 70%. Each item should have a specific, measurable action.

Respond with valid JSON only (no markdown fences):
{
  "items": [
    {
      "id": "ap-1",
      "area": "Section title",
      "finding": "What was found lacking (1 sentence)",
      "action": "Specific corrective action (1-2 sentences)",
      "responsible": "Role responsible (e.g. Service Manager)",
      "deadline": "YYYY-MM-DD (within 90 days from today ${new Date().toISOString().split('T')[0]})",
      "priority": "high|medium|low"
    }
  ],
  "generatedAt": "${new Date().toISOString()}",
  "followUpDate": "YYYY-MM-DD (90 days from today)",
  "overallRecommendation": "Overall recommendation paragraph (2-3 sentences)"
}

Rules:
- Include 3-8 action items depending on number of weak sections
- Prioritize: <50% = high, 50-69% = medium, marginal = low
- Deadlines should be staggered (30/60/90 days)
- Actions must be specific and measurable
- Follow-up date should be 90 days from today`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!plan) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Action plan API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
