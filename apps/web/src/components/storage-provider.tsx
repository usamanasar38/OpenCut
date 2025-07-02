"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { storageService } from "@/lib/storage/storage-service";
import { useMediaStore } from "@/stores/media-store";
import { useProjectStore } from "@/stores/project-store";

interface StorageContextType {
  isInitialized: boolean;
  isLoading: boolean;
  hasSupport: boolean;
  error: string | null;
}

const StorageContext = createContext<StorageContextType | null>(null);

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within StorageProvider");
  }
  return context;
}

interface StorageProviderProps {
  children: React.ReactNode;
}

export function StorageProvider({ children }: StorageProviderProps) {
  const [status, setStatus] = useState<StorageContextType>({
    isInitialized: false,
    isLoading: true,
    hasSupport: false,
    error: null,
  });

  const loadAllProjects = useProjectStore((state) => state.loadAllProjects);
  const loadAllMedia = useMediaStore((state) => state.loadAllMedia);

  useEffect(() => {
    const initializeStorage = async () => {
      setStatus((prev) => ({ ...prev, isLoading: true }));

      try {
        // Check browser support
        const hasSupport = storageService.isFullySupported();

        if (!hasSupport) {
          toast.warning(
            "Storage not fully supported. Some features may not work.",
          );
        }

        // Load saved data in parallel
        await Promise.all([loadAllProjects(), loadAllMedia()]);

        setStatus({
          isInitialized: true,
          isLoading: false,
          hasSupport,
          error: null,
        });
      } catch (error) {
        console.error("Failed to initialize storage:", error);
        setStatus({
          isInitialized: false,
          isLoading: false,
          hasSupport: storageService.isFullySupported(),
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    initializeStorage();
  }, [loadAllProjects, loadAllMedia]);

  return (
    <StorageContext.Provider value={status}>{children}</StorageContext.Provider>
  );
}
