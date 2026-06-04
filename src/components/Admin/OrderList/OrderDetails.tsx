"use client";

import SimpleLoader from "@/components/ui/SimpleLoader";
import { useOrderDetailsQuery } from "@/redux/api/admin/orderApi";
import { ArrowLeft, Calendar, Mail, MapPin, Package, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface OrderProduct {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    images?: string[];
    price: number;
    availability?: string;
    quantity?: number;
  };
}

interface ShippingAddress {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface OrderDetailsResult {
  id: string;
  orderId: string;
  totalAmount: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string | null;
  products?: OrderProduct[];
  shippingAddress?: ShippingAddress;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const getStatusStyles = (status: string) => {
  const base = "inline-flex rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "Delivered":
      return `${base} bg-green-100 text-green-700`;
    case "Shipped":
    case "InRoute":
      return `${base} bg-blue-100 text-blue-700`;
    case "Processed":
      return `${base} bg-amber-100 text-amber-700`;
    case "Pending":
      return `${base} bg-orange-100 text-orange-700`;
    default:
      return `${base} bg-gray-100 text-gray-700`;
  }
};

function formatCurrency(value: number) {
  return `$${value?.toFixed(2) ?? "0.00"}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
}

export default function OrderDetails() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const {
    data: getOrderDetailsData,
    isLoading,
    isError,
  } = useOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  const order: OrderDetailsResult | undefined = getOrderDetailsData?.result;

  if (isLoading) {
    return <SimpleLoader />;
  }

  if (isError || !order) {
    return (
      <div className="bg-white rounded-[16px] p-8">
        <p className="text-red-600 text-lg font-medium">Failed to load order details.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order List
        </Link>
      </div>
    );
  }

  const customerName = `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "N/A";
  const products = order.products ?? [];
  const totalItems = products.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = products.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">Review complete order summary and customer information.</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500 mb-1">Order ID</p>
          <p className="text-sm font-semibold text-gray-900 break-all">#{order.orderId}</p>
        </div>
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span className={getStatusStyles(order.status)}>{order.status}</span>
        </div>
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500 mb-1">Payment</p>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {order.isPaid ? "Paid" : "Cash on Delivery"}
          </span>
        </div>
        <div className="rounded-xl bg-white border p-4">
          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[16px] bg-white border overflow-hidden">
          <div className="border-b px-6 py-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Ordered Products</h2>
          </div>

          <div className="divide-y">
            {products.length > 0 ? (
              products.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border flex-shrink-0 bg-gray-50">
                      <Image
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item.product?.name || "Product image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.product?.name || "Unknown Product"}</p>
                      <p className="text-xs text-gray-500 mt-1">Unit Price: {formatCurrency(item.price || 0)}</p>
                      <p className="text-xs text-gray-500">Stock: {item.product?.quantity ?? "N/A"}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-900">x{item.quantity || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-sm text-gray-500">No products found for this order.</div>
            )}
          </div>

          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Items: {totalItems}</p>
            <p className="text-sm font-semibold text-gray-900">Subtotal: {formatCurrency(subtotal)}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[16px] bg-white border p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-900 font-medium">{customerName}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{order.user?.email || order.shippingAddress?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{order.shippingAddress?.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] bg-white border p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5" />
              <p>
                {order.shippingAddress?.address || "N/A"}
                <br />
                {[order.shippingAddress?.city, order.shippingAddress?.state]
                  .filter(Boolean)
                  .join(", ") || ""}
                {(order.shippingAddress?.city || order.shippingAddress?.state) && <br />}
                {[order.shippingAddress?.country, order.shippingAddress?.zipCode]
                  .filter(Boolean)
                  .join(" - ")}
              </p>
            </div>
          </div>

          <div className="rounded-[16px] bg-white border p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Updated At</p>
                  <p className="text-gray-900">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}