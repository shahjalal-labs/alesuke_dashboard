"use client";
import { useState, useEffect } from "react";
import DiscountTable from "@/components/table/DiscountTable";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { useGetAllCouponsQuery } from "@/redux/api/admin/couponApi";
import SimpleLoader from "@/components/ui/SimpleLoader";

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'Percentage' | 'Fixed' | 'Free Shipping'; 
  discountValue: number;
  expireDate: string;
  status: 'Active' | 'Expired' | 'Inactive' | 'Used'; 
  createdAt: string;
  updatedAt: string;
}

// Interface for the formatted data used in the table
interface FormattedCoupon {
  id: string;
  couponTitle: string;
  couponCode: string;
  discount: string;
  endDate: string;
  status: string;
}

export default function Discount() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formattedCouponData, setFormattedCouponData] = useState<FormattedCoupon[]>([]);
  
  // Fetch coupon data from API
  const { data: allCouponsData, isLoading, error } = useGetAllCouponsQuery({
    page: currentPage,
    limit: itemsPerPage
  });
  
  // Format coupon data for the table
  useEffect(() => {
    if (allCouponsData?.success && allCouponsData?.result?.result) {
      const formattedData = allCouponsData.result.result.map((coupon: Coupon) => ({
        id: coupon.id,
        couponTitle: coupon.title,
        couponCode: coupon.code,
        discount: coupon.discountType === "Percentage" 
          ? `${coupon.discountValue}% OFF` 
          : `$${coupon.discountValue} OFF`,
        endDate: new Date(coupon.expireDate).toLocaleDateString('en-GB'), 
        status: coupon.status
      }));
      
      setFormattedCouponData(formattedData);
    }
  }, [allCouponsData]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="py-8 bg-white rounded-[16px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">Discount & Coupons</h1>
          <div className="flex items-center gap-3">
            <Link
              href={`discounts/create-new-coupon`}
              className="bg-primary text-white px-6 py-3 rounded-[40px] transition-colors text-[18px] font-medium"
            >
              + Create New Coupon
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>
            <SimpleLoader/>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 bg-white rounded-[16px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">Discount & Coupons</h1>
          <div className="flex items-center gap-3">
            <Link
              href={`discounts/create-new-coupon`}
              className="bg-primary text-white px-6 py-3 rounded-[40px] transition-colors text-[18px] font-medium"
            >
              + Create New Coupon
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading coupons. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Discount & Coupons
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href={`discounts/create-new-coupon`}
              className="bg-primary text-white px-6 py-3 rounded-[40px] transition-colors text-[18px] font-medium"
            >
              + Create New Coupon
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <DiscountTable orderData={formattedCouponData} />
        </div>

        {/* Pagination */}
        {allCouponsData?.result?.meta && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={allCouponsData.result.meta.total}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
              itemsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>
    </div>
  );
}