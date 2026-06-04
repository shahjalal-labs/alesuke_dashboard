/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import profile1 from "@/assets/profile1.png";
import OrderListTable from "@/components/table/OrderListTable";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import SimpleLoader from "@/components/ui/SimpleLoader";
import {
  useGetAllOrderListQuery,
  useUpdateStatusMutation,
} from "@/redux/api/admin/orderApi";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define the order interface
interface Order {
  id: string;
  orderNumber: string;
  products: Array<{
    name: string;
    image: string;
    quantity: number;
  }>;
  customerName: string;
  customerAvatar: any;
  email: string;
  price: string;
  totalQuantity: number;
  status: string;
  originalData: any;
  isUpdating?: boolean; // Add individual loading state
}

export default function OrderList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Use debounce for search to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const {
    data: getAllOrderListData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrderListQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: debouncedSearch || undefined,
  });

  const [updateStatusFn] = useUpdateStatusMutation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Transform API data to match table structure
  useEffect(() => {
    if (getAllOrderListData && getAllOrderListData?.result?.result) {
      const transformedOrders = getAllOrderListData.result.result.map(
        (order: any) => ({
          id: order.id,
          orderNumber: order.orderId,
          products: order.products
            ? order.products.map((product: any) => ({
                name: product.product?.name || "Unknown Product",
                image: product.product?.images?.[0] || "",
                quantity: product.quantity || 0,
              }))
            : [],
          customerName: order.user
            ? `${order.user.firstName || ""} ${
                order.user.lastName || ""
              }`.trim()
            : "Unknown Customer",
          customerAvatar: profile1,
          email: order.user?.email || "No email",
          price: `$${order.totalAmount?.toFixed(2) || "0.00"}`,
          totalQuantity: order.products
            ? order.products.reduce(
                (sum: number, product: any) => sum + (product.quantity || 0),
                0
              )
            : 0,
          status: order.status || "Unknown",
          originalData: order,
          isUpdating: false, // Initialize as not updating
        })
      );

      setOrders(transformedOrders);

      if (getAllOrderListData.result.meta) {
        setTotalItems(getAllOrderListData.result.meta.total);
      }
    }
  }, [getAllOrderListData]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Find the order to get the display number for toast
      const order = orders.find((o) => o.id === orderId);

      // Set individual loading state for this order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId 
            ? { ...order, isUpdating: true } 
            : order
        )
      );

      // Call the API to update the status using the actual order ID
      const response = await updateStatusFn({
        id: orderId,
        data: {
          status: newStatus,
        },
      }).unwrap();

      if (response?.success) {
        // Update the status and remove loading state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId 
              ? { ...order, status: newStatus, isUpdating: false } 
              : order
          )
        );

        // Show success toast
        toast.success(
          `Order #${order?.orderNumber} status has been updated to ${newStatus}`
        );

        // Refetch the data to ensure consistency
        refetch();
      }
    } catch (error: any) {
      // Remove loading state on error
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId 
            ? { ...order, isUpdating: false } 
            : order
        )
      );

      // Show error toast
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  if (isLoading) {
    return <SimpleLoader />;
  }

  if (error) {
    return <div className="p-8">Error loading orders</div>;
  }

  return (
    <div>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">Order List</h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <OrderListTable
            orderData={orders}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
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
    </div>
  );
}