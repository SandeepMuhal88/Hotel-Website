import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbInquiries } from '../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return res.json({ inquiries: dbInquiries });
  res.status(405).json({ error: 'Method not allowed' });
}
