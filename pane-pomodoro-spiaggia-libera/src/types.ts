export type ZoneStatus = 'molto_libero' | 'poco_spazio' | 'pieno';

export interface Zone {
  id: string;
  name: string;
  row: string;
}

export interface Report {
  id: string;
  zoneId: string;
  status: ZoneStatus;
  note: string;
  deviceId: string;
  createdAt: string; // ISO
}

export interface ZoneState {
  zone: Zone;
  currentStatus: ZoneStatus | 'sconosciuto';
  lastReportAt: string | null;
  lastNote: string | null;
  recentReportsCount: number;
}

export const STALE_MINUTES = 45;

export const STATUS_LABELS: Record<ZoneStatus, string> = {
  molto_libero: 'Molto spazio libero',
  poco_spazio: 'Poco spazio',
  pieno: 'Pieno',
};

export const ROWS = [
  'Fila 1 – vicino al mare',
  'Fila 2 – centro spiaggia',
  'Fila 3 – vicino ingresso',
];

export const ZONES_PER_ROW = 5;

export function buildZones(): Zone[] {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const zones: Zone[] = [];
  ROWS.forEach((row, rowIndex) => {
    letters.forEach((letter) => {
      zones.push({
        id: `r${rowIndex + 1}-${letter}`,
        name: `Zona ${letter}`,
        row,
      });
    });
  });
  return zones;
}
