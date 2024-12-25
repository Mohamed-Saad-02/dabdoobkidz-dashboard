import { Category } from "../../types/Categories";
import CategoryCard from "./CategoryCard";

export default function GridCategoryComponent({
  categories,
}: {
  categories: Category[] | undefined;
}) {
  return (
    <div className="grid grid-cols-4  p-4 gap-[20px]  pt-11">
      {categories?.map((category, index) => (
        <CategoryCard key={index} category={category} />
      ))}
    </div>
  );
}
