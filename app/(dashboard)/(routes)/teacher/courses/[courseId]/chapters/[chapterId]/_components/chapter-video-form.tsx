/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

// Function to extract YouTube video ID from various formats of URLs
const extractYouTubeVideoId = (url: string) => {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]*\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  isYouTube: boolean;
}

const formSchema = z.object({
  youtubeUrl: z
    .string()
    .url("Please enter a valid YouTube URL")
    .min(1, "YouTube URL is required"),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl || "");

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const videoId = extractYouTubeVideoId(values.youtubeUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        youtubeUrl: values.youtubeUrl,
      });
      toast.success("Chapter updated successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.youtubeUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.youtubeUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {/* Display YouTube video or prompt to add a new one */}
      {!isEditing &&
        (!initialData.youtubeUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {(() => {
              const videoId = extractYouTubeVideoId(initialData.youtubeUrl);
              if (!videoId) {
                return <div>Error: Invalid video URL</div>;
              }
              return (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            })()}
          </div>
        ))}

      {/* Show input to edit YouTube URL */}
      {isEditing && (
        <div>
          <input
            type="url"
            className="w-full p-2 rounded-md border"
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <div className="mt-4">
            <Button
              onClick={() => {
                // Submit YouTube URL if valid
                onSubmit({ youtubeUrl });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {initialData.youtubeUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}
    </div>
  );
};
