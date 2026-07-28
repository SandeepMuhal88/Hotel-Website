import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings, dbUsers } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { mobileNumber } = req.query as { mobileNumber: string };
  const userBookings = dbBookings.filter(
    (b) =>
      b.guestPhone === mobileNumber ||
      (dbUsers[mobileNumber] && b.userId === dbUsers[mobileNumber].id)
  );
  res.json({ bookings: userBookings });
}
