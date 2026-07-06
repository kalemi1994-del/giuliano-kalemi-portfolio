import express from 'express';
import { createServer as createViteServer } from 'vite';
import { v4 as uuidv4 } from 'uuid';
import type { Report, ZoneStatus } from '../src/types';
import { appendReport, loadReports } from './store';
import { computeZoneStates, getZoneById, isRateLimited } from './zoneState';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3010;
const VALID_STATUSES: ZoneStatus[] = ['molto_libero', 'poco_spazio', 'pieno'];

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/zones', (_req, res) => {
    const reports = loadReports();
    res.json({ zones: computeZoneStates(reports) });
  });

  app.post('/api/zones/:zoneId/reports', (req, res) => {
    const { zoneId } = req.params;
    const { status, note, deviceId } = req.body ?? {};

    if (!getZoneById(zoneId)) {
      return res.status(404).json({ error: 'Zona non trovata.' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Stato non valido.' });
    }
    if (typeof deviceId !== 'string' || !deviceId) {
      return res.status(400).json({ error: 'deviceId mancante.' });
    }

    const reports = loadReports();
    if (isRateLimited(reports, zoneId, deviceId)) {
      return res.status(429).json({ error: 'Hai già segnalato questa zona da poco. Riprova tra un minuto.' });
    }

    const report: Report = {
      id: uuidv4(),
      zoneId,
      status,
      note: typeof note === 'string' ? note.trim().slice(0, 200) : '',
      deviceId,
      createdAt: new Date().toISOString(),
    };
    const updated = appendReport(report);
    res.status(201).json({ zones: computeZoneStates(updated) });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
