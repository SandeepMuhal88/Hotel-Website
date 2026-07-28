import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const FALLBACK =
  'Namaste! Welcome to Las Cabanas Resort, Pushkar! I am Aanya, your resort host. How can I assist you today? You can ask me about room bookings, our swimming pool, organic breakfast, or nearby attractions like Pushkar Lake and Brahma Temple!';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.json({ text: FALLBACK });

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'las-cabanas-resort' } },
    });

    const prompt = `You are Aanya, the friendly and polite AI Concierge & Resort Host for Las Cabanas Resort in Pushkar, Rajasthan.
Resort Details:
- Name: Las Cabanas Resort, Pushkar
- Address: Ganahera, Motisar Road, Pushkar, Rajasthan - 305022
- Contact: +91 063672 76121 | Check-in: 12 PM | Check-out: 11 AM
- Distance to City: 3.2 km (~5 min drive)
- Amenities: Swimming pool, free organic breakfast, free Wi-Fi, AC cottages, pet-friendly, private balconies, on-site dining, local shuttle.
- Nearby: Pushkar Sacred Lake & 52 Ghats (4.3 km), Brahma Temple (3.5 km), Savitri Ropeway (4 km).
- Rooms: Deluxe Poolside Cottage (₹2,805), Royal Heritage Villa (₹3,850), Garden Family Suite (₹4,990), Luxury Sunset Cabana (₹5,600).

User Question: ${message}

Answer warmly and concisely in a welcoming hotel hospitality tone. Reply in English or Hindi as requested. Do not fabricate information.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
    res.json({ text: response.text || FALLBACK });
  } catch (err) {
    console.error('Gemini error:', err);
    res.json({ text: FALLBACK });
  }
}
