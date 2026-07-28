import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbUsers } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { mobileNumber } = req.query as { mobileNumber: string };
  const user = dbUsers[mobileNumber];
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user });
}
