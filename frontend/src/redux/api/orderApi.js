import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Order", "AdminOrders"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/orders/new",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Order"],
    }),
    createCheckout: builder.mutation({
      query(body) {
        return {
          url: "/payment/checkout",
          method: "POST",
          body,
        };
      },
    }),
    myOrders: builder.query({
      query: () => `/me/orders`,
      providesTags: ["Order"],
      invalidatesTags: ["Order"],
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
    }),
    getOrdersByAdmin: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["Order", "AdminOrders"],
      invalidatesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery,
  useGetOrdersByAdminQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useCreateCheckoutMutation,
} = orderApi;
