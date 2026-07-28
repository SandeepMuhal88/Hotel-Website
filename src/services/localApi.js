/**
 * src/services/localApi.js
 *
 * Client-side mock API — replaces all /api/* fetch calls.
 * Data is stored in-memory (with localStorage backup for bookings/users).
 * Works perfectly on Vercel static deployment — no backend needed.
 */

import { INITIAL_ROOMS, ADD_ONS, RESORT_INFO } from '../data/resortData.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const loadLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveLS = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_BOOKING = {
  id: 'bok-1001',
  bookingNumber: 'LCR-98412',
  userId: 'usr-demo-1',
  roomTypeId: 'deluxe-poolside-cottage',
  roomTypeName: 'Deluxe Poolside Cottage',
  roomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  checkIn: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  nights: 2,
  guests: { adults: 2, children: 0 },
  guestName: 'Vikramaditya Singh',
  guestPhone: '+919876543210',
  guestEmail: 'vikram@example.com',
  specialRequests: 'Anniversary setup with flowers if possible.',
  addOns: [{ id: 'desert-safari', name: 'Pushkar Desert Camel & Jeep Safari', price: 1500, quantity: 1 }],
  roomSubtotal: 5610,
  taxesAndFees: 673,
  discount: 0,
  totalAmount: 7783,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI / QR Code',
  paymentTransactionId: 'UPI982341029311',
  status: 'Confirmed',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const SEED_INQUIRY = {
  id: 'inq-1',
  name: 'Rajesh Mittal',
  mobile: '+919811223344',
  email: 'rajesh@mittal.com',
  type: 'Wedding & Events',
  message: 'Looking to book 12 rooms for a pre-wedding ceremony in Pushkar.',
  guestsCount: 30,
  preferredDates: 'Aug 15 - Aug 18',
  status: 'New',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

const SEED_USER = {
  id: 'usr-demo-1',
  mobileNumber: '+919876543210',
  name: 'Vikramaditya Singh',
  email: 'vikram@example.com',
  preferences: {
    bedPreference: 'King',
    dietaryPreference: 'Vegetarian',
    floorPreference: 'Ground Floor Cottage',
    purposeOfVisit: 'Romantic Getaway',
    specialNotes: 'Prefer a quiet cottage near the swimming pool.',
  },
  createdAt: new Date().toISOString(),
};

// ── In-memory state (loaded from localStorage on first run) ───────────────────
let _rooms     = [...INITIAL_ROOMS];
let _bookings  = loadLS('lcr_bookings',  [SEED_BOOKING]);
let _inquiries = loadLS('lcr_inquiries', [SEED_INQUIRY]);
let _users     = loadLS('lcr_users',     { '+919876543210': SEED_USER });
let _otps      = {};

const persist = () => {
  saveLS('lcr_bookings',  _bookings);
  saveLS('lcr_inquiries', _inquiries);
  saveLS('lcr_users',     _users);
};

// ── AI Concierge — rule-based smart replies ───────────────────────────────────
const CONCIERGE_KB = [
  { keys: ['pool', 'swimming', 'swim'],          reply: '🏊 Our shimmering outdoor swimming pool is open 7 AM – 9 PM. It includes a children\'s splash zone and is surrounded by lush Rajasthani gardens. Towels and sun loungers are complimentary!' },
  { keys: ['breakfast', 'food', 'meal', 'eat'],  reply: '☕ A complimentary organic breakfast is served daily from 7 AM – 10 AM and includes poha, parathas, toast, fresh lassi, chai, and seasonal fruits. Pure vegetarian!' },
  { keys: ['wifi', 'internet', 'wi-fi'],          reply: '📶 Free high-speed Wi-Fi (100 Mbps) is available throughout the resort — in all cottages, pool area, and dining space.' },
  { keys: ['pet', 'dog', 'animal'],              reply: '🐶 Yes! Las Cabanas is pet-friendly. Small to medium dogs are welcome. We have a dedicated pet-play lawn and can provide food bowls on request.' },
  { keys: ['price', 'rate', 'cost', 'tariff', 'charge'], reply: '💰 Our room rates start from ₹2,805/night for a Deluxe Poolside Cottage. Royal Heritage Villa is ₹3,850, Garden Family Suite ₹4,990, and Luxury Sunset Cabana ₹5,600. All rates include free breakfast & pool access!' },
  { keys: ['pushkar lake', 'lake', 'brahma', 'temple'], reply: '🕌 Pushkar Sacred Lake & 52 Ghats is 4.3 km away (~8 min drive). Brahma Temple is 3.5 km, Savitri Ropeway is 4 km. We offer a complimentary local shuttle to Pushkar Bazaar!' },
  { keys: ['check in', 'checkin', 'check-in', 'arrival'], reply: '🏨 Check-in time is 12:00 PM (early check-in at 10 AM on availability). Check-out is 11:00 AM. Luggage storage is complimentary.' },
  { keys: ['book', 'reservation', 'reserve'],    reply: '📅 You can book directly on this website — just click "Book Cottage" in the header! For group bookings or events, call us at +91 063672 76121.' },
  { keys: ['location', 'address', 'where', 'how to reach', 'directions'], reply: '📍 We are at Ganahera Village, Motisar Road, Pushkar, Rajasthan 305022 — just 3.2 km from Pushkar City Center. From Pushkar Bus Stand, it\'s a 6-minute auto/cab ride.' },
  { keys: ['contact', 'phone', 'number', 'call'], reply: '📞 Reach our front desk 24/7 at +91 063672 76121. You can also WhatsApp us on the same number!' },
  { keys: ['wedding', 'event', 'party', 'group'], reply: '💍 We host intimate destination weddings, pre-wedding shoots, and group retreats! Our lawn accommodates up to 80 guests. Please use the Inquiry form on our website for custom packages.' },
  { keys: ['room', 'cottage', 'villa', 'suite', 'cabin'], reply: '🏡 We have 4 room types: Deluxe Poolside Cottage, Royal Heritage Villa (four-poster canopy bed!), Garden Family Suite, and Luxury Sunset Cabana (with private plunge tub). All are air-conditioned with private balconies.' },
  { keys: ['cancel', 'refund', 'policy'],         reply: '🔄 Cancellations made 48+ hours before check-in receive a full refund. Less than 48 hours — one night charge applies. Please contact us at +91 063672 76121 for assistance.' },
];

function aiReply(message) {
  const lower = message.toLowerCase();
  for (const { keys, reply } of CONCIERGE_KB) {
    if (keys.some((k) => lower.includes(k))) return reply;
  }
  return `Namaste! 🙏 I'm Aanya, your Las Cabanas concierge. I can help with swimming pool timings, breakfast menu, room rates, Pushkar sightseeing, pet policy, check-in/out times, and bookings. What would you like to know?`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** AUTH **/
export async function sendOtp(mobileNumber) {
  await delay(500);
  let mobile = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber.replace(/\D/g, '')}`;
  const otp = mobile === '+919876543210' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  _otps[mobile] = otp;
  return { success: true, mobileNumber: mobile, simulatedOtp: otp };
}

export async function verifyOtp(mobileNumber, otp, name, email) {
  await delay(600);
  let mobile = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber.replace(/\D/g, '')}`;
  const stored = _otps[mobile];
  if (otp !== stored && otp !== '123456') {
    return { success: false, error: 'Invalid OTP code. Please try again.' };
  }
  let user = _users[mobile];
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      mobileNumber: mobile,
      name: name || `Guest ${mobile.slice(-4)}`,
      email: email || '',
      preferences: { bedPreference: 'King', dietaryPreference: 'Vegetarian', floorPreference: 'Ground Floor Cottage', purposeOfVisit: 'Leisure', specialNotes: '' },
      createdAt: new Date().toISOString(),
    };
    _users[mobile] = user;
  } else {
    if (name)  user.name  = name;
    if (email) user.email = email;
  }
  delete _otps[mobile];
  persist();
  return { success: true, user };
}

/** ROOMS **/
export async function getRooms() {
  await delay(200);
  return { rooms: _rooms };
}

export async function checkAvailability(checkIn, checkOut, guestsCount) {
  await delay(300);
  let nights = 1;
  if (checkIn && checkOut) {
    nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  }
  const rooms = _rooms.map((r) => {
    const overlapping = _bookings.filter((b) =>
      b.roomTypeId === r.id && b.status !== 'Cancelled' && checkIn && checkOut &&
      new Date(checkIn) < new Date(b.checkOut) && new Date(checkOut) > new Date(b.checkIn)
    ).length;
    return { ...r, availableUnits: Math.max(0, r.totalUnits - overlapping), calculatedNights: nights, totalRoomPrice: r.price * nights };
  });
  return { checkIn, checkOut, nights, guestsCount: guestsCount || 2, rooms };
}

/** BOOKINGS **/
export async function createBooking({ userId, roomTypeId, checkIn, checkOut, guests, guestName, guestPhone, guestEmail, specialRequests, selectedAddOns, paymentMethod }) {
  await delay(800);
  const room = _rooms.find((r) => r.id === roomTypeId);
  if (!room) return { success: false, error: 'Room not found' };

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const roomSubtotal = room.price * nights;
  let addOnsTotal = 0;
  const addOns = (selectedAddOns || []).map((item) => {
    const addon = ADD_ONS.find((a) => a.id === item.id);
    if (!addon) return null;
    const price = addon.perNight ? addon.price * nights : addon.price;
    addOnsTotal += price * (item.quantity || 1);
    return { id: addon.id, name: addon.name, price, quantity: item.quantity || 1 };
  }).filter(Boolean);

  const subtotal    = roomSubtotal + addOnsTotal;
  const taxes       = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + taxes;

  const booking = {
    id: `bok-${Date.now()}`,
    bookingNumber: `LCR-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: userId || `usr-guest-${Date.now()}`,
    roomTypeId: room.id,
    roomTypeName: room.name,
    roomImage: room.images[0],
    checkIn, checkOut, nights,
    guests: guests || { adults: 2, children: 0 },
    guestName, guestPhone, guestEmail: guestEmail || '',
    specialRequests: specialRequests || '',
    addOns, roomSubtotal, taxesAndFees: taxes, discount: 0, totalAmount,
    paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pay at Hotel Deposit' : 'Paid',
    paymentMethod: paymentMethod || 'UPI / QR Code',
    paymentTransactionId: `TXN-${Date.now()}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  _bookings.unshift(booking);
  if (room.availableUnits > 0) room.availableUnits -= 1;
  persist();
  return { success: true, booking };
}

export async function getUserBookings(mobileNumber) {
  await delay(300);
  const user = _users[mobileNumber];
  const list = _bookings.filter((b) => b.guestPhone === mobileNumber || (user && b.userId === user.id));
  return { bookings: list };
}

export async function cancelBooking(id) {
  await delay(400);
  const booking = _bookings.find((b) => b.id === id);
  if (!booking) return { success: false, error: 'Not found' };
  booking.status = 'Cancelled';
  booking.paymentStatus = 'Refunded';
  const room = _rooms.find((r) => r.id === booking.roomTypeId);
  if (room) room.availableUnits = Math.min(room.totalUnits, room.availableUnits + 1);
  persist();
  return { success: true, booking };
}

/** INQUIRIES **/
export async function submitInquiry({ name, mobile, email, type, message, guestsCount, preferredDates }) {
  await delay(600);
  if (!name || !mobile || !message) return { success: false, error: 'Name, mobile, and message are required.' };
  const inquiry = {
    id: `inq-${Date.now()}`, name, mobile,
    email: email || '', type: type || 'General', message,
    guestsCount: guestsCount ? Number(guestsCount) : undefined,
    preferredDates: preferredDates || '',
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  _inquiries.unshift(inquiry);
  persist();
  return { success: true, inquiry };
}

/** USER PREFERENCES **/
export async function updatePreferences({ mobileNumber, name, email, idType, idNumber, preferences }) {
  await delay(400);
  if (!_users[mobileNumber]) return { success: false, error: 'User not found' };
  const user = _users[mobileNumber];
  if (name)        user.name        = name;
  if (email)       user.email       = email;
  if (idType)      user.idType      = idType;
  if (idNumber)    user.idNumber    = idNumber;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };
  persist();
  return { success: true, user };
}

/** ADMIN **/
export async function getAdminData() {
  await delay(400);
  const totalRevenue   = _bookings.filter((b) => b.status !== 'Cancelled').reduce((s, b) => s + b.totalAmount, 0);
  const totalCapacity  = _rooms.reduce((s, r) => s + r.totalUnits, 0);
  const totalAvailable = _rooms.reduce((s, r) => s + r.availableUnits, 0);
  const todayStr       = new Date().toISOString().split('T')[0];
  return {
    stats: {
      totalRevenue,
      totalBookings:         _bookings.length,
      occupancyRate:         totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0,
      checkInsToday:         _bookings.filter((b) => b.checkIn === todayStr && b.status !== 'Cancelled').length,
      pendingInquiriesCount: _inquiries.filter((i) => i.status === 'New').length,
      activeGuestsCount:     _bookings.filter((b) => b.status === 'Checked-In' || b.status === 'Confirmed').length,
    },
    bookings:  _bookings,
    rooms:     _rooms,
    inquiries: _inquiries,
  };
}

export async function updateBookingStatus(id, status) {
  await delay(300);
  const b = _bookings.find((b) => b.id === id);
  if (!b) return { success: false };
  b.status = status;
  persist();
  return { success: true, booking: b };
}

export async function updateRoom(id, { price, availableUnits, totalUnits }) {
  await delay(300);
  const room = _rooms.find((r) => r.id === id);
  if (!room) return { success: false };
  if (price          != null) room.price          = Number(price);
  if (availableUnits != null) room.availableUnits = Number(availableUnits);
  if (totalUnits     != null) room.totalUnits     = Number(totalUnits);
  return { success: true, room };
}

export async function replyInquiry(id, adminReply, status = 'Replied') {
  await delay(300);
  const inq = _inquiries.find((i) => i.id === id);
  if (!inq) return { success: false };
  inq.adminReply = adminReply;
  inq.status     = status;
  persist();
  return { success: true, inquiry: inq };
}

/** AI CONCIERGE **/
export async function conciergeChat(message) {
  await delay(700 + Math.random() * 500); // realistic typing delay
  return { text: aiReply(message) };
}
