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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background font-body">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3 font-headline">
            We're designing your lighting setup...
          </h1>
          <p className="text-lg text-muted-foreground">
            Watch this quick walkthrough to understand how we create your free custom system — it's worth it.
          </p>
        </div>

        <div className="text-6xl font-semibold text-primary">
          {formatTime(countdown)}
        </div>

        <div className="w-full">
          {videoId ? (
            <VideoPlayer videoId={videoId} />
          ) : (
            <Skeleton className="w-full aspect-video rounded-xl" />
          )}
        </div>

        {error && (
          <p className="text-destructive max-w-xl mx-auto">
            {error}
          </p>
        )}
      </div>

      <footer>
        Powered by Christmas Lights Factory • Custom Lighting Solutions
      </footer>
    </main>
  );
}

function PageSkeleton() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background font-body">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3 font-headline">
            We're designing your lighting setup...
          </h1>
          <p className="text-lg text-muted-foreground">
            Watch this quick walkthrough to understand how we create your free custom system — it's worth it.
          </p>
        </div>
        <div className="text-6xl font-semibold text-primary">
          03:00
        </div>
        <div className="w-full">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
      </div>
      <footer>
        Powered by Christmas Lights Factory • Custom Lighting Solutions
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CountdownPage />
    </Suspense>
  );
}
