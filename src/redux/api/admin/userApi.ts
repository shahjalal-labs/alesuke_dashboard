import baseApi from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({page, limit}) => ({
        url: `/admin/all-users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),

     getAllSales: builder.query({
      query: ({page, limit}) => ({
        url: `/admin/all-subscriptions?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetAllUsersQuery, useDeleteUserMutation, useGetAllSalesQuery } = userApi;
