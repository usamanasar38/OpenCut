"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface HeroProps {
  signupCount: number;
}

export function Hero({ signupCount }: HeroProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "You'll be notified when we launch.",
        });
        setEmail("");
      } else {
        toast({
          title: "Oops!",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (_error) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-between px-4 text-center supports-[height:100dvh]:min-h-[calc(100dvh-4.5rem)]">
      <Image
        className="-z-50 absolute top-0 left-0 size-full object-cover"
        src="/landing-page-bg.png"
        height={1903.5}
        width={1269}
        alt="landing-page.bg"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-block font-bold text-4xl tracking-tighter md:text-[4rem]"
        >
          <h1>The Open Source</h1>
          <div className="mt-0 flex justify-center gap-4 leading-[4rem] md:mt-2">
            <div className="-rotate-[2.76deg] relative mt-2 max-w-[250px] md:max-w-[454px]">
              <Image src="/frame.svg" height={79} width={459} alt="frame" />
              <span className="absolute inset-0 flex items-center justify-center">
                Video Editor
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mx-auto mt-10 max-w-xl font-light text-base text-muted-foreground tracking-wide sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          A simple but powerful video editor that gets the job done. Works on
          any platform.
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-11 flex-1 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 px-6 text-base"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting ? "Joining..." : "Join waitlist"}
              </span>
              <ArrowRight className="relative z-10 ml-0.5 inline-block h-4 w-4" />
            </Button>
          </form>
        </motion.div>

        {signupCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 inline-flex items-center justify-center gap-2 text-muted-foreground text-sm"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span>{signupCount.toLocaleString()} people already joined</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
