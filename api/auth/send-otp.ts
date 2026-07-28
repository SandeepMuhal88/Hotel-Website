import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbOtpCodes } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let { mobileNumber } = req.body;
  if (!mobileNumber) return res.status(400).json({ error: 'Mobile number is required' });

  if (!mobileNumber.startsWith('+')) {
    mobileNumber = `+91${mobileNumber.replace(/\D/g, '')}`;
  }

  const otpCode =
    mobileNumber === '+919876543210'
      ? '123456'
      : Math.floor(100000 + Math.random() * 900000).toString();

  dbOtpCodes[mobileNumber] = otpCode;

  res.json({
    success: true,
    message: `OTP sent successfully to ${mobileNumber}`,
    mobileNumber,
    simulatedOtp: otpCode, // visible for demo / testing
  });
}
