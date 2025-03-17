import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    // Fetch course data
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        id: true, // Select only necessary fields
        title: true,
      },
    });

    // Fetch chapter data
    const chapter = await db.chapter.findUnique({
      where: {
        isPublished: true,
        id: chapterId,
      },
    });

    if (!course || !chapter) {
      throw new Error("Course or Chapter not found");
    }

    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    // Get attachments for the course
    attachments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    // Fetch next chapter in the course
    nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter: {
        ...chapter,
        youtubeUrl: chapter.youtubeUrl, // Use YouTube URL instead of Mux
      },
      course,
      attachments,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.log("Error in GET_CHAPTER", error);
    return {
      chapter: null,
      course: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
    };
  }
};
