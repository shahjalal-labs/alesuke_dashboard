import baseApi from "../baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query({
      query: ({ page, limit, searchTerm }) => ({
        url: `/order/payment-history?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),
  }),
});

export const { useGetAllPaymentsQuery } = paymentApi;
