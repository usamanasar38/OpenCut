"use client";

import {
  Calendar,
  ChevronLeft,
  Loader2,
  MoreHorizontal,
  Plus,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteProjectDialog } from "@/components/delete-project-dialog";
import { RenameProjectDialog } from "@/components/rename-project-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectStore } from "@/stores/project-store";
import type { TProject } from "@/types/project";

export default function ProjectsPage() {
  const { createNewProject, savedProjects, isLoading, isInitialized } =
    useProjectStore();
  const router = useRouter();

  const handleCreateProject = async () => {
    const projectId = await createNewProject("New Project");
    console.log("projectId", projectId);
    router.push(`/editor/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-16 w-full items-center justify-between px-6 pt-6">
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-muted-foreground"
        >
          <ChevronLeft className="!size-5 shrink-0" />
          <span className="font-medium text-sm">Back</span>
        </Link>
        <div className="block md:hidden">
          <CreateButton onClick={handleCreateProject} />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-6 pt-6 pb-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
              Your Projects
            </h1>
            <p className="text-muted-foreground">
              {savedProjects.length}{" "}
              {savedProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <div className="hidden md:block">
            <CreateButton onClick={handleCreateProject} />
          </div>
        </div>

        {isLoading || !isInitialized ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : savedProjects.length === 0 ? (
          <NoProjects onCreateProject={handleCreateProject} />
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {savedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: TProject }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const { deleteProject, renameProject, duplicateProject } = useProjectStore();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteProject = async () => {
    await deleteProject(project.id);
    setIsDropdownOpen(false);
  };

  const handleRenameProject = async (newName: string) => {
    await renameProject(project.id, newName);
    setIsRenameDialogOpen(false);
  };

  const handleDuplicateProject = async () => {
    setIsDropdownOpen(false);
    await duplicateProject(project.id);
  };

  return (
    <>
      <Link href={`/editor/${project.id}`} className="group block">
        <Card className="overflow-hidden border-none bg-background p-0">
          <div
            className={`relative aspect-square bg-muted transition-opacity ${
              isDropdownOpen
                ? "opacity-65"
                : "opacity-100 group-hover:opacity-65"
            }`}
          >
            {/* Thumbnail preview or placeholder */}
            <div className="absolute inset-0">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt="Project thumbnail"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/50">
                  <Video className="h-12 w-12 flex-shrink-0 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <CardContent className="flex flex-col gap-1 px-0 pt-5">
            <div className="flex items-start justify-between">
              <h3 className="line-clamp-2 font-medium text-sm leading-snug transition-colors group-hover:text-foreground/90">
                {project.name}
              </h3>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="text"
                    size="sm"
                    className={`ml-2 size-6 shrink-0 p-0 transition-all ${
                      isDropdownOpen
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      setIsRenameDialogOpen(true);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDuplicateProject();
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Calendar className="!size-4" />
                <span>Created {formatDate(project.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProject}
      />
      <RenameProjectDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onConfirm={handleRenameProject}
        projectName={project.name}
      />
    </>
  );
}

function CreateButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button className="flex" onClick={onClick}>
      <Plus className="!size-4" />
      <span className="font-medium text-sm">New project</span>
    </Button>
  );
}

function NoProjects({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/30">
        <Video className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-medium text-lg">No projects yet</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        Start creating your first video project. Import media, edit, and export
        professional videos.
      </p>
      <Button size="lg" className="gap-2" onClick={onCreateProject}>
        <Plus className="h-4 w-4" />
        Create Your First Project
      </Button>
    </div>
  );
}
