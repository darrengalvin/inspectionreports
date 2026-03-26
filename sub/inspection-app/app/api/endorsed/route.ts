import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('endorsed_services')
    .select('*')
    .order('date_issued', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ services: data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.referenceNumber || !body.serviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from('endorsed_services').upsert(
      {
        reference_number: body.referenceNumber,
        audit_number: body.auditNumber,
        service_name: body.serviceName,
        percentage: body.percentage,
        date_issued: body.dateIssued || new Date().toISOString(),
        country: body.country || '',
        endorsed_by: body.endorsedBy || 'DPB Quality Management',
      },
      { onConflict: 'reference_number' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { count } = await supabase
      .from('endorsed_services')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ success: true, totalEndorsed: count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
