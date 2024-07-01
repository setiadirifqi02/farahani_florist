import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CSVDownload, CSVLink } from "react-csv";

import { Button, Spinner, Tooltip } from "@nextui-org/react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";

import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/productsApi";
import { showFormattedDate } from "../../helpers/helpers";

const ListOfProducts = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();

  const [
    deleteProduct,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteProductMutation();

  // console.log(data);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Produck dihapus");
    }
  }, [error, deleteError, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      width: "240px",
    },
    {
      name: "Nama Produk",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      width: "100px",
    },
    {
      name: "Input by",
      selector: (row) => row?.user?.email,
      width: "200px",
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
      width: "200px",
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Eidt Produk"
          >
            <Link
              to={`/admin/products/${row?._id}`}
              className="btn btn-primary"
            >
              <PencilIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
          <Tooltip
            className="text-white"
            showArrow={true}
            color="secondary"
            content="Unggah foto produk"
          >
            <Link
              to={`/admin/products/${row?._id}/upload_images`}
              className="btn btn-success ms-2"
            >
              <PhotoIcon className="h-4 text-blue-500 " />
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
              onClick={() => deleteProductHandler(row?._id)}
              disabled={isDeleteLoading}
            >
              <TrashIcon className="h-4 text-red-500 " />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const headers = [
    { label: "ID", key: "_id" },
    { label: "Name", key: "name" },
    { label: "Harga", key: "price" },
    { label: "Stok", key: "stock" },
    { label: "Warna", key: "color" },
    { label: "Input by", key: "user.email" },
  ];

  return (
    <>
      <MetaData title="Daftar produk" />
      <AdminLayout>
        <div className="list-product___page flex flex-col overflow-scroll lg:overflow-scroll">
          <div className="flex w-full justify-between items-center lg:pr-2">
            <h2 className="subHeadingTitle capitalize py-3">
              Daftar Produk: {data?.products?.length}
            </h2>

            {/* Export to csv button */}
            {data?.products ? (
              <CSVLink
                data={data?.products}
                headers={headers}
                filename="Data Produk Farhani Florist"
              >
                <Button
                  variant="light"
                  className="font-poppins"
                  startContent={
                    <CloudArrowDownIcon className="h-4 text-blue-500 " />
                  }
                >
                  Download CSV
                </Button>
              </CSVLink>
            ) : (
              <></>
            )}
          </div>

          <DataTable
            className="font-poppins"
            columns={columns}
            data={data?.products}
            pagination
          />
        </div>
      </AdminLayout>
    </>
  );
};
export default ListOfProducts;
