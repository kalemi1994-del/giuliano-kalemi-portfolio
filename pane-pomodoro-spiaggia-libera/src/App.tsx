import { useCallback, useEffect, useState } from 'react';
import ZoneMap from './components/ZoneMap';
import ReportPanel from './components/ReportPanel';
import type { ZoneState, ZoneStatus } from './types';
import { fetchZones, submitReport } from './utils/api';
import { getDeviceId } from './utils/device';

const POLL_INTERVAL_MS = 8000;

export default function App() {
  const [zoneStates, setZoneStates] = useState<ZoneState[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [loadError, setLoadError] = useState('');
  const deviceId = getDeviceId();

  const loadZones = useCallback(async () => {
    try {
      const zones = await fetchZones();
      setZoneStates(zones);
      setLoadError('');
    } catch {
      setLoadError('Impossibile aggiornare le zone. Controlla la connessione.');
    }
  }, []);

  useEffect(() => {
    loadZones();
    const interval = setInterval(loadZones, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadZones]);

  const selectedZoneState = zoneStates.find((zs) => zs.zone.id === selectedZoneId) ?? null;

  async function handleSubmit(status: ZoneStatus, note: string) {
    if (!selectedZoneId) return;
    const updated = await submitReport(selectedZoneId, status, note, deviceId);
    setZoneStates(updated);
    setSelectedZoneId(null);
    setConfirmation('Grazie per la segnalazione! Aiuti chi arriva dopo di te.');
    setTimeout(() => setConfirmation(''), 4000);
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>🏖️ Pane e Pomodoro – Spazio Libero</h1>
        <p>
          App comunitaria per la spiaggia pubblica di Pane e Pomodoro: segnala e scopri dove c'è
          spazio prima di arrivare, per sapere subito dove piazzare il tuo ombrellone da casa.
        </p>
      </header>

      <main className="content">
        {confirmation && <div className="confirmation">{confirmation}</div>}
        {loadError && <div className="load-error">{loadError}</div>}

        <ZoneMap zoneStates={zoneStates} selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />

        {selectedZoneState && (
          <ReportPanel
            zoneState={selectedZoneState}
            onSubmit={handleSubmit}
            onClose={() => setSelectedZoneId(null)}
          />
        )}

        <p className="how-it-works">
          Come funziona: tocca una zona e segnala se c'è molto spazio, poco spazio o se è piena.
          Le segnalazioni sono condivise con tutti in tempo quasi reale e scadono dopo 45 minuti,
          così la mappa resta sempre aggiornata. La disposizione delle zone è schematica e
          indicativa, non una mappa GPS precisa della spiaggia.
        </p>
      </main>

      <footer className="footer">
        <p>Pane e Pomodoro – Spazio Libero — segnalazioni della community, non un servizio ufficiale.</p>
      </footer>
    </div>
  );
}
