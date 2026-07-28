import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbRooms, dbBookings } from '../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { checkIn, checkOut, guestsCount } = req.body;

  let nights = 1;
  if (checkIn && checkOut) {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const availableRooms = dbRooms.map((room: any) => {
    const overlappingBookings = dbBookings.filter((b) => {
      if (b.roomTypeId !== room.id || b.status === 'Cancelled') return false;
      if (!checkIn || !checkOut) return false;
      return new Date(checkIn) < new Date(b.checkOut) && new Date(checkOut) > new Date(b.checkIn);
    }).length;

    const currentAvailable = Math.max(0, room.totalUnits - overlappingBookings);
    return { ...room, availableUnits: currentAvailable, calculatedNights: nights, totalRoomPrice: room.price * nights };
  });

  res.json({ checkIn, checkOut, nights, guestsCount: guestsCount || 2, rooms: availableRooms });
}
