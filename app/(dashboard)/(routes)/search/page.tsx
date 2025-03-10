// import { db } from "@/lib/db";
// import { Catagories } from "./_components/categories";
// import { SearchInput } from "@/components/search-input";
// import { GetCourses } from "@/actions/get-courses";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { CoursesList } from "@/components/courses-list";

// interface SearchPageProps {
//   searchParams: {
//     title: string;
//     categortId: string;
//   };
// }

// const SearchPage = async ({ searchParams }: SearchPageProps) => {
//   const { userId } = await auth();
//   if (!userId) {
//     return redirect("/");
//   }

//   const categories = await db.category.findMany({
//     orderBy: {
//       name: "asc",
//     },
//   });

//   const courses = await GetCourses({
//     userId,
//     ...searchParams,
//   });

//   return (
//     <>
//       <div className="px-6 pt-6 md:hidden md:mb-0 block">
//         <SearchInput />
//       </div>
//       <div className="p-6 space-y-4">
//         <Catagories items={categories} />
//         <CoursesList items={courses} />
//       </div>
//     </>
//   );
// };

// export default SearchPage;

import { db } from "@/lib/db";
import { Catagories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { GetCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await GetCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput searchParams={searchParams} />
      </div>
      <div className="p-6 space-y-4">
        <Catagories items={categories} searchParams={searchParams} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
