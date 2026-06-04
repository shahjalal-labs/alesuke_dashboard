"use client";
import CategoryProducts from "@/components/Admin/Products/CategoryProducts";
import { useParams } from "next/navigation";

function Page() {
  const params = useParams();
  const selectedCategory = params.name;
  console.log("category", selectedCategory);
  return (
    <div>
      <div className="p-8">
        {typeof selectedCategory === "string" ? (
          <CategoryProducts category={selectedCategory} />
        ) : (
          <p>Loading category...</p>
        )}
      </div>
    </div>
  );
}

export default Page;
