import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbBookings, dbUsers, dbRooms, ADD_ONS } from '../_data.js';
import type { Booking } from '../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // GET /api/bookings  (admin convenience — all bookings)
  if (req.method === 'GET') {
    return res.json({ bookings: dbBookings });
  }

  // POST /api/bookings  (create booking)
  if (req.method === 'POST') {
    const {
      userId, roomTypeId, checkIn, checkOut, guests,
      guestName, guestPhone, guestEmail, specialRequests,
      selectedAddOns, paymentMethod,
    } = req.body;

    if (!roomTypeId || !checkIn || !checkOut || !guestPhone || !guestName) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    const room = dbRooms.find((r: any) => r.id === roomTypeId);
    if (!room) return res.status(404).json({ error: 'Selected room category not found' });

    const nights = Math.max(
      1,
      Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    );
    const roomSubtotal = room.price * nights;

    let addOnsTotal = 0;
    const processedAddOns = (selectedAddOns || [])
      .map((addonItem: any) => {
        const addon = ADD_ONS.find((a: any) => a.id === addonItem.id);
        if (!addon) return null;
        const price = addon.perNight ? addon.price * nights : addon.price;
        const qty   = addonItem.quantity || 1;
        addOnsTotal += price * qty;
        return { id: addon.id, name: addon.name, price, quantity: qty };
      })
      .filter(Boolean);

    const subtotalBeforeTax = roomSubtotal + addOnsTotal;
    const taxesAndFees      = Math.round(subtotalBeforeTax * 0.12);
    const totalAmount       = subtotalBeforeTax + taxesAndFees;

    const newBooking: Booking = {
      id:                   `bok-${Date.now()}`,
      bookingNumber:        `LCR-${Math.floor(10000 + Math.random() * 90000)}`,
      userId:               userId || `usr-guest-${Date.now()}`,
      roomTypeId:           room.id,
      roomTypeName:         room.name,
      roomImage:            room.images[0],
      checkIn,
      checkOut,
      nights,
      guests:               guests || { adults: 2, children: 0 },
      guestName,
      guestPhone,
      guestEmail:           guestEmail || '',
      specialRequests:      specialRequests || '',
      addOns:               processedAddOns,
      roomSubtotal,
      taxesAndFees,
      discount:             0,
      totalAmount,
      paymentStatus:        paymentMethod === 'Pay at Hotel' ? 'Pay at Hotel Deposit' : 'Paid',
      paymentMethod:        paymentMethod || 'UPI / QR Code',
      paymentTransactionId: `TXN-${Date.now()}`,
      status:               'Confirmed',
      createdAt:            new Date().toISOString(),
    };

    dbBookings.unshift(newBooking);
    if (room.availableUnits > 0) room.availableUnits -= 1;

    return res.status(201).json({ success: true, message: 'Booking confirmed!', booking: newBooking });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
