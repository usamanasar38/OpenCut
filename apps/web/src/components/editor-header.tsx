"use client";

import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { formatTimeCode } from "@/lib/time";
import { useProjectStore } from "@/stores/project-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { HeaderBase } from "./header-base";
import { Button } from "./ui/button";

export function EditorHeader() {
  const { getTotalDuration } = useTimelineStore();
  const { activeProject } = useProjectStore();

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export project");
  };

  const leftContent = (
    <div className="flex items-center gap-2">
      <Link
        href="/projects"
        className="flex items-center gap-2 font-medium tracking-tight transition-opacity hover:opacity-80"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm">{activeProject?.name}</span>
      </Link>
    </div>
  );

  const centerContent = (
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <span>{formatTimeCode(getTotalDuration(), "HH:MM:SS:CS")}</span>
    </div>
  );

  const rightContent = (
    <nav className="flex items-center gap-2">
      <Button size="sm" onClick={handleExport}>
        <Download className="h-4 w-4" />
        <span className="text-sm">Export</span>
      </Button>
    </nav>
  );

  return (
    <HeaderBase
      leftContent={leftContent}
      centerContent={centerContent}
      rightContent={rightContent}
      className="border-b bg-background"
    />
  );
}
