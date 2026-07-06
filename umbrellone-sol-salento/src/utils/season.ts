const SEASON_START_MONTH = 5; // giugno (0-indexed)
const SEASON_START_DAY = 1;
const SEASON_END_MONTH = 8; // settembre (0-indexed)
const SEASON_END_DAY = 30;

const PRICE_FERIALE = 15;
const PRICE_WEEKEND = 20;

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Restituisce l'intervallo della stagione balneare corrente (1 giugno - 30 settembre). */
export function getSeasonRange(now: Date = new Date()): { start: Date; end: Date } {
  const today = toDateOnly(now);
  let year = today.getFullYear();
  const seasonEndThisYear = new Date(year, SEASON_END_MONTH, SEASON_END_DAY);
  if (today > seasonEndThisYear) {
    year += 1;
  }
  return {
    start: new Date(year, SEASON_START_MONTH, SEASON_START_DAY),
    end: new Date(year, SEASON_END_MONTH, SEASON_END_DAY),
  };
}

/** Prima data prenotabile: oggi stesso se siamo già in stagione, altrimenti l'inizio stagione. */
export function getMinBookableDate(now: Date = new Date()): Date {
  const today = toDateOnly(now);
  const { start } = getSeasonRange(now);
  return today > start ? today : start;
}

export function formatDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Prezzo per giorno: weekend (sab/dom) più caro del feriale. */
export function priceForDate(date: Date): number {
  const day = date.getDay();
  return day === 0 || day === 6 ? PRICE_WEEKEND : PRICE_FERIALE;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export { PRICE_FERIALE, PRICE_WEEKEND };
