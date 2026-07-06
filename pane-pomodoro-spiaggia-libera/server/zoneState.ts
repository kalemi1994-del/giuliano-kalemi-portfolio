import { buildZones, STALE_MINUTES, type Report, type ZoneState } from '../src/types';

const ZONES = buildZones();
const RATE_LIMIT_MS = 60 * 1000;

export function computeZoneStates(reports: Report[]): ZoneState[] {
  const staleCutoff = Date.now() - STALE_MINUTES * 60 * 1000;
  const recentCutoff = Date.now() - 2 * 60 * 60 * 1000;

  return ZONES.map((zone) => {
    const zoneReports = reports
      .filter((r) => r.zoneId === zone.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latest = zoneReports[0];
    const isFresh = latest && new Date(latest.createdAt).getTime() >= staleCutoff;

    return {
      zone,
      currentStatus: isFresh ? latest.status : 'sconosciuto',
      lastReportAt: latest ? latest.createdAt : null,
      lastNote: isFresh && latest.note ? latest.note : null,
      recentReportsCount: zoneReports.filter(
        (r) => new Date(r.createdAt).getTime() >= recentCutoff,
      ).length,
    };
  });
}

export function isRateLimited(reports: Report[], zoneId: string, deviceId: string): boolean {
  const cutoff = Date.now() - RATE_LIMIT_MS;
  return reports.some(
    (r) =>
      r.zoneId === zoneId &&
      r.deviceId === deviceId &&
      new Date(r.createdAt).getTime() >= cutoff,
  );
}

export function getZoneById(zoneId: string) {
  return ZONES.find((z) => z.id === zoneId);
}
