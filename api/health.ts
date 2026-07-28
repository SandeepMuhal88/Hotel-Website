import type { VercelRequest, VercelResponse } from '@vercel/node';
import { RESORT_INFO } from '../_data.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ status: 'ok', resort: RESORT_INFO.name, timestamp: new Date().toISOString() });
}
