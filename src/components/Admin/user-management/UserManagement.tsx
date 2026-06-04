"use client";
import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/api/admin/userApi";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  maritalStatus: string | null;
  religion: string | null;
  nickname: string | null;
  profileImage: string | null;
  addresses?: {
    country: string;
  };
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      totalPages: number;
      currentPage: number;
    };
    users: User[];
  };
}

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users with pagination
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: limit,
  });

  const [deleteUserFn, { isLoading: isDeleting }] = useDeleteUserMutation();

  const userData = data as ApiResponse | undefined;
  const users = userData?.data?.users || [];
  const meta = userData?.data?.meta;

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserFn(userId).unwrap();
        refetch(); // Refresh the user list
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Handle view user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Format marital status for display
  const formatMaritalStatus = (status: string | null) => {
    if (!status) return "Not specified";
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Format religion for display
  const formatReligion = (religion: string | null) => {
    if (!religion) return "Not specified";
    return religion.charAt(0) + religion.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load users. Please try again.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total Users Card */}
          <div className="bg-[#36B8401A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {meta?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-[#FAAD141A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {meta?.activeUsers || 0}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Inactive Users Card */}
          <div className="bg-[#FF00001A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Inactive Users
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {meta?.inactiveUsers || 0}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* User List Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-10">
          <h1 className="text-xl font-bold text-gray-800 py-8 pl-4">
            User List
          </h1>
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
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nickname
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Religion
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marital Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.addresses?.country || "Not specified"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.nickname || "Not specified"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatReligion(user.religion)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatMaritalStatus(user.maritalStatus)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatStatus(user.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-orange-400 hover:text-orange-600 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting}
                            className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found</p>
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
                        {Math.min(currentPage * limit, meta.totalUsers)}
                      </span>{" "}
                      of <span className="font-medium">{meta.totalUsers}</span>{" "}
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

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Profile Image */}
                  {selectedUser.profileImage && (
                    <div className="flex justify-center">
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.fullName}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* User Information */}
                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.fullName}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedUser.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formatStatus(selectedUser.status)}
                      </span>
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Nickname
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.nickname || "Not specified"}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Religion
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatReligion(selectedUser.religion)}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Marital Status
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatMaritalStatus(selectedUser.maritalStatus)}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Country
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.addresses?.country || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      User ID
                    </label>
                    <p className="mt-1 text-sm text-gray-500 font-mono">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;