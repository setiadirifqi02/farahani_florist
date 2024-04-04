import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Spinner, Tooltip } from "@nextui-org/react";
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";

import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/productsApi";

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
    },
    {
      name: "Nama Produk",
      selector: (row) => row.name,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
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

  return (
    <>
      <MetaData title="Daftar produk" />
      <AdminLayout>
        <div className="list-product___page flex flex-col overflow-clip lg:overflow-visible">
          <h2 className="subHeadingTitle capitalize py-3">
            Daftar Produk: {data?.products?.length}
          </h2>
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
