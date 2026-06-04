import baseApi from "../baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: ({ page, limit }) => ({
        url: `/cuopon?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["coupon"],
    }),

    createCoupon: builder.mutation({
      query: (data) => ({
        url: `/cuopon`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coupon"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cuopon/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["coupon"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/cuopon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),

    sendCoupon: builder.mutation({
      query: (data) => ({
        url: `/cuopon/send-user`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["coupon"],
    }),

  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useSendCouponMutation
} = couponApi;
