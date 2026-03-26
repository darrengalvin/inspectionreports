import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('inspections')
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

    if (!body.propertyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from('inspections').insert({
      property_name: body.propertyName,
      provider_name: body.providerName || '',
      overall_score: body.overallScore || 0,
      date_completed: body.dateCompleted || new Date().toISOString(),
      report_data: body.reportData || {},
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
