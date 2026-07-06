export interface Booking {
  id: string;
  umbrellaId: number;
  date: string; // YYYY-MM-DD
  customerName: string;
  phone: string;
  note: string;
  price: number;
  createdAt: string;
}

export const TOTAL_UMBRELLAS = 20;
