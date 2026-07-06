import { useState } from 'react';
import { STATUS_LABELS, type ZoneState, type ZoneStatus } from '../types';

interface ReportPanelProps {
  zoneState: ZoneState;
  onSubmit: (status: ZoneStatus, note: string) => Promise<void>;
  onClose: () => void;
}

const STATUS_BUTTONS: { status: ZoneStatus; icon: string }[] = [
  { status: 'molto_libero', icon: '🟢' },
  { status: 'poco_spazio', icon: '🟠' },
  { status: 'pieno', icon: '🔴' },
];

export default function ReportPanel({ zoneState, onSubmit, onClose }: ReportPanelProps) {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleClick(status: ZoneStatus) {
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(status, note.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="report-panel">
      <div className="report-panel__header">
        <h3>{zoneState.zone.name}</h3>
        <button type="button" className="report-panel__close" onClick={onClose} aria-label="Chiudi">
          ✕
        </button>
      </div>
      <p className="report-panel__row">{zoneState.zone.row}</p>

      <p className="report-panel__prompt">Com'è la situazione qui adesso?</p>
      <div className="report-panel__buttons">
        {STATUS_BUTTONS.map(({ status, icon }) => (
          <button
            key={status}
            type="button"
            className="status-btn"
            disabled={submitting}
            onClick={() => handleClick(status)}
          >
            <span>{icon}</span>
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <label className="report-panel__note-label">
        Nota (facoltativa)
        <input
          type="text"
          value={note}
          maxLength={200}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Es. poca ombra, vicino ai giochi, molto vento..."
        />
      </label>

      {error && <p className="report-panel__error">{error}</p>}
    </div>
  );
}
