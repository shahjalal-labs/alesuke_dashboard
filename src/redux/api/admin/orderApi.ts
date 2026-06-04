/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrderList: builder.query({
      query: ({ searchTerm, page, limit }) => {
        const params: Record<string, any> = {};

        if (searchTerm) params.searchTerm = searchTerm;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return {
          url: `/order`,
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    getAllDisputeOrder: builder.query({
      query: ({ status, searchTerm, page, limit }) => {
        const params: Record<string, any> = {};

        if (searchTerm) params.searchTerm = searchTerm;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return {
          url: `/order?status=${status}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: `/products/categories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),

    orderDetails: builder.query({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    updateStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetAllOrderListQuery,
  useOrderDetailsQuery,
  useGetAllDisputeOrderQuery,
  useUpdateStatusMutation
} = orderApi;
