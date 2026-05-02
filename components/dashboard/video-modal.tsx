"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayCircle, Loader2 } from "lucide-react";

export function VideoModal({ searchQuery, title }: { searchQuery: string, title: string }) {
  const [open, setOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = async () => {
    // Prevent refetching if we already have the video ID
    if (videoId) return; 
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/video-search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!res.ok) throw new Error("Failed to fetch video");
      
      const data = await res.json();
      if (data.videoId) {
        setVideoId(data.videoId);
      } else {
        throw new Error("No video found");
      }
    } catch (err: any) {
      setError("Could not find a video tutorial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) fetchVideo();
    }}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          title="Watch tutorial"
        >
          <PlayCircle className="h-3 w-3" />
          Video
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="mb-2 h-8 w-8 animate-spin" />
              <p>Searching YouTube...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-destructive px-4 text-center">
              <p>{error}</p>
            </div>
          )}
          
          {videoId && !loading && (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
