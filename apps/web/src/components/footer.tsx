"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiGithubLine, RiTwitterXLine } from "react-icons/ri";
import { getStars } from "@/lib/fetchGhStars";

export function Footer() {
  const [star, setStar] = useState<string>();

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

  return (
    <motion.footer
      className="border-t bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="mb-8 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Brand Section */}
          <div className="max-w-sm md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt="OpenCut" width={24} height={24} />
              <span className="font-bold text-lg">OpenCut</span>
            </div>
            <p className="mb-5 text-muted-foreground text-sm">
              The open source video editor that gets the job done. Simple,
              powerful, and works on any platform.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://github.com/OpenCut-app/OpenCut"
                className="text-muted-foreground transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiGithubLine className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/OpenCutApp"
                className="text-muted-foreground transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXLine className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="flex items-start justify-end gap-12 py-2">
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Terms of use
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contributors"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contributors
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/OpenCut-app/OpenCut/blob/main/README.md"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-2 md:flex-row">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span>© 2025 OpenCut, All Rights Reserved</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
