import { getOpenAI } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, history } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required and must be a non-empty string' }, { status: 400 });
    }

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: 'History must be an array' }, { status: 400 });
    }

    const openai = getOpenAI();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a BDU (Bahir Dar University) English Professor. 
Your mission is to help Ethiopian graduates improve their English speaking for job readiness (e.g., interviews at CBE, Safaricom, or Ethio Telecom).

RULES:
1. Identify grammar errors (e.g., 'He go' -> 'He goes').
2. Explain the mistake simply and encouragingly.
3. If they use an Amharic word, provide the English equivalent (e.g., 'Sira' -> 'Work').
4. Keep the conversation relevant to the Ethiopian context (Culture, Business, Geography).
5. Always respond in English, but use Amharic for translations if requested.
6. Provide a 'Fluency Score' (0-10) for their last response.
7. Format your response into a JSON structure:
 {
   "correction": "The corrected text",
   "explanation": "Simple explanation of the fix",
   "amharicBridge": "Amharic translation of key words if relevant",
   "fluencyScore": score_number,
   "nextQuestion": "A follow-up question for the interview/conversation"
 }
`,
        },
        ...history,
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Brain Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
