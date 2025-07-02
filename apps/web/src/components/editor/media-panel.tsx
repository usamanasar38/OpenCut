"use client";

import { ImageIcon, Music, Plus, Upload, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { processMediaFiles } from "@/lib/media-processing";
import { type MediaItem, useMediaStore } from "@/stores/media-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { DragOverlay } from "../ui/drag-overlay";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";

// MediaPanel lets users add, view, and drag media (images, videos, audio) into the project.
// You can upload files or drag them from your computer. Dragging from here to the timeline adds them to your video project.

export function MediaPanel() {
  const { mediaItems, addMediaItem, removeMediaItem } = useMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      // Process files (extract metadata, generate thumbnails, etc.)
      const processedItems = await processMediaFiles(files, (p) =>
        setProgress(p),
      );
      // Add each processed media item to the store
      for (const item of processedItems) {
        await addMediaItem(item);
      }
    } catch (error) {
      // Show error toast if processing fails
      console.error("Error processing files:", error);
      toast.error("Failed to process files");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const { isDragOver, dragProps } = useDragDrop({
    // When files are dropped, process them
    onDrop: processFiles,
  });

  const handleFileSelect = () => fileInputRef.current?.click(); // Open file picker

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When files are selected via file picker, process them
    if (e.target.files) processFiles(e.target.files);
    e.target.value = ""; // Reset input
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    // Remove a media item from the store
    e.stopPropagation();

    // Remove tracks automatically when delete media
    const { tracks, removeTrack } = useTimelineStore.getState();
    tracks.forEach((track) => {
      const clipsToRemove = track.clips.filter((clip) => clip.mediaId === id);
      clipsToRemove.forEach((clip) => {
        useTimelineStore.getState().removeClipFromTrack(track.id, clip.id);
      });
      // Only remove track if it becomes empty and has no other clips
      const updatedTrack = useTimelineStore
        .getState()
        .tracks.find((t) => t.id === track.id);
      if (updatedTrack && updatedTrack.clips.length === 0) {
        removeTrack(track.id);
      }
    });
    await removeMediaItem(id);
  };

  const formatDuration = (duration: number) => {
    // Format seconds as mm:ss
    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const startDrag = (e: React.DragEvent, item: MediaItem) => {
    // When dragging a media item, set drag data for timeline to read
    e.dataTransfer.setData(
      "application/x-media-item",
      JSON.stringify({
        id: item.id,
        type: item.type,
        name: item.name,
      }),
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const [filteredMediaItems, setFilteredMediaItems] = useState(mediaItems);

  useEffect(() => {
    const filtered = mediaItems.filter((item) => {
      if (mediaFilter && mediaFilter !== "all" && item.type !== mediaFilter) {
        return false;
      }

      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredMediaItems(filtered);
  }, [mediaItems, mediaFilter, searchQuery]);

  const renderPreview = (item: MediaItem) => {
    // Render a preview for each media type (image, video, audio, unknown)
    // Each preview is draggable to the timeline
    const baseDragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => startDrag(e, item),
    };

    if (item.type === "image") {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src={item.url}
            alt={item.name}
            className="max-h-full max-w-full rounded object-contain"
            loading="lazy"
            {...baseDragProps}
          />
        </div>
      );
    }

    if (item.type === "video") {
      if (item.thumbnailUrl) {
        return (
          <div className="relative h-full w-full" {...baseDragProps}>
            <Image
              src={item.thumbnailUrl}
              alt={item.name}
              className="h-full w-full rounded object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
              <Video className="h-6 w-6 text-white drop-shadow-md" />
            </div>
            {item.duration && (
              <div className="absolute right-1 bottom-1 rounded bg-black/70 px-1 text-white text-xs">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>
        );
      }
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded bg-muted/30 text-muted-foreground"
          {...baseDragProps}
        >
          <Video className="mb-1 h-6 w-6" />
          <span className="text-xs">Video</span>
          {item.duration && (
            <span className="text-xs opacity-70">
              {formatDuration(item.duration)}
            </span>
          )}
        </div>
      );
    }

    if (item.type === "audio") {
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded border border-green-500/20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-muted-foreground"
          {...baseDragProps}
        >
          <Music className="mb-1 h-6 w-6" />
          <span className="text-xs">Audio</span>
          {item.duration && (
            <span className="text-xs opacity-70">
              {formatDuration(item.duration)}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded bg-muted/30 text-muted-foreground"
        {...baseDragProps}
      >
        <ImageIcon className="h-6 w-6" />
        <span className="mt-1 text-xs">Unknown</span>
      </div>
    );
  };

  return (
    <>
      {/* Hidden file input for uploading media */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`relative flex h-full flex-col transition-colors ${isDragOver ? "bg-accent/30" : ""}`}
        {...dragProps}
      >
        {/* Show overlay when dragging files over the panel */}
        <DragOverlay isVisible={isDragOver} />

        <div className="border-b p-2">
          {/* Button to add/upload media */}
          <div className="flex gap-2">
            {/* Search and filter controls */}
            <Select value={mediaFilter} onValueChange={setMediaFilter}>
              <SelectTrigger className="h-7 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Search media..."
              className="h-7 min-w-[60px] flex-1 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Add media button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileSelect}
              disabled={isProcessing}
              className="min-w-[30px] flex-none items-center justify-center overflow-hidden whitespace-nowrap px-2"
            >
              {isProcessing ? (
                <>
                  <Upload className="h-4 w-4 animate-spin" />
                  <span className="ml-2 hidden md:inline">{progress}%</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline" aria-label="Add file">
                    Add
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Show message if no media, otherwise show media grid */}
          {filteredMediaItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/30">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No media in project
              </p>
              <p className="mt-1 text-muted-foreground/70 text-xs">
                Drag files here or use the button above
              </p>
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fill, 160px)",
              }}
            >
              {/* Render each media item as a draggable button */}
              {filteredMediaItems.map((item) => (
                <div key={item.id} className="group relative">
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="!bg-transparent relative flex h-auto w-full cursor-default flex-col gap-1 border-none p-2"
                      >
                        <AspectRatio ratio={16 / 9} className="bg-accent">
                          {renderPreview(item)}
                        </AspectRatio>
                        <span
                          className="w-full truncate text-left text-[0.7rem] text-muted-foreground"
                          aria-label={item.name}
                          title={item.name}
                        >
                          {item.name.length > 8
                            ? `${item.name.slice(0, 4)}...${item.name.slice(-3)}`
                            : item.name}
                        </span>
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Export clips</ContextMenuItem>
                      <ContextMenuItem
                        variant="destructive"
                        onClick={(e) => handleRemove(e, item.id)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
