"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  youtubeUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string | null; // Allow null or undefined
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  youtubeUrl,
  courseId,
  chapterId,
  nextChapterId,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  // Handle video end event
  const onEnd = async () => {
    if (!completeOnEnd) return;

    try {
      // Update the user's progress when the video ends
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: true,
        }
      );

      toast.success("Progress updated!");
      router.refresh();

      if (nextChapterId) {
        // If there's a next chapter, redirect to it
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      } else {
        // If no next chapter, show course completion confetti
        confetti.onOpen();
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  // Extract video ID for embedding
  const videoId = youtubeUrl.split("v=")[1];

  return (
    <div className="relative aspect-video">
      {/* Loading spinner while the video is loading */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {/* Embedded YouTube player */}
      <iframe
        className={cn(!isReady && "hidden", "w-full h-full")}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=1&rel=0&modestbranding=1&showinfo=0`}
        title={title}
        allowFullScreen
        onLoad={() => setIsReady(true)}
        onEnded={onEnd}
      />
    </div>
  );
};
