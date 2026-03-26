import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('date_completed', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.individualName || !body.facilityName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from('assessments').insert({
      individual_name: body.individualName,
      facility_name: body.facilityName,
      support_level: body.supportLevel || '',
      overall_percentage: body.overallPercentage || 0,
      date_completed: body.dateCompleted || new Date().toISOString(),
      has_transition_plan: body.hasTransitionPlan ?? false,
      assessment_data: body.assessmentData || {},
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
