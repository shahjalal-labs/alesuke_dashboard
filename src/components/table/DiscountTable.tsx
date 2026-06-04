/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import deleteIcon from "@/assets/delete-02.png";
import editIcon from "@/assets/pencil-edit-02.png";
import { useDeleteCouponMutation } from "@/redux/api/admin/couponApi";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import EditCouponModal from "../Admin/DiscountCoupon/EditCouponModal";

interface OrderRecord {
  id: string;
  couponTitle: string;
  couponCode: string;
  discount: string;
  endDate: string;
  status: string;
  discountType?: string;
  discountValue?: number;
  expireDate?: string;
}

interface OrderTableProps {
  orderData: OrderRecord[];
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

export default function DiscountTable({ orderData }: OrderTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<OrderRecord | null>(null);

  const [deleteCouponFn] = useDeleteCouponMutation();

  const handleEditClick = (coupon: OrderRecord) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedCoupon: any) => {
    console.log("Saving coupon:", updatedCoupon);
    setIsEditModalOpen(false);
    // Handle save logic - you might want to refresh the data here
  };

  // delete functionality
  const handleDeleteCoupon = async (id: string) => {
    try {
      const result = await deleteCouponFn(id).unwrap();
      if (result?.success) {
        toast.success("Coupon deleted successfully");
      }
    } catch {
      toast.error("Coupon deletion failed");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-t border-[#D1D6DB]">
          <tr>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Coupon title
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Coupon Code
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Discount
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              End Date
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Status
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 ">
              <td className="py-4 px-6 text-gray-900 font-medium">
                {order.couponTitle}
              </td>

              <td className="py-4 px-6 text-gray-900">{order.couponCode}</td>

              <td className="py-4 px-6 text-gray-600">{order.discount}</td>

              <td className="py-4 px-6">{order.endDate}</td>

              <td className="py-4 px-6">
                {order.status === "Active" ? (
                  <span className="px-3 py-1 rounded-md bg-green-100 text-green-600 text-sm font-medium">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-red-100 text-red-500 text-sm font-medium">
                    Expire
                  </span>
                )}
              </td>

              <td className="py-4 px-6 text-gray-900 font-medium flex items-center gap-2">
                <button onClick={() => handleEditClick(order)}>
                  <Image className="w-6 h-6" src={editIcon} alt="edit icon" />
                </button>
                <button onClick={() => handleDeleteCoupon(order?.id)}>
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

      <EditCouponModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        coupon={selectedCoupon}
        onSave={handleEditSave}
      />
    </div>
  );
}