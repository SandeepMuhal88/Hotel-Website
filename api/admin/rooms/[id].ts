import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbRooms } from '../../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };
  const { price, availableUnits, totalUnits } = req.body;
  const room = dbRooms.find((r: any) => r.id === id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  if (price          !== undefined) room.price          = Number(price);
  if (availableUnits !== undefined) room.availableUnits = Number(availableUnits);
  if (totalUnits     !== undefined) room.totalUnits     = Number(totalUnits);

  res.json({ success: true, room });
}
