'use client';

import { useState } from 'react';
import { Youtube, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export default function VideoAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTranscript([]);
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <div className="input-group">
              <span className="btn btn-square bg-white border border-gray-200">
                <Youtube className="w-6 h-6 text-red-600" />
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=pcC4Dr6Wj2Q)"
                className="input input-bordered w-full bg-white"
              />
              <Button
                type="submit"
                disabled={loading}
                variant="default"
                size="default"
                className="bg-white text-black hover:bg-gray-100 border border-gray-200"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>
        </form>

        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {transcript.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Transcript</h2>
            <div className="card bg-white border border-gray-200">
              <div className="card-body max-h-96 overflow-y-auto">
                {transcript.map((item, index) => (
                  <p key={index} className="mb-2 text-black">
                    {item.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 