import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('audit_history')
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

    if (!body.auditNumber || !body.serviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const record: Record<string, unknown> = {
      audit_number: body.auditNumber,
      service_name: body.serviceName,
      country: body.country || '',
      percentage: body.percentage,
      date_completed: body.dateCompleted || new Date().toISOString(),
      passed: body.passed ?? false,
      audit_data: body.auditData || {},
    };

    if (body.parentAuditId) record.parent_audit_id = body.parentAuditId;
    if (body.followUpDate) record.follow_up_date = body.followUpDate;
    if (body.actionPlanItems) record.action_plan_items = body.actionPlanItems;

    const { error } = await supabase.from('audit_history').upsert(
      record,
      { onConflict: 'audit_number' }
    );

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Missing audit id' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const updates: Record<string, unknown> = {};
    if (body.auditNumber) updates.audit_number = body.auditNumber;
    if (body.serviceName) updates.service_name = body.serviceName;
    if (body.country) updates.country = body.country;
    if (body.percentage !== undefined) updates.percentage = body.percentage;
    if (body.passed !== undefined) updates.passed = body.passed;
    if (body.auditData) updates.audit_data = body.auditData;
    if (body.followUpDate) updates.follow_up_date = body.followUpDate;
    if (body.actionPlanItems) updates.action_plan_items = body.actionPlanItems;

    const { error } = await supabase
      .from('audit_history')
      .update(updates)
      .eq('id', body.id);

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
