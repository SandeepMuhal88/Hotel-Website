import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbInquiries } from '../_data.js';
import type { Inquiry } from '../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, mobile, email, type, message, guestsCount, preferredDates } = req.body;
  if (!name || !mobile || !message)
    return res.status(400).json({ error: 'Name, mobile number, and message are required' });

  const newInquiry: Inquiry = {
    id:             `inq-${Date.now()}`,
    name,
    mobile,
    email:          email || '',
    type:           type || 'General',
    message,
    guestsCount:    guestsCount ? Number(guestsCount) : undefined,
    preferredDates: preferredDates || '',
    status:         'New',
    createdAt:      new Date().toISOString(),
  };

  dbInquiries.unshift(newInquiry);
  res.status(201).json({
    success: true,
    message: 'Your inquiry has been submitted! Our reservation desk will call you shortly.',
    inquiry: newInquiry,
  });
}
