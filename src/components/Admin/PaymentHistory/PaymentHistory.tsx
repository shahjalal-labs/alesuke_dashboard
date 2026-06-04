"use client";
import PaymentHistoryTable from "@/components/table/PaymentHistoryTable";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/Pagination";
import SimpleLoader from "@/components/ui/SimpleLoader";
import { useGetAllPaymentsQuery } from "@/redux/api/admin/paymentApi";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Interface for the payment data
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

// Interface for the API response
interface PaymentResponse {
  success: boolean;
  message: string;
  result: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    result: Payment[];
  };
}

export default function PaymentHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Use the query hook with parameters for pagination and search
  const { data, isLoading, error } = useGetAllPaymentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || "",
  });

  // Update local state when data changes
  useEffect(() => {
    if (data?.success) {
      const paymentData = data as PaymentResponse;
      setPayments(paymentData.result.result);
      setTotalItems(paymentData.result.meta.total);
    }
  }, [data]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // This would typically be an API call to update the status
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.orderId === orderId
          ? { ...payment, status: newStatus }
          : payment
      )
    );
  };

  // Handle search with debounce to avoid too many API calls
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (isLoading) {
    return (
      <div>
        <SimpleLoader />
      </div>
    );
  }

  if (error) {
    return <div className="p-6">Error loading payment history.</div>;
  }

  return (
    <div>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment History
          </h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order ID, product name, or customer"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-48 md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <PaymentHistoryTable
            paymentData={payments}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Pagination */}
      </div>
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
