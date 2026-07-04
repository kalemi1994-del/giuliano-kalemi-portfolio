import type { Booking } from '../types';
import { parseDateInput, formatDateLong } from '../utils/season';

interface BookingsListProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
}

export default function BookingsList({ bookings, onCancel }: BookingsListProps) {
  if (bookings.length === 0) {
    return null;
  }

  const sorted = [...bookings].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="bookings-list">
      <h2>Le mie prenotazioni</h2>
      <ul>
        {sorted.map((b) => (
          <li key={b.id} className="bookings-list__item">
            <div>
              <strong>Ombrellone {b.umbrellaId}</strong> — {formatDateLong(parseDateInput(b.date))}
              <div className="bookings-list__customer">{b.customerName}</div>
              {b.note && <div className="bookings-list__note">Nota: {b.note}</div>}
            </div>
            <div className="bookings-list__side">
              <span className="bookings-list__price">€{b.price}</span>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => onCancel(b.id)}>
                Cancella
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
