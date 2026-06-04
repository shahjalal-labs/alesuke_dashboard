"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { useGetAllCouponsQuery, useSendCouponMutation } from "@/redux/api/admin/couponApi";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SendCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds: string[];
}

interface Coupon {
  id: string;
  title: string;
  code: string;
  discountType: string;
  discountValue: number;
  status: string;
  expireDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CouponResponse {
  success: boolean;
  message: string;
  result: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    result: Coupon[];
  };
}

export default function SendCouponModal({
  isOpen,
  onClose,
  selectedUserIds,
}: SendCouponModalProps) {
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch coupon data from API
  const {
    data: allCouponsData,
    isLoading: isLoadingCoupons,
    error: couponsError,
  } = useGetAllCouponsQuery({
    page: 1,
    limit: 10000,
  });

  const [sendCouponFn, { isLoading: isSending }] = useSendCouponMutation();

  const handleSend = async () => {
    if (!selectedCouponId || !message || selectedUserIds.length === 0) {
      toast.error("Please select a coupon, add a message, and select at least one user");
      return;
    }

    try {
      const response = await sendCouponFn({
        cuoponId: selectedCouponId,
        users: selectedUserIds,
        message: message,
      }).unwrap();

      if (response?.success) {
        toast.success("Coupon sent successfully!");
        onClose();
        setSelectedCouponId("");
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send coupon:", error);
      toast.error("Failed to send coupon. Please try again.");
    }
  };

  if (!isOpen) return null;

  const coupons = (allCouponsData as CouponResponse)?.result?.result || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Send Coupon</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Users Info */}
          {/* <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Sending to: {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-500">
              {selectedUserIds.length === 0 
                ? "No users selected. Please select users from the table first."
                : "The coupon will be sent to all selected users."}
            </p>
          </div> */}

          {/* Select Coupon */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select coupons *
            </label>
            <select
              value={selectedCouponId}
              onChange={(e) => setSelectedCouponId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
              disabled={isLoadingCoupons}
            >
              <option value="">Choose coupons</option>
              {isLoadingCoupons ? (
                <option value="" disabled>Loading coupons...</option>
              ) : couponsError ? (
                <option value="" disabled>Error loading coupons</option>
              ) : (
                coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.title} - {coupon.code} ({coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Custom message *
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message to customer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 ">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600"
            disabled={!selectedCouponId || !message || selectedUserIds.length === 0 || isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}