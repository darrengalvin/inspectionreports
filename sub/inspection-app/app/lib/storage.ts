const STORAGE_KEYS = {
  QM7_AUDIT: 'qm7-audit-state',
  QM7_SAVED_AUDITS: 'qm7-saved-audits',
  INSPECTION: 'inspection-state',
  ASSESSMENT: 'assessment-state',
  ENDORSED_SERVICES: 'endorsed-services',
};

export { STORAGE_KEYS };

export interface SavedAuditSummary {
  auditNumber: string;
  serviceName: string;
  country: string;
  percentage: number;
  dateCompleted: string;
  passed: boolean;
}

export interface EndorsedService {
  referenceNumber: string;
  auditNumber: string;
  serviceName: string;
  percentage: number;
  dateIssued: string;
  country: string;
  endorsedBy: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function saveToStorage<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn(`Failed to save to localStorage key "${key}"`);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`Failed to load from localStorage key "${key}"`);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`Failed to remove localStorage key "${key}"`);
  }
}

export function getAllSavedAudits(): SavedAuditSummary[] {
  return loadFromStorage<SavedAuditSummary[]>(STORAGE_KEYS.QM7_SAVED_AUDITS) ?? [];
}

export function saveAuditToHistory(audit: SavedAuditSummary): void {
  const existing = getAllSavedAudits();
  const idx = existing.findIndex(a => a.auditNumber === audit.auditNumber);
  if (idx >= 0) {
    existing[idx] = audit;
  } else {
    existing.push(audit);
  }
  saveToStorage(STORAGE_KEYS.QM7_SAVED_AUDITS, existing);
}

export function getEndorsedServices(): EndorsedService[] {
  return loadFromStorage<EndorsedService[]>(STORAGE_KEYS.ENDORSED_SERVICES) ?? [];
}

export function addEndorsedService(service: EndorsedService): void {
  const existing = getEndorsedServices();
  const idx = existing.findIndex(s => s.referenceNumber === service.referenceNumber);
  if (idx >= 0) {
    existing[idx] = service;
  } else {
    existing.push(service);
  }
  saveToStorage(STORAGE_KEYS.ENDORSED_SERVICES, existing);
}

export function findEndorsedServiceByRef(ref: string): EndorsedService | null {
  const services = getEndorsedServices();
  return services.find(s => s.referenceNumber === ref) ?? null;
}

export function serializeMap<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

export function deserializeMap<K, V>(entries: [K, V][]): Map<K, V> {
  return new Map(entries);
}
