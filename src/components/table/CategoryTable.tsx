"use client";

import deleteIcon from "@/assets/delete-02.png";
import editIcon from "@/assets/pencil-edit-02.png";
import { useDeleteProductMutation } from "@/redux/api/admin/productApi";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  images: string[];
  description: string;
  price: number;
  brand: string;
  quantity: number;
  availability: string;
  productCategory: string;
  shortDescription: string;
  longDescription: string;
  technicalSpecification: Record<string, string>;
  physicalSpecification: Record<string, string>;
  warrantyInformation: Record<string, string>;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryTableProps {
  products: Product[];
  onEditProduct: (id: string) => void; // Add this prop
}

export default function CategoryTable({ products, onEditProduct }: CategoryTableProps) {
  const [deleteProductFn] = useDeleteProductMutation();
  
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await deleteProductFn(id).unwrap();
      if (response?.success) {
        toast.success("Product deleted successfully");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-t border-[#D1D6DB]">
          <tr>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Product Name
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Description
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Brand
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Price
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Quantity
            </th>
            <th className="text-center py-4 px-6 font-semibold text-default">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 ">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  {product.images && product.images.length > 0 && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-gray-900 font-medium">
                    {product.name}
                  </span>
                </div>
              </td>

              <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                {product.description}
              </td>

              <td className="py-4 px-6 text-gray-600">{product.brand}</td>

              <td className="py-4 px-6 text-gray-900 font-medium">
                ${product.price.toFixed(2)}
              </td>

              <td className="py-4 px-6 text-gray-900 text-start">
                {product.quantity}
              </td>

              <td className="py-4 px-6 flex items-center justify-center gap-2">
                <button onClick={() => onEditProduct(product.id)}>
                  <Image className="w-6 h-6" src={editIcon} alt="edit icon" />
                </button>
                <button onClick={() => handleDeleteProduct(product?.id)}>
                  <Image
                    className="w-6 h-6"
                    src={deleteIcon}
                    alt="delete icon"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}