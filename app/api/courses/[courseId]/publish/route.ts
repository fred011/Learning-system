import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course with chapters
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: true, // Only include chapters
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Check if any chapter has a valid YouTube URL and is published
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished && chapter.youtubeUrl
    );

    // Ensure required fields are present and there is a published chapter with YouTube URL
    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update course status to published
    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("Error in COURSE_PUBLISH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
