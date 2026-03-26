import { NextResponse } from 'next/server';
import { createServiceClient } from '../../lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from('enquiries').insert({
      name,
      email,
      phone: body.phone || '',
      organisation: body.organisation || '',
      service,
      country: body.country || '',
      message,
      submitted_at: body.submittedAt || new Date().toISOString(),
      read: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to process enquiry' }, { status: 500 });
  }
}
