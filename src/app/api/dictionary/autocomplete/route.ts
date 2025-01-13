import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const lang = searchParams.get('lang') || 'en';
  const limit = searchParams.get('limit') || '10';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/dictionary/autocomplete?q=${encodeURIComponent(query)}&lang=${lang}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
} 