import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Button, Spinner, Tooltip } from "@nextui-org/react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteOrderMutation,
  useGetOrdersByAdminQuery,
} from "../../redux/api/orderApi";

import { showFormattedDate } from "../../helpers/helpers";
import { CSVLink } from "react-csv";
import ExportCSVButton from "../atoms/ExportCSVButton";

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
            content="Eidit Order"
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

  // colomn header for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Status Pembayaran", key: "paymentInfo.status" },
    { label: "Status Pesanan", key: "orderStatus" },
    { label: "User", key: "user.email" },
    { label: "Total", key: "totalAmount" },
    { label: "Tanggal", key: "updatedAt" },
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

            {/* Export to csv button */}
            {data?.orders ? (
              <ExportCSVButton
                data={data?.orders}
                headers={headers}
                filename={"Data Pesanan Farhani Florist"}
              />
            ) : (
              <></>
            )}
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
