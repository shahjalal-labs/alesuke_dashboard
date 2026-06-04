"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  image: string;
  quantity: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  products: Product[];
  customerName: string;
  customerAvatar: StaticImageData;
  email: string;
  price: string;
  totalQuantity: number;
  status: string;
  isUpdating?: boolean;
}

interface OrderTableProps {
  orderData: OrderRecord[];
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

// Map API status values to dropdown options
const statusOptions = [
  { value: "Pending", label: "Order Pending" },
  { value: "Processed", label: "Order Processed" },
  { value: "Shipped", label: "Order Shipped" },
  { value: "InRoute", label: "Order in Route" },
  { value: "Delivered", label: "Order Delivered" },
];

// Function to get display label for a status value
const getStatusLabel = (status: string) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : status;
};

// Function to check if order is delivered
const isOrderDelivered = (status: string) => {
  return status === "Delivered";
};

export default function OrderListTable({
  orderData,
  onStatusChange,
}: OrderTableProps) {
  const router = useRouter();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    onStatusChange?.(orderId, newStatus);
  };

  const handleRowClick = (orderId: string) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-t border-[#D1D6DB]">
          <tr>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Order ID
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Products
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Name
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Email Address
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Price
            </th>
            <th className="text-left py-4 px-6 font-semibold text-default">
              Quantity
            </th>
            <th className="text-center py-4 px-6 font-semibold text-default">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {orderData?.map((order) => {
            const isDelivered = isOrderDelivered(order.status);
            const isUpdating = order.isUpdating || false;

            return (
              <tr
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(order.id)}
              >
                <td className="py-4 px-6 text-gray-900 font-medium">
                  #{order.orderNumber}
                </td>

                <td className="py-4 px-6">
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-gray-900 font-medium text-sm truncate">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.products.length === 0 && (
                      <span className="text-gray-500 text-sm">No products</span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={order.customerAvatar || "/placeholder.svg"}
                        alt={order.customerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {order.customerName}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-gray-600">{order.email}</td>

                <td className="py-4 px-6 text-gray-900 font-medium">
                  {order.price}
                </td>

                <td className="py-4 px-6 text-gray-900 text-center">
                  {order.totalQuantity}
                </td>

                <td
                  className="py-4 px-6 flex items-center justify-center"
                  onClick={(event) => event.stopPropagation()}
                >
                  {isUpdating ? (
                    <div className="w-40 flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    </div>
                  ) : (
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value)
                      }
                      disabled={isDelivered || isUpdating}
                    >
                      <SelectTrigger
                        className={`w-40 ${
                          isDelivered
                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                            : "bg-[#FEEAD1] text-default hover:bg-orange-100"
                        } rounded-[80px]`}
                      >
                        <SelectValue>
                          {getStatusLabel(order.status)}
                          {isDelivered && " ✓"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            disabled={isDelivered}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
