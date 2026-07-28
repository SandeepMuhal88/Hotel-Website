import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbUsers } from '../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { mobileNumber, name, email, idType, idNumber, preferences } = req.body;
  if (!mobileNumber || !dbUsers[mobileNumber])
    return res.status(404).json({ error: 'User profile not found' });

  const user = dbUsers[mobileNumber];
  if (name)        user.name        = name;
  if (email)       user.email       = email;
  if (idType)      user.idType      = idType;
  if (idNumber)    user.idNumber    = idNumber;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  res.json({ success: true, user });
}
