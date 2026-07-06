import type { ZoneState, ZoneStatus } from '../types';

export async function fetchZones(): Promise<ZoneState[]> {
  const res = await fetch('/api/zones');
  if (!res.ok) throw new Error('Errore nel caricamento delle zone.');
  const data = await res.json();
  return data.zones;
}

export async function submitReport(
  zoneId: string,
  status: ZoneStatus,
  note: string,
  deviceId: string,
): Promise<ZoneState[]> {
  const res = await fetch(`/api/zones/${zoneId}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, deviceId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Errore durante l\'invio della segnalazione.');
  return data.zones;
}
