import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../lib/supabase-server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;

  if (!ref || ref.length < 5) {
    return NextResponse.json(
      { found: false, error: 'Invalid reference number' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('endorsed_services')
    .select('service_name, percentage, date_issued, country, endorsed_by, audit_number')
    .eq('reference_number', ref)
    .single();

  if (error || !data) {
    return NextResponse.json({
      found: false,
      message: 'No endorsed service found with this reference number. The service may not have been endorsed yet, or the reference may be incorrect.',
    });
  }

  return NextResponse.json({
    found: true,
    service: {
      serviceName: data.service_name,
      percentage: data.percentage,
      dateIssued: data.date_issued,
      country: data.country,
      endorsedBy: data.endorsed_by,
      auditNumber: data.audit_number,
    },
  });
}
