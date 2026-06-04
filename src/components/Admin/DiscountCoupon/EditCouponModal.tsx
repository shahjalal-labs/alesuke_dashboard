"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateCouponMutation } from "@/redux/api/admin/couponApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Calendar, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  couponTitle: string;
  couponCode: string;
  discount: string;
  endDate: string;
  status: string;
  discountType?: string;
  discountValue?: number;
  expireDate?: string;
}

interface EditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSave: (coupon: Coupon) => void;
}

export default function EditCouponModal({
  isOpen,
  onClose,
  coupon,
  
}: EditCouponModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discountValue: "",
    discountType: "Percentage",
    expireDate: "",
  });

  console.log("coupon data", coupon);

  const [showDropdown, setShowDropdown] = useState(false);
  const [updateCouponFn, { isLoading }] = useUpdateCouponMutation();

  // Function to parse date from various formats
  const parseDate = (dateString: string): string => {
    if (!dateString) return "";

    // Try to parse the date - handle different formats
    let date: Date;

    // Handle DD-MM-YYYY format (from table display)
    if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
      const [day, month, year] = dateString.split("-");
      date = new Date(`${year}-${month}-${day}`);
    }
    // Handle ISO format (from API)
    else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "";
    }

    // Return in YYYY-MM-DD format for the DatePicker
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (coupon) {
      // Extract discount value from the discount string (e.g., "5% OFF" -> "5")
      let discountValue = "";
      let discountType = "Percentage";

      if (coupon.discount && coupon.discount.includes("%")) {
        discountValue = coupon.discount.replace("% OFF", "").trim();
        discountType = "Percentage";
      } else if (coupon.discount && coupon.discount.includes("₫")) {
        discountValue = coupon.discount.replace("₫ OFF", "").trim();
        discountType = "Flat";
      }

      // Parse the date from either expireDate or endDate
      const dateToUse = coupon.expireDate || coupon.endDate || "";
      const parsedDate = parseDate(dateToUse);

      setFormData({
        title: coupon.couponTitle || "",
        code: coupon.couponCode || "",
        discountValue:
          discountValue ||
          (coupon.discountValue ? coupon.discountValue.toString() : ""),
        discountType: coupon.discountType || discountType,
        expireDate: parsedDate,
      });
    }
  }, [coupon]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectDiscountType = (type: "Percentage" | "Flat") => {
    handleInputChange("discountType", type);
    setShowDropdown(false);
  };

  const handleSave = async () => {
    if (!coupon?.id) {
      toast.error("No coupon selected for editing");
      return;
    }

    try {
      // Format the data for API
      const couponData = {
        title: formData.title,
        code: formData.code,
        discountValue: Number(formData.discountValue),
        discountType: formData.discountType,
        expireDate: formData.expireDate
          ? new Date(formData.expireDate).toISOString()
          : "",
      };

      // Make API call
      const result = await updateCouponFn({
        id: coupon.id,
        data: couponData,
      }).unwrap();

      if (result?.success) {
        toast.success("Coupon updated successfully");

        onClose();
      }
    } catch (error) {
      console.error("Failed to update coupon:", error);
      toast.error("Failed to update coupon");
    }
  };

  const handleCancel = () => {
    if (coupon) {
      // Reset form data to original values
      let discountValue = "";
      let discountType = "Percentage";

      if (coupon.discount && coupon.discount.includes("%")) {
        discountValue = coupon.discount.replace("% OFF", "").trim();
        discountType = "Percentage";
      } else if (coupon.discount && coupon.discount.includes("₫")) {
        discountValue = coupon.discount.replace("₫ OFF", "").trim();
        discountType = "Flat";
      }

      // Parse the date from either expireDate or endDate
      const dateToUse = coupon.expireDate || coupon.endDate || "";
      const parsedDate = parseDate(dateToUse);

      setFormData({
        title: coupon.couponTitle || "",
        code: coupon.couponCode || "",
        discountValue:
          discountValue ||
          (coupon.discountValue ? coupon.discountValue.toString() : ""),
        discountType: coupon.discountType || discountType,
        expireDate: parsedDate,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 md:p-8 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
          Edit Coupon
        </h2>

        <div className="space-y-6">
          {/* Coupon Title */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Coupon title
            </label>
            <Input
              placeholder="Coupon title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full h-14 px-4 text-base border-gray-200 rounded-xl focus:border-primary focus:ring-orange-500"
            />
          </div>

          {/* Coupon Code and Discount Value */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Coupon Code */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Coupon Code
              </label>
              <Input
                placeholder="Coupon Code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="w-full h-14 px-4 text-base border-gray-200 rounded-xl focus:border-primary focus:ring-orange-500"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Discount Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full h-14 px-4 flex items-center justify-between border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-primary focus:ring-orange-500"
                >
                  <span className="capitalize">
                    {formData.discountType.toLowerCase()}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                    <button
                      type="button"
                      onClick={() => selectDiscountType("Percentage")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-xl"
                    >
                      Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => selectDiscountType("Flat")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-xl"
                    >
                      Flat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Discount Value
              </label>
              <div className="relative">
                <Input
                  placeholder={
                    formData.discountType === "Percentage" ? "10" : "10000"
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    handleInputChange("discountValue", e.target.value)
                  }
                  type="number"
                  min="0"
                  className="w-full h-14 px-4 pr-12 text-base border-gray-200 rounded-xl focus:border-primary focus:ring-orange-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                  {formData.discountType === "Percentage" ? "%" : "₫"}
                </span>
              </div>
            </div>
          </div>

          {/* Expire Date with Ant DatePicker */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Expire Date
            </label>
            <div className="relative">
              <DatePicker
                className="w-full h-14 px-4 text-base border-gray-200 rounded-xl focus:border-primary focus:ring-orange-500"
                format="YYYY-MM-DD"
                value={formData.expireDate ? dayjs(formData.expireDate) : null}
                onChange={(date, dateString) =>
                  handleInputChange("expireDate", dateString as string)
                }
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-8 py-3 h-12 text-base font-medium border-2 border-primary text-primary rounded-full hover:bg-orange-50 bg-transparent disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 h-12 text-base font-medium bg-primary text-white rounded-full disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
