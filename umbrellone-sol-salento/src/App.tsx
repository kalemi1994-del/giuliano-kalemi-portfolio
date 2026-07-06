import { useMemo, useState } from 'react';
import UmbrellaGrid from './components/UmbrellaGrid';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';
import type { Booking } from './types';
import { addBooking, loadBookings, removeBooking } from './utils/storage';
import {
  formatDateInput,
  getMinBookableDate,
  getSeasonRange,
  parseDateInput,
  priceForDate,
} from './utils/season';

export default function App() {
  const { start: seasonStart, end: seasonEnd } = useMemo(() => getSeasonRange(), []);
  const minDate = useMemo(() => getMinBookableDate(), []);

  const [selectedDateValue, setSelectedDateValue] = useState(formatDateInput(minDate));
  const [selectedUmbrellaId, setSelectedUmbrellaId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [confirmation, setConfirmation] = useState('');

  const selectedDate = parseDateInput(selectedDateValue);
  const price = priceForDate(selectedDate);

  const bookedIdsForDate = useMemo(() => {
    const ids = bookings.filter((b) => b.date === selectedDateValue).map((b) => b.umbrellaId);
    return new Set(ids);
  }, [bookings, selectedDateValue]);

  function handleDateChange(value: string) {
    setSelectedDateValue(value);
    setSelectedUmbrellaId(null);
    setConfirmation('');
  }

  function handleSelectUmbrella(id: number) {
    setSelectedUmbrellaId(id);
    setConfirmation('');
  }

  function handleSubmitBooking(data: { customerName: string; phone: string; note: string }) {
    if (selectedUmbrellaId === null) return;
    const booking: Booking = {
      id: crypto.randomUUID(),
      umbrellaId: selectedUmbrellaId,
      date: selectedDateValue,
      customerName: data.customerName,
      phone: data.phone,
      note: data.note,
      price,
      createdAt: new Date().toISOString(),
    };
    const updated = addBooking(booking);
    setBookings(updated);
    setSelectedUmbrellaId(null);
    setConfirmation(
      `Prenotazione confermata: ombrellone ${booking.umbrellaId} per il ${selectedDate.toLocaleDateString('it-IT')}.`,
    );
  }

  function handleCancelBooking(id: string) {
    setBookings(removeBooking(id));
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>🏖️ Umbrellone del Sol Salento</h1>
        <p>20 ombrelloni in prima fila sul mare, prenotabili online per tutta la stagione balneare.</p>
        <p className="hero__season">
          Stagione: {seasonStart.toLocaleDateString('it-IT')} — {seasonEnd.toLocaleDateString('it-IT')}
        </p>
      </header>

      <main className="content">
        <section className="date-picker">
          <label htmlFor="booking-date">Scegli la data</label>
          <input
            id="booking-date"
            type="date"
            value={selectedDateValue}
            min={formatDateInput(minDate)}
            max={formatDateInput(seasonEnd)}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </section>

        {confirmation && <div className="confirmation">{confirmation}</div>}

        <UmbrellaGrid
          bookedIds={bookedIdsForDate}
          selectedId={selectedUmbrellaId}
          onSelect={handleSelectUmbrella}
        />

        {selectedUmbrellaId !== null && (
          <BookingForm
            date={selectedDate}
            umbrellaId={selectedUmbrellaId}
            price={price}
            onSubmit={handleSubmitBooking}
            onCancel={() => setSelectedUmbrellaId(null)}
          />
        )}

        <BookingsList bookings={bookings} onCancel={handleCancelBooking} />
      </main>

      <footer className="footer">
        <p>Umbrellone del Sol Salento — demo di prenotazione, dati salvati solo su questo browser.</p>
      </footer>
    </div>
  );
}
