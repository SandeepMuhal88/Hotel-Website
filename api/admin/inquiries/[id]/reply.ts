import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbInquiries } from '../../../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };
  const { adminReply, status } = req.body;
  const inquiry = dbInquiries.find((i) => i.id === id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

  if (adminReply) inquiry.adminReply = adminReply;
  inquiry.status = status || 'Replied';

  res.json({ success: true, inquiry });
}
