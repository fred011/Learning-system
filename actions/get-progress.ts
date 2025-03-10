import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });

    console.log(
      `Published Chapters for Course ${courseId}:`,
      publishedChapters
    );

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: publishedChapterIds },
        isCompleted: true,
      },
    });

    const progressPercentage = publishedChapterIds.length
      ? (validCompletedChapters / publishedChapterIds.length) * 100
      : 0;

    console.log(
      `User ${userId} Progress for Course ${courseId}: ${progressPercentage}%`
    );

    return progressPercentage;
  } catch (error) {
    console.error("Error in GET_PROGRESS", error);
    return 0;
  }
};
