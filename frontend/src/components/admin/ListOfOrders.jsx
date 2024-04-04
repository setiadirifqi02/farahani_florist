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

  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row?.paymentInfo?.status,
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
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

  return (
    <>
      <MetaData title="Daftar Pesanan" />
      <AdminLayout>
        <div className="list-order___page flex flex-col overflow-clip lg:overflow-visible">
          <h2 className="subHeadingTitle capitalize py-3">
            Daftar Pesanan: {data?.orders?.length}
          </h2>
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
