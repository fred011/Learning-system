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
    // Fetch course data (no price field, so we don't select price)
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

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    // Since the chapters are free, we don't need to check for purchase
    attachments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    if (chapter.isFree) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
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
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.log("Error in GET_CHAPTER", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null, // Returning null if there's an error
    };
  }
};
