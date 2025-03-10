import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgress = Course & {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgress[];
  coursesInProgress: CourseWithProgress[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Fetch all available courses
    const courses = await db.course.findMany({
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
        },
      },
    });

    console.log("Fetched Courses:", courses);

    // Calculate progress for each course
    let coursesWithProgress: CourseWithProgress[] = await Promise.all(
      courses.map(async (course) => ({
        ...course,
        progress: await getProgress(userId, course.id),
      }))
    );

    console.log("Courses with Progress (Before Filter):", coursesWithProgress);

    // Filter out courses where progress is null or 0
    coursesWithProgress = coursesWithProgress.filter(
      (course) => course.progress !== null && course.progress > 0
    );

    console.log("Filtered Courses:", coursesWithProgress);

    // Separate completed and in-progress courses
    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress! >= 100
    );
    const coursesInProgress = coursesWithProgress.filter(
      (course) => course.progress! < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error("Error in GET_DASHBOARD_COURSES:", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
