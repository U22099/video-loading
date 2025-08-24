"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VideoPlayer from '@/components/video-player';
import { getYoutubeVideoId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_YT_URL = "https://youtube.com/shorts/cO_rHIeLIL0?feature=share";
const REDIRECT_URL = "https://toatoa.app.n8n.cloud/webhook/35818612-de49-4057-a7cb-ad7e442864bd";
const REDIRECT_DELAY_SECONDS = 180; // 3 minutes

function CountdownPage() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const videoQuery = searchParams.get('video');
    const sourceUrl = videoQuery?.trim() || DEFAULT_YT_URL;

    const id = getYoutubeVideoId(sourceUrl);

    if (id) {
      setVideoId(id);
    } else {
      setError("Please provide a valid YouTube link (youtube.com or youtu.be). Using default video.");
      const defaultId = getYoutubeVideoId(DEFAULT_YT_URL);
      setVideoId(defaultId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = REDIRECT_URL;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <h1>
        We're designing your lighting setup...
      </h1>
      <p>
        Watch this quick walkthrough to understand how we create your free custom system — it's worth it.
      </p>

      <div className="timer">
        {formatTime(countdown)}
      </div>

      <div className="w-full sm:max-w-2xl rounded-xl shadow-2xl bg-[#10141a] p-6 border border-[#1c2632]">
        {videoId ? (
          <VideoPlayer videoId={videoId} />
        ) : (
          <Skeleton className="w-full aspect-video rounded-xl" />
        )}
      </div>

      {error && (
        <p className="note">
          {error}
        </p>
      )}

      <footer>
        Powered by Christmas Lights Factory • Custom Lighting Solutions
      </footer>
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <h1>
        We're designing your lighting setup...
      </h1>
      <p>
        Watch this quick walkthrough to understand how we create your free custom system — it's worth it.
      </p>
      <div className="timer">
        03:00
      </div>
      <div className="max-w-2xl rounded-xl shadow-2xl bg-[#10141a] p-6 border border-[#1c2632]">
        <Skeleton className="w-full aspect-video rounded-xl" />
      </div>
      <footer>
        Powered by Christmas Lights Factory • Custom Lighting Solutions
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CountdownPage />
    </Suspense>
  );
}
