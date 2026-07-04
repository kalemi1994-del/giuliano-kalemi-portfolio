import { useState, type FormEvent } from 'react';
import { formatDateLong, isWeekend } from '../utils/season';

interface BookingFormProps {
  date: Date;
  umbrellaId: number;
  price: number;
  onSubmit: (data: { customerName: string; phone: string; note: string }) => void;
  onCancel: () => void;
}

export default function BookingForm({ date, umbrellaId, price, onSubmit, onCancel }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Inserisci il tuo nome per completare la prenotazione.');
      return;
    }
    setError('');
    onSubmit({ customerName: customerName.trim(), phone: phone.trim(), note: note.trim() });
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>
        Prenota l'ombrellone n. {umbrellaId}
      </h3>
      <p className="booking-form__date">{formatDateLong(date)}</p>

      <label>
        Nome e cognome *
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Es. Maria Rossi"
        />
      </label>

      <label>
        Telefono
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Es. 333 1234567"
        />
      </label>

      <label>
        Note (indicazioni o informazioni)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Es. arriviamo verso le 10, preferiamo un ombrellone vicino all'ombra, siamo in 4..."
          rows={3}
        />
      </label>

      {error && <p className="booking-form__error">{error}</p>}

      <div className="booking-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Annulla
        </button>
        <button type="submit" className="btn btn--primary">
          Conferma prenotazione
        </button>
      </div>

      <p className="booking-form__price">
        Costo: <strong>€{price}</strong> {isWeekend(date) ? '(tariffa weekend)' : '(tariffa feriale)'} — pagamento in
        spiaggia
      </p>
    </form>
  );
}
