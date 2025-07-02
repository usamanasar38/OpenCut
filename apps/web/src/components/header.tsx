"use client";

import { useSession } from "@opencut/auth/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStars } from "@/lib/fetchGhStars";
import { HeaderBase } from "./header-base";
import { Button } from "./ui/button";

export function Header() {
  const { data: session } = useSession();
  const [star, setStar] = useState<string>("");

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const data = await getStars();
        setStar(data);
      } catch (err) {
        console.error("Failed to fetch GitHub stars", err);
      }
    };

    fetchStars();
  }, []);

  const leftContent = (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/logo.svg" alt="OpenCut Logo" width={32} height={32} />
      <span className="hidden font-medium text-xl md:block">OpenCut</span>
    </Link>
  );

  const rightContent = (
    <nav className="flex items-center gap-3">
      <Link href="/contributors">
        <Button variant="text" className="p-0 text-sm">
          Contributors
        </Button>
      </Link>
      {process.env.NODE_ENV === "development" ? (
        <Link href="/editor/1">
          <Button size="sm" className="ml-4 text-sm">
            Editor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Link href="https://github.com/OpenCut-app/OpenCut" target="_blank">
          <Button size="sm" className="ml-4 text-sm">
            GitHub {star}+
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </nav>
  );

  return (
    <div className="mx-4 md:mx-0">
      <HeaderBase
        className="mx-auto mt-4 max-w-3xl rounded-2xl border bg-accent pr-[14px] pl-4"
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
}
