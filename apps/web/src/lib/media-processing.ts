import { toast } from "sonner";
import {
  generateVideoThumbnail,
  getFileType,
  getImageDimensions,
  getMediaDuration,
  type MediaItem,
} from "@/stores/media-store";
// import { generateThumbnail, getVideoInfo } from "./ffmpeg-utils"; // Temporarily disabled

export interface ProcessedMediaItem extends Omit<MediaItem, "id"> {}

export async function processMediaFiles(
  files: FileList | File[],
  onProgress?: (progress: number) => void,
): Promise<ProcessedMediaItem[]> {
  const fileArray = Array.from(files);
  const processedItems: ProcessedMediaItem[] = [];

  const total = fileArray.length;
  let completed = 0;

  for (const file of fileArray) {
    const fileType = getFileType(file);

    if (!fileType) {
      toast.error(`Unsupported file type: ${file.name}`);
      continue;
    }

    const url = URL.createObjectURL(file);
    let thumbnailUrl: string | undefined;
    let duration: number | undefined;
    let width: number | undefined;
    let height: number | undefined;

    try {
      if (fileType === "image") {
        // Get image dimensions
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      } else if (fileType === "video") {
        // Use basic thumbnail generation for now
        const videoResult = await generateVideoThumbnail(file);
        thumbnailUrl = videoResult.thumbnailUrl;
        width = videoResult.width;
        height = videoResult.height;
      } else if (fileType === "audio") {
        // For audio, we don't set width/height (they'll be undefined)
      }

      // Get duration for videos and audio (if not already set by FFmpeg)
      if ((fileType === "video" || fileType === "audio") && !duration) {
        duration = await getMediaDuration(file);
      }

      processedItems.push({
        name: file.name,
        type: fileType,
        file,
        url,
        thumbnailUrl,
        duration,
        width,
        height,
      });

      // Yield back to the event loop to keep the UI responsive
      await new Promise((resolve) => setTimeout(resolve, 0));

      completed += 1;
      if (onProgress) {
        const percent = Math.round((completed / total) * 100);
        onProgress(percent);
      }
    } catch (error) {
      console.error("Error processing file:", file.name, error);
      toast.error(`Failed to process ${file.name}`);
      URL.revokeObjectURL(url); // Clean up on error
    }
  }

  return processedItems;
}
