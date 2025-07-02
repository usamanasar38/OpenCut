"use client";

import { Pause, Play, Plus, Square, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoPlayer } from "@/components/ui/video-player";
import { formatTimeCode } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import {
  getMediaAspectRatio,
  type MediaItem,
  useMediaStore,
} from "@/stores/media-store";
import { usePlaybackStore } from "@/stores/playback-store";
import {
  type TimelineClip,
  type TimelineTrack,
  useTimelineStore,
} from "@/stores/timeline-store";
import Image from "next/image";

interface ActiveClip {
  clip: TimelineClip;
  track: TimelineTrack;
  mediaItem: MediaItem | null;
}

export function PreviewPanel() {
  const { tracks } = useTimelineStore();
  const { mediaItems } = useMediaStore();
  const { currentTime } = usePlaybackStore();
  const { canvasSize } = useEditorStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewDimensions, setPreviewDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Calculate optimal preview size that fits in container while maintaining aspect ratio
  useEffect(() => {
    const updatePreviewSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const computedStyle = getComputedStyle(containerRef.current);

      // Get padding values
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);

      // Get gap value (gap-4 = 1rem = 16px)
      const gap = parseFloat(computedStyle.gap) || 16;

      // Get toolbar height if it exists
      const toolbar = containerRef.current.querySelector("[data-toolbar]");
      const toolbarHeight = toolbar
        ? toolbar.getBoundingClientRect().height
        : 0;

      // Calculate available space after accounting for padding, gap, and toolbar
      const availableWidth = container.width - paddingLeft - paddingRight;
      const availableHeight =
        container.height -
        paddingTop -
        paddingBottom -
        toolbarHeight -
        (toolbarHeight > 0 ? gap : 0);

      const targetRatio = canvasSize.width / canvasSize.height;
      const containerRatio = availableWidth / availableHeight;

      let width: number, height: number;

      if (containerRatio > targetRatio) {
        // Container is wider - constrain by height
        height = availableHeight;
        width = height: number * targetRatio;
      } else {
        // Container is taller - constrain by width
        width = availableWidth;
        height = width / targetRatio;
      }

      setPreviewDimensions({ width, height });
    };

    updatePreviewSize();

    const resizeObserver = new ResizeObserver(updatePreviewSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [canvasSize.width, canvasSize.height]);

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

  // Check if there are any clips in the timeline at all
  const hasAnyClips = tracks.some((track) => track.clips.length > 0);

  // Render a clip
  const renderClip = (clipData: ActiveClip, _index: number) => {
    const { clip, mediaItem } = clipData;

    // Test clips
    if (!mediaItem || clip.mediaId === "test") {
      return (
        <div
          key={clip.id}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20"
        >
          <div className="text-center">
            <div className="mb-2 text-2xl">🎬</div>
            <p className="text-white text-xs">{clip.name}</p>
          </div>
        </div>
      );
    }

    // Video clips
    if (mediaItem.type === "video") {
      return (
        <div key={clip.id} className="absolute inset-0">
          <VideoPlayer
            src={mediaItem.url}
            poster={mediaItem.thumbnailUrl}
            clipStartTime={clip.startTime}
            trimStart={clip.trimStart}
            trimEnd={clip.trimEnd}
            clipDuration={clip.duration}
          />
        </div>
      );
    }

    // Image clips
    if (mediaItem.type === "image") {
      return (
        <div key={clip.id} className="absolute inset-0">
          <Image
            src={mediaItem.url}
            alt={mediaItem.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      );
    }

    // Audio clips (visual representation)
    if (mediaItem.type === "audio") {
      return (
        <div
          key={clip.id}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20"
        >
          <div className="text-center">
            <div className="mb-2 text-2xl">🎵</div>
            <p className="text-white text-xs">{mediaItem.name}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
      <div
        ref={containerRef}
        className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-4 p-3"
      >
        {hasAnyClips ? (
          <div
            ref={previewRef}
            className="relative overflow-hidden rounded-sm border bg-black"
            style={{
              width: previewDimensions.width,
              height: previewDimensions.height,
            }}
          >
            {activeClips.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No clips at current time
              </div>
            ) : (
              activeClips.map((clipData, index) => renderClip(clipData, index))
            )}
          </div>
        ) : (
          <>
            {/* Empty div so toolbar stays at the bottom */}
            <div className="h-full w-full"></div>
          </>
        )}

        <PreviewToolbar hasAnyClips={hasAnyClips} />
      </div>
    </div>
  );
}

function PreviewToolbar({ hasAnyClips }: { hasAnyClips: boolean }) {
  const { isPlaying, toggle, currentTime } = usePlaybackStore();
  const {
    canvasSize,
    canvasPresets,
    setCanvasSize,
    setCanvasSizeFromAspectRatio,
  } = useEditorStore();
  const { mediaItems } = useMediaStore();
  const { tracks, getTotalDuration } = useTimelineStore();

  // Find the current preset based on canvas size
  const currentPreset = canvasPresets.find(
    (preset) =>
      preset.width === canvasSize.width && preset.height === canvasSize.height,
  );

  const handlePresetSelect = (preset: { width: number; height: number }) => {
    setCanvasSize({ width: preset.width, height: preset.height });
  };

  // Get the first video/image media item to determine original aspect ratio
  const getOriginalAspectRatio = () => {
    // Find first video or image in timeline
    for (const track of tracks) {
      for (const clip of track.clips) {
        const mediaItem = mediaItems.find((item) => item.id === clip.mediaId);
        if (
          mediaItem &&
          (mediaItem.type === "video" || mediaItem.type === "image")
        ) {
          return getMediaAspectRatio(mediaItem);
        }
      }
    }
    return 16 / 9; // Default aspect ratio
  };

  const handleOriginalSelect = () => {
    const aspectRatio = getOriginalAspectRatio();
    setCanvasSizeFromAspectRatio(aspectRatio);
  };

  // Check if current size is "Original" (not matching any preset)
  const isOriginal = !currentPreset;

  return (
    <div
      data-toolbar
      className="flex w-full items-end justify-between gap-2 bg-background-500 p-1 pt-2"
    >
      <div>
        <p
          className={cn(
            "text-muted-foreground text-xs tabular-nums",
            !hasAnyClips && "opacity-50",
          )}
        >
          {formatTimeCode(currentTime, "HH:MM:SS:CS")}/
          {formatTimeCode(getTotalDuration(), "HH:MM:SS:CS")}
        </p>
      </div>
      <Button
        variant="text"
        size="icon"
        onClick={toggle}
        disabled={!hasAnyClips}
      >
        {isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="!bg-background h-auto rounded-none border border-foreground px-0.5 py-0 font-light text-foreground text-xs"
              disabled={!hasAnyClips}
            >
              {currentPreset?.name || "Ratio"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleOriginalSelect}
              className={cn("text-xs", isOriginal && "font-semibold")}
            >
              Original
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {canvasPresets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  "text-xs",
                  currentPreset?.name === preset.name && "font-semibold",
                )}
              >
                {preset.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
