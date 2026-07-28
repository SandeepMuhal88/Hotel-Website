import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings } from '../../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };
  const { status, paymentStatus } = req.body;
  const booking = dbBookings.find((b) => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (status)        booking.status        = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  res.json({ success: true, booking });
}
