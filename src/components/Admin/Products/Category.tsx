"use client";

import SimpleLoader from "@/components/ui/SimpleLoader";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetAllProductCategoriesQuery,
} from "@/redux/api/admin/productApi";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import AddCategoryModal from "./AddCategoryModal";

interface Category {
  id: string;
  name: string;
}

export default function Category() {
  const {
    data: allProductCategoryData,
    refetch,
    isLoading: isCategoryLoading,
  } = useGetAllProductCategoriesQuery({});

  const categories = allProductCategoryData?.result;

  const [createCategoryFn, { isLoading: isDataCreateLoading }] =
    useCreateCategoryMutation();
  const [deleteCategoryFn] = useDeleteCategoryMutation();
  const [editCategoryFn, { isLoading: isDataEditLoading }] =
    useEditCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddCategory = async (categoryName: string) => {
    try {
      const response = await createCategoryFn({ name: categoryName }).unwrap();
      if (response?.success) {
        toast.success("Category added successfully");
        refetch();
        handleModalClose();
      }
    } catch {
      toast.error("Failed to add category!");
    }
  };

  const handleEditCategory = async (categoryName: string) => {
    if (!categoryToEdit) return;

    try {
      const response = await editCategoryFn({
        id: categoryToEdit.id,
        data: { name: categoryName },
      }).unwrap();

      if (response?.success) {
        toast.success("Category updated successfully");
        refetch();
        handleModalClose();
      }
    } catch {
      toast.error("Failed to update category!");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await deleteCategoryFn(categoryId).unwrap();

      if (response?.success) {
        toast.success("Category deleted successfully");
        refetch();
      }
    } catch {
      toast.error("Failed to delete category!");
    }
  };

  const handleEditClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryToEdit(category);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (
    categoryId: string,
    categoryName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Delete Category",
      text: `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return handleDeleteCategory(categoryId);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Category has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
    setIsEditMode(false);
  };
  const router = useRouter();

  if (selectedCategory) {
    // return (
    //   <div>
    //     <div className="p-8">
    //       <CategoryProducts category={selectedCategory} />
    //     </div>
    //   </div>
    // );

    router.push(`/admin/products/${selectedCategory}`);
  }

  if (isCategoryLoading) {
    return (
      <div>
        <SimpleLoader />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-default">Category</h1>
          <button
            onClick={() => {
              setIsEditMode(false);
              setCategoryToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-[40px] transition-colors text-[18px] font-medium"
          >
            + Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories?.map((category: Category) => (
            <div key={category.id} className="relative group">
              <button
                onClick={() => handleCategoryClick(category.name)}
                className="bg-[#FFF5E9] w-full rounded-lg p-4 text-left transition-colors group-hover:bg-orange-50"
              >
                <h3 className="font-semibold text-default group-hover:text-orange-700 transition-colors pr-10">
                  {category.name}
                </h3>
              </button>

              {/* Edit and Delete Icons */}
              <div className="absolute top-3 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEditClick(category, e)}
                  className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                  title="Edit category"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={(e) =>
                    handleDeleteClick(category.id, category.name, e)
                  }
                  className="p-1.5 bg-white rounded-md shadow-sm hover:bg-red-50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Category Modal */}
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleEditCategory : handleAddCategory}
          isLoading={isDataCreateLoading || isDataEditLoading}
          isEditMode={isEditMode}
          initialValue={categoryToEdit?.name || ""}
          title={isEditMode ? "Edit Category" : "Add Category"}
        />
      </div>
    </div>
  );
}
