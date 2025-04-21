'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Clock, User } from 'lucide-react';

interface VideoDetails {
  title: string;
  channelTitle: string;
  duration: string;
  thumbnailUrl: string;
}

interface VideoThumbnailProps {
  videoId: string;
}

export default function VideoThumbnail({ videoId }: VideoThumbnailProps) {
  const [mounted, setMounted] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`/api/video-details?videoId=${videoId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch video details');
        }

        setVideoDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video details');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId, mounted]);

  if (!mounted) {
    return (
      <div className="bg-purple-50 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="aspect-video bg-purple-100"></div>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="h-3 sm:h-4 bg-purple-100 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-purple-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-purple-50 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="aspect-video bg-purple-100"></div>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="h-3 sm:h-4 bg-purple-100 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-purple-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!videoDetails) return null;

  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-video bg-purple-50">
        {!imageError ? (
          <Image
            src={videoDetails.thumbnailUrl || fallbackThumbnail}
            alt={videoDetails.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <Image
            src={fallbackThumbnail}
            alt={videoDetails.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600 flex items-center justify-center">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="white" />
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
          {videoDetails.title}
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{videoDetails.channelTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{videoDetails.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 