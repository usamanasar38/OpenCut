import { Upload } from "lucide-react";

interface DragOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
}

export function DragOverlay({
  isVisible,
  title = "Drop files here",
  description = "Images, videos, and audio files",
}: DragOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border-2 border-accent border-dashed bg-accent/20 backdrop-blur-lg">
      <div className="text-center">
        <Upload className="mx-auto mb-2 h-8 w-8 text-accent" />
        <p className="font-medium text-accent text-sm">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
}
