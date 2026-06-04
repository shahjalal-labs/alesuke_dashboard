import baseApi from "../baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductCategories: builder.query({
      query: () => ({
        url: `/products/categories`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: `/products/categories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    getCategoriesProducts: builder.query({
      query: ({ productCategory, page, limit }) => ({
        url: `/products?productCategory=${productCategory}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    getSingleProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: `/products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/products/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    editCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    updateShippingCost: builder.mutation({
      query: (data) => ({
        url: `/order/update-shipping-charge`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    getShippingCost: builder.query({
      query: () => ({
        url: `/order/shipping/charge`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
  }),
});

export const {
  useGetAllProductCategoriesQuery,
  useCreateCategoryMutation,
  useGetCategoriesProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetSingleProductDetailsQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useUpdateShippingCostMutation,
  useGetShippingCostQuery,
} = productApi;
