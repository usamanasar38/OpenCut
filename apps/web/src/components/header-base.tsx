"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderBaseProps {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function HeaderBase({
  leftContent,
  centerContent,
  rightContent,
  className,
  children,
}: HeaderBaseProps) {
  // If children is provided, render it directly without the grid layout
  if (children) {
    return (
      <header className={cn("flex h-16 items-center px-6", className)}>
        {children}
      </header>
    );
  }

  return (
    <header
      className={cn("flex h-14 items-center justify-between px-6", className)}
    >
      {leftContent && <div className="flex items-center">{leftContent}</div>}
      {centerContent && (
        <div className="flex items-center">{centerContent}</div>
      )}
      {rightContent && <div className="flex items-center">{rightContent}</div>}
    </header>
  );
}
