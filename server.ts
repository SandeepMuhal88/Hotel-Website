import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_ROOMS, RESORT_INFO, ADD_ONS, RESORT_REVIEWS } from './src/data/resortData.js';
import { Room, Booking, UserProfile, Inquiry } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
let dbRooms: Room[] = [...INITIAL_ROOMS];

let dbUsers: Record<string, UserProfile> = {
  "+919876543210": {
    id: "usr-demo-1",
    mobileNumber: "+919876543210",
    name: "Vikramaditya Singh",
    email: "vikram@example.com",
    idType: "Aadhar",
    idNumber: "XXXX-XXXX-8921",
    preferences: {
      bedPreference: "King",
      dietaryPreference: "Vegetarian",
      floorPreference: "Ground Floor Cottage",
      purposeOfVisit: "Romantic Getaway",
      specialNotes: "Prefer a quiet cottage near the swimming pool."
    },
    createdAt: new Date().toISOString()
  }
};

let dbOtpCodes: Record<string, string> = {
  "+919876543210": "123456"
};

let dbBookings: Booking[] = [
  {
    id: "bok-1001",
    bookingNumber: "LCR-98412",
    userId: "usr-demo-1",
    roomTypeId: "deluxe-poolside-cottage",
    roomTypeName: "Deluxe Poolside Cottage",
    roomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    checkIn: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    nights: 2,
    guests: { adults: 2, children: 0 },
    guestName: "Vikramaditya Singh",
    guestPhone: "+919876543210",
    guestEmail: "vikram@example.com",
    specialRequests: "Anniversary setup with flowers if possible.",
    addOns: [
      { id: "desert-safari", name: "Pushkar Desert Camel & Jeep Safari", price: 1500, quantity: 1 }
    ],
    roomSubtotal: 5610,
    taxesAndFees: 673,
    discount: 0,
    totalAmount: 7783,
    paymentStatus: "Paid",
    paymentMethod: "UPI / QR Code",
    paymentTransactionId: "UPI982341029311",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let dbInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Rajesh Mittal",
    mobile: "+919811223344",
    email: "rajesh@mittal.com",
    type: "Wedding & Events",
    message: "Hello, looking to book 12 rooms and lawn space for a intimate destination pre-wedding ceremony in Pushkar next month.",
    guestsCount: 30,
    preferredDates: "Aug 15 - Aug 18",
    status: "New",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Initialize Gemini SDK
const getGeminiAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// -------------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', resort: RESORT_INFO.name, timestamp: new Date().toISOString() });
});

// Mobile Auth: Send OTP
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  let { mobileNumber } = req.body;
  if (!mobileNumber) {
    res.status(400).json({ error: 'Mobile number is required' });
    return;
  }

  // Format mobile number with country code if missing
  if (!mobileNumber.startsWith('+')) {
    mobileNumber = `+91${mobileNumber.replace(/\D/g, '')}`;
  }

  // Generate 6 digit OTP (use 123456 as easy instant default for demo testing)
  const otpCode = mobileNumber === '+919876543210' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  dbOtpCodes[mobileNumber] = otpCode;

  res.json({
    success: true,
    message: `OTP sent successfully to ${mobileNumber}`,
    mobileNumber,
    // Provide sample/simulated OTP in response for testing ease
    simulatedOtp: otpCode
  });
});

// Mobile Auth: Verify OTP
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  let { mobileNumber, otp, name, email } = req.body;
  if (!mobileNumber || !otp) {
    res.status(400).json({ error: 'Mobile number and OTP are required' });
    return;
  }

  if (!mobileNumber.startsWith('+')) {
    mobileNumber = `+91${mobileNumber.replace(/\D/g, '')}`;
  }

  const storedOtp = dbOtpCodes[mobileNumber];
  // Allow test OTP 123456 as fallback for easy demo
  if (otp !== storedOtp && otp !== '123456') {
    res.status(400).json({ error: 'Invalid OTP code. Please try again.' });
    return;
  }

  // Get or Create User
  let user = dbUsers[mobileNumber];
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      mobileNumber,
      name: name || `Guest ${mobileNumber.slice(-4)}`,
      email: email || '',
      preferences: {
        bedPreference: 'King',
        dietaryPreference: 'Vegetarian',
        floorPreference: 'Ground Floor Cottage',
        purposeOfVisit: 'Leisure',
        specialNotes: ''
      },
      createdAt: new Date().toISOString()
    };
    dbUsers[mobileNumber] = user;
  } else if (name || email) {
    if (name) user.name = name;
    if (email) user.email = email;
  }

  delete dbOtpCodes[mobileNumber];

  res.json({
    success: true,
    user,
    token: `token-${user.id}-${Date.now()}`
  });
});

// User Profile & Preferences
app.get('/api/user/profile/:mobileNumber', (req: Request, res: Response) => {
  const { mobileNumber } = req.params;
  const user = dbUsers[mobileNumber];
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user });
});

app.put('/api/user/preferences', (req: Request, res: Response) => {
  const { mobileNumber, name, email, idType, idNumber, preferences } = req.body;
  if (!mobileNumber || !dbUsers[mobileNumber]) {
    res.status(404).json({ error: 'User profile not found' });
    return;
  }

  const user = dbUsers[mobileNumber];
  if (name) user.name = name;
  if (email) user.email = email;
  if (idType) user.idType = idType;
  if (idNumber) user.idNumber = idNumber;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  res.json({ success: true, user });
});

// Rooms List & Real-time Availability
app.get('/api/rooms', (req: Request, res: Response) => {
  res.json({ rooms: dbRooms });
});

app.post('/api/rooms/check-availability', (req: Request, res: Response) => {
  const { checkIn, checkOut, guestsCount } = req.body;

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Calculate live available units per room type
  const availableRooms = dbRooms.map(room => {
    // Count existing bookings that overlap with dates
    const overlappingBookings = dbBookings.filter(b => {
      if (b.roomTypeId !== room.id || b.status === 'Cancelled') return false;
      if (!checkIn || !checkOut) return false;
      return (new Date(checkIn) < new Date(b.checkOut) && new Date(checkOut) > new Date(b.checkIn));
    }).length;

    const currentAvailable = Math.max(0, room.totalUnits - overlappingBookings);
    return {
      ...room,
      availableUnits: currentAvailable,
      calculatedNights: nights,
      totalRoomPrice: room.price * nights
    };
  });

  res.json({
    checkIn,
    checkOut,
    nights,
    guestsCount: guestsCount || 2,
    rooms: availableRooms
  });
});

// Bookings: List User Bookings
app.get('/api/bookings/user/:mobileNumber', (req: Request, res: Response) => {
  const { mobileNumber } = req.params;
  const userBookings = dbBookings.filter(b => b.guestPhone === mobileNumber || (dbUsers[mobileNumber] && b.userId === dbUsers[mobileNumber].id));
  res.json({ bookings: userBookings });
});

// Bookings: Create New Booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    userId,
    roomTypeId,
    checkIn,
    checkOut,
    guests,
    guestName,
    guestPhone,
    guestEmail,
    specialRequests,
    selectedAddOns,
    paymentMethod
  } = req.body;

  if (!roomTypeId || !checkIn || !checkOut || !guestPhone || !guestName) {
    res.status(400).json({ error: 'Missing required booking parameters' });
    return;
  }

  const room = dbRooms.find(r => r.id === roomTypeId);
  if (!room) {
    res.status(404).json({ error: 'Selected room category not found' });
    return;
  }

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const roomSubtotal = room.price * nights;

  // Process Add-Ons
  let addOnsTotal = 0;
  const processedAddOns = (selectedAddOns || []).map((addonItem: any) => {
    const addon = ADD_ONS.find(a => a.id === addonItem.id);
    if (!addon) return null;
    const price = addon.perNight ? addon.price * nights : addon.price;
    const qty = addonItem.quantity || 1;
    addOnsTotal += price * qty;
    return {
      id: addon.id,
      name: addon.name,
      price: price,
      quantity: qty
    };
  }).filter(Boolean);

  const subtotalBeforeTax = roomSubtotal + addOnsTotal;
  const taxesAndFees = Math.round(subtotalBeforeTax * 0.12); // 12% GST
  const totalAmount = subtotalBeforeTax + taxesAndFees;

  const bookingNumber = `LCR-${Math.floor(10000 + Math.random() * 90000)}`;
  const paymentTransactionId = `TXN-${paymentMethod ? paymentMethod.substring(0, 3).toUpperCase() : 'PAY'}-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newBooking: Booking = {
    id: `bok-${Date.now()}`,
    bookingNumber,
    userId: userId || `usr-guest-${Date.now()}`,
    roomTypeId: room.id,
    roomTypeName: room.name,
    roomImage: room.images[0],
    checkIn,
    checkOut,
    nights,
    guests: guests || { adults: 2, children: 0 },
    guestName,
    guestPhone,
    guestEmail: guestEmail || '',
    specialRequests: specialRequests || '',
    addOns: processedAddOns,
    roomSubtotal,
    taxesAndFees,
    discount: 0,
    totalAmount,
    paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pay at Hotel Deposit' : 'Paid',
    paymentMethod: paymentMethod || 'UPI / QR Code',
    paymentTransactionId,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  dbBookings.unshift(newBooking);

  // Update available units in memory
  if (room.availableUnits > 0) {
    room.availableUnits -= 1;
  }

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking: newBooking
  });
});

// Bookings: Cancel Booking
app.put('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = dbBookings.find(b => b.id === id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  booking.status = 'Cancelled';
  booking.paymentStatus = 'Refunded';

  // Restore room unit
  const room = dbRooms.find(r => r.id === booking.roomTypeId);
  if (room) {
    room.availableUnits = Math.min(room.totalUnits, room.availableUnits + 1);
  }

  res.json({ success: true, message: 'Booking cancelled successfully', booking });
});

// Inquiries: Submit Contact / Group Inquiry
app.post('/api/inquiries', (req: Request, res: Response) => {
  const { name, mobile, email, type, message, guestsCount, preferredDates } = req.body;
  if (!name || !mobile || !message) {
    res.status(400).json({ error: 'Name, mobile number, and message are required' });
    return;
  }

  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name,
    mobile,
    email: email || '',
    type: type || 'General',
    message,
    guestsCount: guestsCount ? Number(guestsCount) : undefined,
    preferredDates: preferredDates || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  dbInquiries.unshift(newInquiry);
  res.status(201).json({ success: true, message: 'Your inquiry has been submitted! Our reservation desk will call you shortly.', inquiry: newInquiry });
});

// Admin: Get Dashboard Stats
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalRevenue = dbBookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalBookings = dbBookings.length;
  const activeInquiries = dbInquiries.filter(i => i.status === 'New').length;

  const totalCapacity = dbRooms.reduce((sum, r) => sum + r.totalUnits, 0);
  const totalAvailable = dbRooms.reduce((sum, r) => sum + r.availableUnits, 0);
  const occupiedUnits = totalCapacity - totalAvailable;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedUnits / totalCapacity) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const checkInsToday = dbBookings.filter(b => b.checkIn === todayStr && b.status !== 'Cancelled').length;

  res.json({
    totalRevenue,
    totalBookings,
    occupancyRate,
    checkInsToday,
    pendingInquiriesCount: activeInquiries,
    activeGuestsCount: dbBookings.filter(b => b.status === 'Checked-In' || b.status === 'Confirmed').length
  });
});

// Admin: Manage Bookings
app.get('/api/admin/bookings', (req: Request, res: Response) => {
  res.json({ bookings: dbBookings });
});

app.put('/api/admin/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const booking = dbBookings.find(b => b.id === id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  res.json({ success: true, booking });
});

// Admin: Manage Rooms
app.put('/api/admin/rooms/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, availableUnits, totalUnits } = req.body;
  const room = dbRooms.find(r => r.id === id);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  if (price !== undefined) room.price = Number(price);
  if (availableUnits !== undefined) room.availableUnits = Number(availableUnits);
  if (totalUnits !== undefined) room.totalUnits = Number(totalUnits);

  res.json({ success: true, room });
});

// Admin: Manage Inquiries
app.get('/api/admin/inquiries', (req: Request, res: Response) => {
  res.json({ inquiries: dbInquiries });
});

app.put('/api/admin/inquiries/:id/reply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminReply, status } = req.body;
  const inquiry = dbInquiries.find(i => i.id === id);
  if (!inquiry) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  if (adminReply) inquiry.adminReply = adminReply;
  inquiry.status = status || 'Replied';

  res.json({ success: true, inquiry });
});

// AI Guest Concierge endpoint (Powered by Gemini)
app.post('/api/concierge/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const ai = getGeminiAI();
  if (!ai) {
    // Fallback response if GEMINI_API_KEY is not configured
    res.json({
      text: "Welcome to Las Cabanas Resort, Pushkar! I am Aanya, your resort host. How can I assist you today? You can ask me about room bookings, our swimming pool, organic breakfast, or nearby attractions like Pushkar Lake and Brahma Temple!"
    });
    return;
  }

  try {
    const prompt = `You are Aanya, the friendly and polite AI Concierge & Resort Host for Las Cabanas Resort in Pushkar, Rajasthan.
Resort Details:
- Name: Las Cabanas Resort, Pushkar
- Address: Ganahera, Motisar Road / Kharekhari Road area, Pushkar, Rajasthan - 305022
- Contact: +91 063672 76121
- Check-in: 12:00 PM / 2:00 PM | Check-out: 11:00 AM
- Distance to City Center: 3.2 km (~5 min drive)
- Popular Amenities: Swimming pool with kid splash area, free daily organic breakfast (poha, sandwiches, tea, lassi), free Wi-Fi, air-conditioned cottages, pet-friendly (🐶), private balconies and lawns, on-site dining, local shuttle.
- Nearby Landmarks: Old Rangji Temple (3.9 km), Pushkar Sacred Lake & 52 Ghats (4.3 km), Brahma Temple (3.5 km), Savitri Ropeway (4.0 km).
- Room Types: Deluxe Poolside Cottage (₹2,805), Royal Heritage Villa with Four-Poster Canopy Bed (₹3,850), Garden Family Suite Cottage (₹4,990), Luxury Sunset Cabana with Plunge Tub (₹5,600).

User Question: ${message}

Answer warmly, concisely, and accurately in a welcoming hotel hospitality tone. You can reply in English or Hindi as requested by the guest. Do not give fake information outside resort facts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({
      text: response.text || "I'd be happy to assist you with your stay at Las Cabanas Resort! Please let me know how I can help."
    });
  } catch (err: any) {
    console.error('Gemini Concierge error:', err);
    res.json({
      text: "Namaste! Las Cabanas Resort is delighted to welcome you to Pushkar. You can reach our front desk directly at +91 063672 76121 or ask me about our swimming pool, deluxe cottages, and organic breakfast!"
    });
  }
});

// -------------------------------------------------------------------
// VITE MIDDLEWARE & SERVER INITIALIZATION
// -------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏨 Las Cabanas Resort Server running at http://localhost:${PORT}`);
  });
}

startServer();
