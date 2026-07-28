/**
 * api/_data.ts
 * Shared in-memory data store for all Vercel serverless functions.
 * NOTE: Data resets on cold starts (stateless serverless).
 * For production, replace with a real DB (Vercel Postgres / MongoDB Atlas).
 */

import { INITIAL_ROOMS, ADD_ONS, RESORT_INFO } from '../src/data/resortData.js';

// ── Types (inlined to avoid import issues in serverless) ──────────────────────
export interface UserPreferences {
  bedPreference?: string;
  dietaryPreference?: string;
  floorPreference?: string;
  purposeOfVisit?: string;
  specialNotes?: string;
}

export interface UserProfile {
  id: string;
  mobileNumber: string;
  name: string;
  email: string;
  idType?: string;
  idNumber?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  roomTypeId: string;
  roomTypeName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: { adults: number; children: number };
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialRequests: string;
  addOns: BookingAddOn[];
  roomSubtotal: number;
  taxesAndFees: number;
  discount: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentTransactionId: string;
  status: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  type: string;
  message: string;
  guestsCount?: number;
  preferredDates?: string;
  status: string;
  adminReply?: string;
  createdAt: string;
}

// ── Singleton state (per serverless instance) ─────────────────────────────────

// Use global to persist across hot-reloads in dev; Vercel will reset between cold starts anyway
declare global {
  // eslint-disable-next-line no-var
  var __lcr_rooms: any[] | undefined;
  var __lcr_users: Record<string, UserProfile> | undefined;
  var __lcr_otps: Record<string, string> | undefined;
  var __lcr_bookings: Booking[] | undefined;
  var __lcr_inquiries: Inquiry[] | undefined;
}

if (!global.__lcr_rooms) {
  global.__lcr_rooms = [...INITIAL_ROOMS];
}
if (!global.__lcr_users) {
  global.__lcr_users = {
    '+919876543210': {
      id: 'usr-demo-1',
      mobileNumber: '+919876543210',
      name: 'Vikramaditya Singh',
      email: 'vikram@example.com',
      idType: 'Aadhar',
      idNumber: 'XXXX-XXXX-8921',
      preferences: {
        bedPreference: 'King',
        dietaryPreference: 'Vegetarian',
        floorPreference: 'Ground Floor Cottage',
        purposeOfVisit: 'Romantic Getaway',
        specialNotes: 'Prefer a quiet cottage near the swimming pool.',
      },
      createdAt: new Date().toISOString(),
    },
  };
}
if (!global.__lcr_otps) {
  global.__lcr_otps = { '+919876543210': '123456' };
}
if (!global.__lcr_bookings) {
  global.__lcr_bookings = [
    {
      id: 'bok-1001',
      bookingNumber: 'LCR-98412',
      userId: 'usr-demo-1',
      roomTypeId: 'deluxe-poolside-cottage',
      roomTypeName: 'Deluxe Poolside Cottage',
      roomImage:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      checkIn: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      nights: 2,
      guests: { adults: 2, children: 0 },
      guestName: 'Vikramaditya Singh',
      guestPhone: '+919876543210',
      guestEmail: 'vikram@example.com',
      specialRequests: 'Anniversary setup with flowers if possible.',
      addOns: [
        { id: 'desert-safari', name: 'Pushkar Desert Camel & Jeep Safari', price: 1500, quantity: 1 },
      ],
      roomSubtotal: 5610,
      taxesAndFees: 673,
      discount: 0,
      totalAmount: 7783,
      paymentStatus: 'Paid',
      paymentMethod: 'UPI / QR Code',
      paymentTransactionId: 'UPI982341029311',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];
}
if (!global.__lcr_inquiries) {
  global.__lcr_inquiries = [
    {
      id: 'inq-1',
      name: 'Rajesh Mittal',
      mobile: '+919811223344',
      email: 'rajesh@mittal.com',
      type: 'Wedding & Events',
      message:
        'Hello, looking to book 12 rooms and lawn space for an intimate destination pre-wedding ceremony in Pushkar next month.',
      guestsCount: 30,
      preferredDates: 'Aug 15 - Aug 18',
      status: 'New',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export const dbRooms       = global.__lcr_rooms!;
export const dbUsers       = global.__lcr_users!;
export const dbOtpCodes    = global.__lcr_otps!;
export const dbBookings    = global.__lcr_bookings!;
export const dbInquiries   = global.__lcr_inquiries!;
export { ADD_ONS, RESORT_INFO };
