import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return NextResponse.json({ transcript });
  } catch (error: unknown) {
    console.error('Error fetching transcript:', error);
    console.log('Caught error object:', error); // Added console log

    if (error instanceof Error && error.message.includes('Transcript is disabled')) {
      return NextResponse.json(
        { error: 'Transcript is disabled for this video.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch transcript. The video might not have captions available.' },
      { status: 500 }
    );
  }
}