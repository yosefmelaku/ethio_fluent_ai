import { getOpenAI } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history } = body;

    if (!Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: 'History is required and must be a non-empty array' }, { status: 400 });
    }

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a BDU English Professor reviewing a student's practice session.
Analyze the conversation history and provide a final "Job-Ready Scorecard".

Format your response as a JSON object:
{
  "overallScore": number (0-100),
  "topStrengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "grammarFocus": "The specific grammar rule they need to study most (e.g., 'Past Tense' or 'Subject-Verb Agreement')",
  "finalAdvice": "Encouraging closing advice for their Ethio Telecom/CBE interview"
}
`,
        },
        ...history,
        { role: 'user', content: "Please provide my final session summary and scorecard." },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Summary Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
