"use client";
import React, { useState } from "react";
import {
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllSalesQuery } from "@/redux/api/admin/userApi";

interface Subscription {
  id: string;
  amount: number;
  productId: string;
  createdAt: string;
  status: string;
  user: {
    profileImage: string | null;
    fullName: string;
    email: string;
  };
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: {
      totalSubscriptions: number;
      totalEssentialWill: number;
      totalUnlimitedLegacy: number;
      totalPages: number;
      currentPage: number;
    };
    subscriptions: Subscription[];
  };
}

const SalesActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch subscriptions with pagination
  const { data, isLoading, isError, refetch } = useGetAllSalesQuery({
    page: currentPage,
    limit: limit,
  });

  const subscriptionData = data as ApiResponse | undefined;
  const subscriptions = subscriptionData?.data?.subscriptions || [];
  const meta = subscriptionData?.data?.meta;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format plan name
  const formatPlanName = (productId: string) => {
    switch (productId) {
      case 'essential_will':
        return 'Essential Will';
      case 'unlimited_legacy':
        return 'Unlimited Legacy';
      default:
        return productId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load subscriptions. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Essential Will Subscriber Card */}
          <div className="bg-[#36B8401A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Essential Will Subscriber</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {meta?.totalEssentialWill || 0}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Unlimited Legacy Subscriber Card */}
          <div className="bg-[#FAAD141A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Unlimited Legacy Subscriber</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {meta?.totalUnlimitedLegacy || 0}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Subscription List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-10">
          <h1 className="text-xl font-bold text-gray-800 py-8 pl-4">Subscription List</h1>
          <div className="">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscription.user.fullName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {subscription.user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatPlanName(subscription.productId)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        ${subscription.amount}
                       </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(subscription.createdAt)}
                       </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            subscription.status === "SUCCEEDED"
                              ? "bg-green-100 text-green-800"
                              : subscription.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatStatus(subscription.status)}
                        </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {subscriptions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No subscriptions found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 0 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.totalPages}
                    className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * limit, meta.totalSubscriptions)}
                      </span>{" "}
                      of <span className="font-medium">{meta.totalSubscriptions}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {(() => {
                        const pages = [];
                        const totalPages = meta.totalPages;
                        const current = currentPage;

                        // First page
                        if (totalPages > 0) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => handlePageChange(1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                current === 1
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              1
                            </button>
                          );
                        }

                        // Ellipsis after first page
                        if (current > 3) {
                          pages.push(
                            <span
                              key="ellipsis1"
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }

                        // Pages around current
                        for (
                          let i = Math.max(2, current - 1);
                          i <= Math.min(totalPages - 1, current + 1);
                          i++
                        ) {
                          if (i === 1 || i === totalPages) continue;
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                current === i
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Ellipsis before last page
                        if (current < totalPages - 2) {
                          pages.push(
                            <span
                              key="ellipsis2"
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }

                        // Last page
                        if (totalPages > 1) {
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => handlePageChange(totalPages)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                current === totalPages
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === meta.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesActivity;