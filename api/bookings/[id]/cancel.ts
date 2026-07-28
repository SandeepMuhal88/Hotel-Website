import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings, dbRooms } from '../../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };
  const booking = dbBookings.find((b) => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status        = 'Cancelled';
  booking.paymentStatus = 'Refunded';

  const room = dbRooms.find((r: any) => r.id === booking.roomTypeId);
  if (room) room.availableUnits = Math.min(room.totalUnits, room.availableUnits + 1);

  res.json({ success: true, message: 'Booking cancelled successfully', booking });
}
