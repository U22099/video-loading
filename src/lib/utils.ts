import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYoutubeVideoId(url: string): string | null {
  try {
    if (!/^https?:\/\//i.test(url)) return null;
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.endsWith("youtu.be")) {
      const videoId = urlObj.pathname.split("/").filter(Boolean)[0];
      return videoId || null;
    }

    if (hostname.endsWith("youtube.com")) {
      const params = urlObj.searchParams;
      const v = params.get("v");
      if (v) return v;

      const shortsMatch = urlObj.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shortsMatch) return shortsMatch[1];

      const embedMatch = urlObj.pathname.match(/\/embed\/([^/?#]+)/);
      if (embedMatch) return embedMatch[1];
    }
  } catch (e) {
    // Invalid URL
  }
  return null;
}
