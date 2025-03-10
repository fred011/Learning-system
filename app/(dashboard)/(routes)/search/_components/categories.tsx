// "use client";

// import { Category } from "@prisma/client";
// import { CategoryItem } from "./category-item";

// interface CategoriesProps {
//   items: Category[];
// }

// export const Catagories = ({ items }: CategoriesProps) => {
//   return (
//     <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
//       {items.map((item) => (
//         <CategoryItem key={item.id} label={item.name} value={item.id} />
//       ))}
//     </div>
//   );
// };

"use client";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export const Catagories = ({ items, searchParams }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          value={item.id}
          searchParams={searchParams}
        />
      ))}
    </div>
  );
};
