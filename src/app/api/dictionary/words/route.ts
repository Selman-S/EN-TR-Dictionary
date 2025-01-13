import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'en';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '12';

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/dictionary/words?lang=${lang}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch words error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
} 