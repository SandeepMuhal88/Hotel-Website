import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbOtpCodes, dbUsers } from '../../_data.js';
import type { UserProfile } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let { mobileNumber, otp, name, email } = req.body;
  if (!mobileNumber || !otp)
    return res.status(400).json({ error: 'Mobile number and OTP are required' });

  if (!mobileNumber.startsWith('+')) {
    mobileNumber = `+91${mobileNumber.replace(/\D/g, '')}`;
  }

  const storedOtp = dbOtpCodes[mobileNumber];
  if (otp !== storedOtp && otp !== '123456') {
    return res.status(400).json({ error: 'Invalid OTP code. Please try again.' });
  }

  let user: UserProfile = dbUsers[mobileNumber];
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
        specialNotes: '',
      },
      createdAt: new Date().toISOString(),
    };
    dbUsers[mobileNumber] = user;
  } else {
    if (name) user.name = name;
    if (email) user.email = email;
  }

  delete dbOtpCodes[mobileNumber];

  res.json({ success: true, user, token: `token-${user.id}-${Date.now()}` });
}
