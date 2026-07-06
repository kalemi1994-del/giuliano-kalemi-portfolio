import { TOTAL_UMBRELLAS } from '../types';

interface UmbrellaGridProps {
  bookedIds: Set<number>;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const ROWS = 4;
const COLS = TOTAL_UMBRELLAS / ROWS;

export default function UmbrellaGrid({ bookedIds, selectedId, onSelect }: UmbrellaGridProps) {
  const rows = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => r * COLS + c + 1),
  );

  return (
    <div className="umbrella-map">
      <div className="sea-label">🌊 mare</div>
      {rows.map((row, i) => (
        <div className="umbrella-row" key={i}>
          {row.map((id) => {
            const isBooked = bookedIds.has(id);
            const isSelected = selectedId === id;
            const className = [
              'umbrella',
              isBooked ? 'umbrella--booked' : 'umbrella--free',
              isSelected ? 'umbrella--selected' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={id}
                type="button"
                className={className}
                disabled={isBooked}
                onClick={() => onSelect(id)}
                title={isBooked ? `Ombrellone ${id} - occupato` : `Ombrellone ${id} - libero`}
              >
                <span className="umbrella-icon" aria-hidden="true">
                  ⛱️
                </span>
                <span className="umbrella-number">{id}</span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot--free" /> libero
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--selected" /> selezionato
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--booked" /> occupato
        </span>
      </div>
    </div>
  );
}
