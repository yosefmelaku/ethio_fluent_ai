import { getOpenAI } from '@/lib/openai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Uploaded file must be an audio file' }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      return NextResponse.json({ error: 'File size too large. Maximum 25MB allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFileName = `${Date.now()}_audio.webm`;
    const tempFilePath = path.join(tempDir, tempFileName);

    await fs.promises.writeFile(tempFilePath, buffer);

    const openai = getOpenAI();
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // Cleanup
    await fs.promises.unlink(tempFilePath);

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Whisper Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
