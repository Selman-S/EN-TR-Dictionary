'use server';

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let endpoint: string;
    console.log("BACKEND_URL", BACKEND_URL);
    if (query) {
      // If there's a query, use the search endpoint
      endpoint = `${BACKEND_URL}/api/dictionary/search?q=${encodeURIComponent(query)}&lang=${lang}`;
    } else {
      // If no query, use the words endpoint for listing
      endpoint = `${BACKEND_URL}/api/dictionary/words?lang=${lang}&limit=${limit}`;
    }

    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error('Failed to fetch data from backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Dictionary API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch data. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/dictionary`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
console.log("response", response);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error('Failed to add word');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Dictionary API error:', error);
    return NextResponse.json(
      { message: 'Failed to add word. Please try again later.' },
      { status: 500 }
    );
  }
} 