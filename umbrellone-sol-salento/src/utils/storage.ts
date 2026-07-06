import type { Booking } from '../types';

const STORAGE_KEY = 'sol-salento-bookings';

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: Booking): Booking[] {
  const bookings = [...loadBookings(), booking];
  saveBookings(bookings);
  return bookings;
}

export function removeBooking(id: string): Booking[] {
  const bookings = loadBookings().filter((b) => b.id !== id);
  saveBookings(bookings);
  return bookings;
}
