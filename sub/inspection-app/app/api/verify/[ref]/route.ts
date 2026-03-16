import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), '.endorsed-services.json');

interface EndorsedService {
  referenceNumber: string;
  auditNumber: string;
  serviceName: string;
  percentage: number;
  dateIssued: string;
  country: string;
  endorsedBy: string;
}

function loadEndorsedServices(): EndorsedService[] {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch { /* empty */ }
  return [];
}

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

  const services = loadEndorsedServices();
  const service = services.find(s => s.referenceNumber === ref);

  if (!service) {
    return NextResponse.json({
      found: false,
      message: 'No endorsed service found with this reference number. The service may not have been endorsed yet, or the reference may be incorrect.',
    });
  }

  return NextResponse.json({
    found: true,
    service: {
      serviceName: service.serviceName,
      percentage: service.percentage,
      dateIssued: service.dateIssued,
      country: service.country,
      endorsedBy: service.endorsedBy,
      auditNumber: service.auditNumber,
    },
  });
}
