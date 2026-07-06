export function formatRelativeTime(isoDate: string | null): string {
  if (!isoDate) return 'Nessuna segnalazione';
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Segnalato ora';
  if (diffMin === 1) return 'Segnalato 1 minuto fa';
  if (diffMin < 60) return `Segnalato ${diffMin} minuti fa`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return 'Segnalato 1 ora fa';
  return `Segnalato ${diffHours} ore fa`;
}
