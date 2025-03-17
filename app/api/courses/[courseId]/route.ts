import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

// Ensure that Mux credentials no longer need to be initialized
// No need for Mux credentials anymore

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();

    // Ensure the user is authenticated and is a teacher
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the course in the database with the provided values
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values, // You can still update course details including YouTube URL
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[Error in COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: true, // Include chapters, but no longer include muxData
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // We no longer need to delete Mux assets
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[Error in DELETE Course ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
