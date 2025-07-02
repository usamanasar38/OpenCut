"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type MediaItem, useMediaStore } from "@/stores/media-store";
import { usePlaybackStore } from "@/stores/playback-store";
import {
  type TimelineClip,
  type TimelineTrack,
  useTimelineStore,
} from "@/stores/timeline-store";

// Only show in development
const SHOW_DEBUG_INFO = process.env.NODE_ENV === "development";

interface ActiveClip {
  clip: TimelineClip;
  track: TimelineTrack;
  mediaItem: MediaItem | null;
}

export function DevelopmentDebug() {
  const { tracks } = useTimelineStore();
  const { mediaItems } = useMediaStore();
  const { currentTime } = usePlaybackStore();
  const [showDebug, setShowDebug] = useState(false);

  // Don't render anything in production
  if (!SHOW_DEBUG_INFO) return null;

  // Get active clips at current time
  const getActiveClips = (): ActiveClip[] => {
    const activeClips: ActiveClip[] = [];

    tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        const clipStart = clip.startTime;
        const clipEnd =
          clip.startTime + (clip.duration - clip.trimStart - clip.trimEnd);

        if (currentTime >= clipStart && currentTime < clipEnd) {
          const mediaItem =
            clip.mediaId === "test"
              ? null // Test clips don't have a real media item
              : mediaItems.find((item) => item.id === clip.mediaId) || null;

          activeClips.push({ clip, track, mediaItem });
        }
      });
    });

    return activeClips;
  };

  const activeClips = getActiveClips();

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(!showDebug)}
          className="border-border/50 bg-background/80 text-xs backdrop-blur-md"
        >
          Debug {showDebug ? "ON" : "OFF"}
        </Button>

        {/* Debug Info Panel */}
        {showDebug && (
          <div className="max-w-sm rounded-lg border border-border/50 bg-background/90 p-3 backdrop-blur-md">
            <div className="mb-2 font-medium text-foreground text-xs">
              Active Clips ({activeClips.length})
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {activeClips.map((clipData, index) => (
                <div
                  key={clipData.clip.id}
                  className="flex items-center gap-2 rounded bg-muted/60 px-2 py-1 text-xs"
                >
                  <span className="h-4 w-4 flex-shrink-0 rounded bg-primary/20 text-center text-xs leading-4">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{clipData.clip.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {clipData.mediaItem?.type || "test"}
                    </div>
                  </div>
                </div>
              ))}
              {activeClips.length === 0 && (
                <div className="py-2 text-center text-muted-foreground text-xs">
                  No active clips
                </div>
              )}
            </div>
            <div className="mt-2 border-border/30 border-t pt-2 text-[10px] text-muted-foreground">
              Time: {currentTime.toFixed(2)}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
