"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCouponMutation } from "@/redux/api/admin/couponApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNewCoupon() {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discountValue: "",
    discountType: "Percentage",
    expireDate: "",
  });

  const [createCouponFn, { isLoading }] = useCreateCouponMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
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

      console.log("Creating coupon:", couponData);

      // Make API call
      const result = await createCouponFn(couponData).unwrap();
      // console.log("Coupon created successfully:", result);
      if (result.success) {
        toast.success("Coupon created successfully");
        router.push("/admin/discounts")
      }

      // Reset form after successful submission
      handleCancel();
    } catch {
      console.error("Failed to create coupon:");
      toast.error("Failed to create coupon");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      code: "",
      discountValue: "",
      discountType: "Percentage",
      expireDate: "",
    });
  };

  const selectDiscountType = (type: "Percentage" | "Flat") => {
    handleInputChange("discountType", type);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="">
        {/* Create New Coupon Form */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            Create New Coupon
          </h1>

          <div className="space-y-6">
            {/* Coupon Title */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Coupon title
              </label>
              <Input
                placeholder="Happy Hour Special"
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
                  placeholder="WELCOME10"
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
                  value={
                    formData.expireDate ? dayjs(formData.expireDate) : null
                  }
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 h-12 text-base font-medium bg-primary text-white rounded-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
