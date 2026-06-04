"use client";
import backIcon from "@/assets/left-arrow.png";
import CategoryTable from "@/components/table/CategoryTable";
import Pagination from "@/components/ui/Pagination";
import SimpleLoader from "@/components/ui/SimpleLoader";
import { useGetCategoriesProductsQuery } from "@/redux/api/admin/productApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal"; // Import the EditProductModal

export default function CategoryProducts({ category }: { category: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const {
    data: categoryProductsData,
    isLoading,
    refetch,
  } = useGetCategoriesProductsQuery({
    productCategory: category,
    page: currentPage,
    limit: itemsPerPage,
  });

  const products = categoryProductsData?.result?.result || [];
  const totalItems = categoryProductsData?.result?.meta?.total || 0;

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProductId(null);
    // Refetch products to get updated data
    refetch();
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    // Refetch products to get updated data
    refetch();
  };

  if (isLoading) {
    return (
      <div>
        <SimpleLoader />
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleBack} className="mb-4">
        <Image
          className="w-10 h-10 object-contain"
          src={backIcon}
          alt="back icon"
        />
      </button>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Products in {decodeURIComponent(category)}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-[40px] transition-colors text-[18px] font-medium"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <CategoryTable
            products={products}
            onEditProduct={handleEditProduct} // Pass the edit handler
          />
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-6">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        productId={editingProductId}
      />
    </div>
  );
}
