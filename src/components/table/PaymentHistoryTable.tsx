/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import { useState } from "react";
import EditCouponModal from "../Admin/DiscountCoupon/EditCouponModal";

// Interface for the payment data from API
interface Payment {
  id: string;
  orderId: string;
  userId: string;
  totalAmount: number;
  isPaid: boolean;
  status: string;
  cancelReason: string | null;
  shippingAddressId: string;
  paymentMethodId: string;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  products: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      availability: string;
      quantity: number;
    };
  }>;
}

interface PaymentHistoryTableProps {
  paymentData: Payment[];
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

export default function PaymentHistoryTable({
  paymentData,
  onStatusChange,
}: PaymentHistoryTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon] = useState(null);

  const handleEditSave = (updatedCoupon: any) => {
    console.log("Saving coupon:", updatedCoupon);
    setIsEditModalOpen(false);
    // Handle save logic
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-t border-[#D1D6DB]">
          <tr>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Name
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Order ID
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Product Name
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Quantity
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {paymentData?.map((payment) => (
            <>
              {payment.products.map((productItem, index) => (
                <tr key={`${payment.orderId}-${index}`} className="hover:bg-gray-50 ">
                  {/* Only show user name for the first product in the order */}
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {index === 0 && (
                      `${payment.user.firstName} ${payment.user.lastName}`
                    )}
                  </td>

                  {/* Only show order ID for the first product in the order */}
                  <td className="py-4 px-6 text-gray-900">
                    {index === 0 && payment.orderId}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {productItem.product?.images?.[0] && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={productItem.product.images[0]}
                            alt={productItem.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="text-gray-900 font-medium">
                        {productItem.product?.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-gray-600">
                    {productItem.quantity || 0}
                  </td>

                  {/* Only show total amount for the first product in the order */}
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {index === 0 && `$${payment.totalAmount.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </>
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