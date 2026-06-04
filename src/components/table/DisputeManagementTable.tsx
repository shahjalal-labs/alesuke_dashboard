"use client";

import Image from "next/image";

interface DisputeOrder {
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

interface OrderTableProps {
  orderData: DisputeOrder[];
}

export default function DisputeManagementTable({ orderData }: OrderTableProps) {
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
              Amount
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {orderData?.map((order) => (
            <>
              {order?.products.map((productItem, index) => (
                <tr key={`${order.id}-${index}`} className="hover:bg-gray-50">
                  {/* Only show user name for the first product in the order */}
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {index === 0 && (
                      `${order.user.firstName} ${order.user.lastName}`
                    )}
                  </td>

                  {/* Only show order ID for the first product in the order */}
                  <td className="py-4 px-6 text-gray-900">
                    {index === 0 && order.orderId}
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
                    {index === 0 && `$${order.totalAmount.toFixed(2)}`}
                  </td>

                  {/* Only show reason for the first product in the order */}
                  <td className="py-4 px-6 text-gray-600">
                    {index === 0 && (order.cancelReason || "N/A")}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}