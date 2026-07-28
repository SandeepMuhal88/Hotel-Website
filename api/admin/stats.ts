import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings, dbRooms, dbInquiries } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const totalRevenue = dbBookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalCapacity  = dbRooms.reduce((s: number, r: any) => s + r.totalUnits, 0);
  const totalAvailable = dbRooms.reduce((s: number, r: any) => s + r.availableUnits, 0);
  const occupiedUnits  = totalCapacity - totalAvailable;
  const occupancyRate  = totalCapacity > 0 ? Math.round((occupiedUnits / totalCapacity) * 100) : 0;

  const todayStr      = new Date().toISOString().split('T')[0];
  const checkInsToday = dbBookings.filter((b) => b.checkIn === todayStr && b.status !== 'Cancelled').length;

  res.json({
    totalRevenue,
    totalBookings:          dbBookings.length,
    occupancyRate,
    checkInsToday,
    pendingInquiriesCount:  dbInquiries.filter((i) => i.status === 'New').length,
    activeGuestsCount:      dbBookings.filter((b) => b.status === 'Checked-In' || b.status === 'Confirmed').length,
  });
}
