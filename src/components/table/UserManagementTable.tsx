"use client";

import { Button } from "@/components/ui/button";
import { useDeleteUserMutation } from "@/redux/api/admin/dashboarApi";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  proffesion: string | null;
  profileImage: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserManagementTableProps {
  users: User[];
  onUserSelectionChange: (userIds: string[]) => void;
}

export default function UserManagementTable({
  users,
  onUserSelectionChange,
}: UserManagementTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Notify parent component when selection changes
  useEffect(() => {
    onUserSelectionChange(selectedUsers);
  }, [selectedUsers, onUserSelectionChange]);

  // Handle individual checkbox selection
  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const [deleteUserFn] = useDeleteUserMutation();

  const handleDeleteUser = async (id: string) => {
    // Set loading state for this specific user
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await deleteUserFn(id).unwrap();
      if (response?.success) {
        toast.success("User deleted successfully");
        // Remove deleted user from selection
        setSelectedUsers(prev => prev.filter(userId => userId !== id));
      }
    } catch {
      toast.error("User deletion failed");
    } finally {
      // Clear loading state for this specific user
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-t border-gray-200">
          <tr>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === users.length && users.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Name
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Email Address
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Phone number
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Profession
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Status
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Role
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 border-b border-gray-100"
            >
              <td className="py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.profileImage || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-900 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600">{user.email}</td>
              <td className="py-4 px-4 text-gray-600">{user.phone || "N/A"}</td>
              <td className="py-4 px-4 text-gray-600">
                {user.proffesion || "N/A"}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-4 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loadingStates[user.id]}
                >
                  {loadingStates[user.id] ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}