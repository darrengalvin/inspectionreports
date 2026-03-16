import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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

function loadServices(): EndorsedService[] {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch { /* empty */ }
  return [];
}

function saveServices(services: EndorsedService[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(services, null, 2));
}

export async function GET() {
  const services = loadServices();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  try {
    const service: EndorsedService = await request.json();

    if (!service.referenceNumber || !service.serviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const services = loadServices();
    const existingIndex = services.findIndex(s => s.referenceNumber === service.referenceNumber);

    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }

    saveServices(services);

    return NextResponse.json({ success: true, totalEndorsed: services.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
