import { NextRequest, NextResponse } from 'next/server';
import { analyzeBusinessRequest } from '@/lib/ai/gemini-client';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }


    const body = await req.json();
    const prompt = body?.prompt;
    const context =
      body?.context && typeof body.context === 'object' && !Array.isArray(body.context)
        ? (body.context as Record<string, unknown>)
        : undefined;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided. Please provide a string description of the business request.' },
        { status: 400 }
      );
    }

    const result = await analyzeBusinessRequest(prompt, context);
    return NextResponse.json({ success: true, data: result.analysis, source: result.source });
  } catch (error) {
    console.error('API route error in /api/ai/analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze request', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
