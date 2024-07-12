import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Spinner, Tooltip } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteOrderMutation,
  useGetOrdersByAdminQuery,
} from "../../redux/api/orderApi";

import { showFormattedDate } from "../../helpers/helpers";
import ExportCSVButton from "../atoms/ExportCSVButton";
import ExportPDFButton from "../atoms/ExportPDFButton";

const ListOfOrders = () => {
  const { data, isLoading, error } = useGetOrdersByAdminQuery();
  const [
    deleteOrder,
    { error: deleteError, isSuccess, isLoading: isDeleteLoading },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Pesanan dihapus");
    }
  }, [error, isSuccess, deleteError]);

  if (isLoading) return <Spinner color="primary" />;

  const deleteOrderHandler = (id) => {
    deleteOrder(id);
  };

  // colomn of react data table component
  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "220px",
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row?.paymentInfo?.status,
      sortable: true,
      width: "220px",
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
      sortable: true,
      width: "220px",
    },
    {
      name: "User",
      selector: (row) => row?.user?.email,
      width: "220px",
    },
    {
      name: "totalAmount",
      selector: (row) => row?.totalAmount,
    },
    {
      name: "Dikonfirmasi",
      selector: (row) => row?.isConfirmedByUser,
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Edit Order"
          >
            <Link to={`/admin/orders/${row?._id}`} className="btn btn-primary">
              <PencilIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
          <Tooltip
            className="text-white"
            showArrow={true}
            color="danger"
            content="Hapus Produk"
          >
            <button
              className="mx-2"
              onClick={() => deleteOrderHandler(row?._id)}
              disabled={isDeleteLoading}
            >
              <TrashIcon className="h-4 text-red-500 " />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const ordersData = data?.orders.map((item) => ({
    _id: item._id,
    payment_status: item.paymentInfo.status,
    orderStatus: item.orderStatus,
    user: item.user.email,
    totalAmount: `Rp.${item.totalAmount}`,
    paymentMethod: item.paymentMethod,
    city: item.shippingInfo.city,
    address: item.shippingInfo.address,
    date: item.updatedAt,
    orderItems: item.orderItems.map(
      (order) => `${order.name}, Rp.${order.price}, ${order.quantity} buah`
    ),
  }));

  // colomn header for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Status Pembayaran", key: "payment_status" },
    { label: "Metode Pembayaran", key: "paymentMethod" },
    { label: "Status Pesanan", key: "orderStatus" },
    { label: "User", key: "user" },
    { label: "Unit Pembelian", key: "orderItems" },
    { label: "Total", key: "totalAmount" },
    { label: "Kota", key: "city" },
    { label: "Alamat", key: "address" },
    { label: "Tanggal", key: "date" },
  ];

  return (
    <>
      <MetaData title="Daftar Pesanan" />
      <AdminLayout>
        <div className="list-order___page flex flex-col overflow-scroll lg:overflow-scroll">
          <div className="flex w-full justify-between items-center lg:pr-2">
            <h2 className="subHeadingTitle capitalize py-3">
              Daftar Pesanan: {data?.orders?.length}
            </h2>

            <div className="export-btn flex gap-4 items-center">
              <ExportPDFButton link={"/admin/orders/report"} />

              {/* Export to csv button */}
              {data?.orders ? (
                <ExportCSVButton
                  data={ordersData}
                  headers={headers}
                  filename={"Data Pesanan Farhani Florist"}
                />
              ) : (
                <></>
              )}
            </div>
          </div>

          <DataTable
            className="font-poppins"
            columns={columns}
            data={data?.orders}
            pagination
          />
        </div>
      </AdminLayout>
    </>
  );
};
export default ListOfOrders;
