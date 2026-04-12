import { getOpenAI } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required and must be a non-empty string' }, { status: 400 });
    }

    if (text.length > 4000) {
      return NextResponse.json({ error: 'Text is too long. Maximum 4000 characters allowed.' }, { status: 400 });
    }

    const openai = getOpenAI();
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
