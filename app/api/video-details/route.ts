import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Fetch video details from YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch video details');
    }

    if (!data.items?.[0]) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const video = data.items[0];
    const { snippet, contentDetails } = video;

    // Convert ISO 8601 duration to readable format
    const duration = contentDetails.duration
      .replace('PT', '')
      .replace('H', ':')
      .replace('M', ':')
      .replace('S', '')
      .split(':')
      .map((part: string) => part.padStart(2, '0'))
      .join(':');

    return NextResponse.json({
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      duration,
      thumbnailUrl: snippet.thumbnails.maxres?.url || 
                   snippet.thumbnails.high?.url || 
                   snippet.thumbnails.medium?.url
    });

  } catch (error) {
    console.error('Video details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video details' },
      { status: 500 }
    );
  }
} 