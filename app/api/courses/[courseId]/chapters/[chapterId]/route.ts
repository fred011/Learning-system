import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course belongs to the authenticated user
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // If chapter has a YouTube URL, update it to null
    if (chapter.youtubeUrl) {
      await db.chapter.update({
        where: { id: params.chapterId },
        data: { youtubeUrl: null },
      });
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // Update course if there are no published chapters
    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false, // Unpublish course if no published chapters exist
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[Error in DELETE Course Chapter]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { isPublished, youtubeUrl, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update chapter details
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // If YouTube URL is provided, update it
    if (youtubeUrl) {
      await db.chapter.update({
        where: {
          id: params.chapterId,
        },
        data: {
          youtubeUrl, // Update YouTube URL
        },
      });
    }

    // Update `isPublished` flag for chapter if provided in the request body
    if (isPublished !== undefined) {
      await db.chapter.update({
        where: {
          id: params.chapterId,
        },
        data: {
          isPublished,
        },
      });
    }

    // Check if the course has any published chapters
    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If no published chapters, set the course as unpublished
    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[Error in PATCH Course Chapter]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
