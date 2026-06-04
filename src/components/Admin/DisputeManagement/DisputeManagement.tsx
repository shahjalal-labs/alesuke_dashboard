"use client";

import DisputeManagementTable from "@/components/table/DisputeManagementTable";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import SimpleLoader from "@/components/ui/SimpleLoader";
import { useGetAllDisputeOrderQuery } from "@/redux/api/admin/orderApi";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// ----------------- Define the type -----------------
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

interface DisputeResponse {
  success: boolean;
  message: string;
  result: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    result: DisputeOrder[];
  };
}

// ----------------- Component -----------------
export default function DisputeManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<DisputeOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const {
    data: disputeOrderData,
    isLoading,
    error,
  } = useGetAllDisputeOrderQuery({
    status: "Cancelled",
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || "",
  });

  useEffect(() => {
    if (disputeOrderData?.success) {
      const response = disputeOrderData as DisputeResponse;
      setOrders(response.result.result);
      setTotalItems(response.result.meta.total);
    }
  }, [disputeOrderData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>
      <SimpleLoader/>
    </div>;
  }

  if (error) {
    return <div className="p-6">Error loading dispute orders.</div>;
  }

  return (
    <div>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dispute Management
          </h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order ID, customer name, or product"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-48 md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <DisputeManagementTable orderData={orders} />
        </div>
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
  );
}
