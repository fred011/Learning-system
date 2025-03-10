// "use client";

// import { cn } from "@/lib/utils";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import qs from "query-string";

// interface CategoriesItemProps {
//   label: string;
//   value?: string;
// }

// export const CategoryItem = ({ label, value }: CategoriesItemProps) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const currentCategoryId = searchParams.get("categoryId");
//   const currentTitle = searchParams.get("title");

//   const isSelected = currentCategoryId === value;

//   const onClick = () => {
//     const url = qs.stringifyUrl(
//       {
//         url: pathname,
//         query: {
//           title: currentTitle,
//           categoryId: isSelected ? null : value,
//         },
//       },
//       { skipNull: true, skipEmptyString: true }
//     );

//     router.push(url);
//   };

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={cn(
//         "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center hover:border-sky-700 transition",
//         isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
//       )}
//     >
//       <div className="truncate">{label}</div>
//     </button>
//   );
// };

"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  value?: string;
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export const CategoryItem = ({
  label,
  value,
  searchParams,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentCategoryId = searchParams.categoryId;
  const currentTitle = searchParams.title;

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
    >
      <div className="truncate">{label}</div>
    </button>
  );
};
