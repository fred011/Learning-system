import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new course with the title, userId, and isPublished set to false initially
    const course = await db.course.create({
      data: {
        userId,
        title,
        isPublished: false, // Initial state can be unpublished or you can set it as true based on your logic
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[Error in COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
