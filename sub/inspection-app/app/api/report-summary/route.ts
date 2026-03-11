import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const sectionsSummary = (data.sections || []).map((s: {
      sectionId: string;
      score: number;
      status: string;
      whyThisScore?: string;
      quotes?: { text: string; sentiment: string }[];
    }) => ({
      sectionId: s.sectionId,
      score: s.score,
      status: s.status,
      whyThisScore: (s.whyThisScore || '').slice(0, 150),
      topQuotes: (s.quotes || []).slice(0, 2).map((q) => ({
        text: q.text.slice(0, 120),
        sentiment: q.sentiment,
      })),
    }));

    const prompt = `You are an expert UK supported housing inspector. Generate a concise executive summary for this inspection report.

INSPECTION DATA:
- Property: ${data.propertyName || 'Unknown'}
- Provider: ${data.providerName || 'Unknown'}
- Residents interviewed: ${data.residentsInterviewed || 0} of ${data.totalResidents || 0}
- Overall score: ${data.overallScore || 0}/10
- Verdict: ${data.overallVerdict || 'Unknown'}

SECTION SCORES AND EVIDENCE:
${sectionsSummary.map((s: { sectionId: string; score: number; status: string; whyThisScore: string; topQuotes: { text: string; sentiment: string }[] }) =>
  `- ${s.sectionId}: ${s.score}/10 (${s.status})${s.whyThisScore ? `\n  Rationale: ${s.whyThisScore}` : ''}${s.topQuotes.length > 0 ? `\n  Quotes: ${s.topQuotes.map((q) => `"${q.text}" [${q.sentiment}]`).join('; ')}` : ''}`
).join('\n')}

Respond with valid JSON only, no markdown fences:
{
  "headline": "One sentence (max 30 words) capturing the overall picture for a senior manager.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "concerns": ["Concern 1", "Concern 2", "Concern 3"],
  "actions": ["Action 1", "Action 2"]
}

Rules:
- Keep each bullet to max 15 words
- Return 1-3 items per array based on evidence
- Be specific — reference section areas, not generic statements
- Ground concerns in resident quotes where available
- Actions should be concrete and achievable`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const summary = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!summary) {
      return NextResponse.json({ success: false, error: 'Invalid response format' }, { status: 500 });
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Report summary API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
