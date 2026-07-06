import { ROWS, ZONES_PER_ROW, type ZoneState } from '../types';
import { formatRelativeTime } from '../utils/time';

interface ZoneMapProps {
  zoneStates: ZoneState[];
  selectedZoneId: string | null;
  onSelect: (zoneId: string) => void;
}

const STATUS_ICON: Record<string, string> = {
  molto_libero: '🟢',
  poco_spazio: '🟠',
  pieno: '🔴',
  sconosciuto: '⚪',
};

export default function ZoneMap({ zoneStates, selectedZoneId, onSelect }: ZoneMapProps) {
  return (
    <div className="zone-map">
      <div className="sea-label">🌊 mare</div>
      {ROWS.map((row) => {
        const rowZones = zoneStates.filter((zs) => zs.zone.row === row);
        return (
          <div key={row} className="zone-row-group">
            <div className="zone-row-label">{row}</div>
            <div className="zone-row" style={{ gridTemplateColumns: `repeat(${ZONES_PER_ROW}, 1fr)` }}>
              {rowZones.map((zs) => {
                const isSelected = zs.zone.id === selectedZoneId;
                return (
                  <button
                    key={zs.zone.id}
                    type="button"
                    className={`zone-tile zone-tile--${zs.currentStatus} ${isSelected ? 'zone-tile--selected' : ''}`}
                    onClick={() => onSelect(zs.zone.id)}
                  >
                    <span className="zone-tile__icon">{STATUS_ICON[zs.currentStatus]}</span>
                    <span className="zone-tile__name">{zs.zone.name}</span>
                    <span className="zone-tile__time">{formatRelativeTime(zs.lastReportAt)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="legend">
        <span className="legend-item">🟢 molto libero</span>
        <span className="legend-item">🟠 poco spazio</span>
        <span className="legend-item">🔴 pieno</span>
        <span className="legend-item">⚪ nessuna segnalazione recente</span>
      </div>
    </div>
  );
}
