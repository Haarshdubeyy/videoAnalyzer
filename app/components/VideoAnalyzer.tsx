'use client';

import { useState, useEffect } from 'react';
import { Youtube, Loader2, BookOpen, Lightbulb, MessageSquare, CheckCircle } from 'lucide-react';
import VideoThumbnail from './VideoThumbnail';

// interface TranscriptItem {
//   text: string;
//   duration: number;
//   offset: number;
// }

export default function VideoAnalyzer() {
  const [mounted, setMounted] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // setTranscript([]);
    setAnalysis('');
    
    const extractedVideoId = extractVideoId(url);
    if (!extractedVideoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setVideoId(extractedVideoId);
    setLoading(true);

    try {
      // Get transcript
      const transcriptResponse = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: extractedVideoId }),
      });

      if (!transcriptResponse.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const transcriptData = await transcriptResponse.json();
      // setTranscript(transcriptData.transcript);
      
      // Get analysis
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptData.transcript }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze transcript');
      }

      const analysisData = await analysisResponse.json();
      if (analysisData.error) {
        throw new Error(analysisData.error);
      }
      
      setAnalysis(analysisData.analysis);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisSection = (content: string) => {
    const sections = content.split('\n').reduce((acc: { title: string; items: string[] }[], line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return acc;
      
      if (trimmedLine.startsWith('- ')) {
        if (acc.length > 0) {
          acc[acc.length - 1].items.push(trimmedLine.substring(2));
        }
      } else {
        acc.push({ title: trimmedLine, items: [] });
      }
      return acc;
    }, []);

    return sections.map((section, index) => (
      <div key={index} className="mb-8 last:mb-0">
        {section.title && (
          <div className="flex items-center gap-3 mb-4">
            {index === 0 && <BookOpen className="h-6 w-6 text-purple-600" />}
            {index === 1 && <Lightbulb className="h-6 w-6 text-purple-600" />}
            {index === 2 && <MessageSquare className="h-6 w-6 text-purple-600" />}
            {index === 3 && <CheckCircle className="h-6 w-6 text-purple-600" />}
            <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
          </div>
        )}
        {section.items.length > 0 && (
          <ul className="space-y-3 pl-8">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 leading-relaxed relative flex items-start">
                <span className="absolute -left-4 top-2.5 h-2 w-2 rounded-full bg-purple-400"></span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Youtube className="h-5 w-5 text-purple-600" />
            </div>
            <div className="input-modern pl-11 bg-gray-50"></div>
          </div>
          <div className="btn-primary flex items-center justify-center min-w-[120px] h-[42px] opacity-50">
            Analyze
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="input-modern text-sm sm:text-base pl-9 sm:pl-11"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm sm:text-base flex items-center justify-center h-[38px] sm:h-[42px] px-4 sm:px-6"
          >
            {loading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : 'Analyze'}
          </button>
        </div>

        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>

      {videoId && (
        <div className="mb-6 sm:mb-8">
          <VideoThumbnail videoId={videoId} />
        </div>
      )}

      {loading && (
        <div className="space-y-6 sm:space-y-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-purple-100"></div>
              <div className="h-5 sm:h-6 bg-purple-100 rounded w-36 sm:w-48"></div>
            </div>
            <div className="space-y-2 sm:space-y-3 pl-6 sm:pl-8">
              <div className="h-3 sm:h-4 bg-purple-50 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-purple-50 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-purple-50 rounded w-4/6"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-purple-100"></div>
              <div className="h-5 sm:h-6 bg-purple-100 rounded w-32 sm:w-40"></div>
            </div>
            <div className="space-y-2 sm:space-y-3 pl-6 sm:pl-8">
              <div className="h-3 sm:h-4 bg-purple-50 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-purple-50 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-100 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-purple-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Video Analysis</h2>
            <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium rounded-full">AI Generated</span>
          </div>
          <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
            {renderAnalysisSection(analysis)}
          </div>
        </div>
      )}
    </div>
  );
} 
