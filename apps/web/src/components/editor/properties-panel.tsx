"use client";

import { useState } from "react";
import { ImageTimelineTreatment } from "@/components/ui/image-timeline-treatment";
import { useMediaStore } from "@/stores/media-store";
import { useTimelineStore } from "@/stores/timeline-store";
import type { BackgroundType } from "@/types/editor";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { SpeedControl } from "./speed-control";

export function PropertiesPanel() {
  const { tracks } = useTimelineStore();
  const { mediaItems } = useMediaStore();
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("blur");
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  // Get the first video clip for preview (simplified)
  const firstVideoClip = tracks
    .flatMap((track) => track.clips)
    .find((clip) => {
      const mediaItem = mediaItems.find((item) => item.id === clip.mediaId);
      return mediaItem?.type === "video";
    });

  const firstVideoItem = firstVideoClip
    ? mediaItems.find((item) => item.id === firstVideoClip.mediaId)
    : null;

  const firstImageClip = tracks
    .flatMap((track) => track.clips)
    .find((clip) => {
      const mediaItem = mediaItems.find((item) => item.id === clip.mediaId);
      return mediaItem?.type === "image";
    });

  const firstImageItem = firstImageClip
    ? mediaItems.find((item) => item.id === firstImageClip.mediaId)
    : null;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-5">
        {/* Image Treatment - only show if an image is selected */}
        {firstImageItem && (
          <>
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Image Treatment</h3>
              <div className="space-y-4">
                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="aspect-video w-full max-w-48">
                    <ImageTimelineTreatment
                      src={firstImageItem.url}
                      alt={firstImageItem.name}
                      targetAspectRatio={16 / 9}
                      className="rounded-sm border"
                      backgroundType={backgroundType}
                      backgroundColor={backgroundColor}
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div className="space-y-2">
                  <Label htmlFor="bg-type">Background Type</Label>
                  <Select
                    value={backgroundType}
                    onValueChange={(value: BackgroundType) =>
                      setBackgroundType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select background type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blur">Blur</SelectItem>
                      <SelectItem value="mirror">Mirror</SelectItem>
                      <SelectItem value="color">Solid Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Color - only show for color type */}
                {backgroundType === "color" && (
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-16 p-1"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Video Controls - only show if a video is selected */}
        {firstVideoItem && (
          <>
            <SpeedControl />
            <Separator />
          </>
        )}

        {/* Transform */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Transform</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="x">X Position</Label>
                <Input id="x" type="number" defaultValue="0" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="y">Y Position</Label>
                <Input id="y" type="number" defaultValue="0" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="rotation">Rotation</Label>
              <Slider
                id="rotation"
                max={360}
                step={1}
                defaultValue={[0]}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Effects */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Effects</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="opacity">Opacity</Label>
              <Slider
                id="opacity"
                max={100}
                step={1}
                defaultValue={[100]}
                className="mt-2"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="blur">Blur</Label>
              <Slider
                id="blur"
                max={20}
                step={0.5}
                defaultValue={[0]}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Timing */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Timing</h3>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.1"
                defaultValue="5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="delay">Delay (seconds)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                step="0.1"
                defaultValue="0"
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
