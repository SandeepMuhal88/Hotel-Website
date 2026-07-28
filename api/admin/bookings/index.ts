import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return res.json({ bookings: dbBookings });
  res.status(405).json({ error: 'Method not allowed' });
}
