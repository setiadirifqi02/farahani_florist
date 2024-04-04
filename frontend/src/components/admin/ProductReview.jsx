import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Input, Spinner, Tooltip } from "@nextui-org/react";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteProductReviewMutation,
  useLazyGetReviewByAdminQuery,
} from "../../redux/api/productsApi";
import toast from "react-hot-toast";

const ProductReview = () => {
  const [productId, setProductId] = useState();

  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetReviewByAdminQuery();

  const [
    deleteReview,
    { error: deleteError, isSuccess, isLoading: isDeleteLoading },
  ] = useDeleteProductReviewMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Ulasan dihapus");
    }
  }, [error, deleteError, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    getProductReviews(productId);
  };

  const deleteReviewHandler = (id) => {
    deleteReview({ productId, id });
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
    },
    {
      name: "Rating",
      selector: (row) => row?.rating,
    },
    {
      name: "Ulasan",
      selector: (row) => row?.comment,
    },

    {
      name: "User",
      selector: (row) => row?.user?.name,
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="danger"
            content="Hapus Ulasan"
          >
            <button
              className="mx-2"
              onClick={() => deleteReviewHandler(row?._id)}
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
      <MetaData title="Ulasan Produk" />
      <AdminLayout>
        <div className="product-review__page flex flex-col  w-96">
          <h2 className="subHeadingTitle capitalize py-3">Ulasan Produk</h2>
          <form onSubmit={onSubmitHandler} className="search flex flex-col">
            <h2 className="subTitle text-default-600 mb-3">
              Masukan ID Produk :
            </h2>
            <Input
              type="text"
              className="w-full"
              placeholder="Masukan ID Product"
              size="lg"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              startContent={
                <MagnifyingGlassIcon className="h-4 text-green-500" />
              }
            />

            <Button
              color="primary"
              type="submit"
              className="text-white font-poppins mt-5  md:max-w-32"
            >
              Cari
            </Button>
          </form>

          {/* Result of review product by id */}

          {data?.reviews?.length > 0 ? (
            <div className="result flex-flex-col">
              <h2 className="subTitle text-default-600 mb-3">
                Hasil Pencarian:
              </h2>
              <DataTable
                className="font-poppins"
                columns={columns}
                data={data?.reviews}
                pagination
              />
            </div>
          ) : (
            <>
              <h2 className="subTitle text-default-600 mb-3">
                Hasil Pencarian:
              </h2>
              <p className="font-poppins text-default-500 text-sm">
                Tidak terdapat ulasan produk
              </p>
            </>
          )}
        </div>
        ;
      </AdminLayout>
    </>
  );
};
export default ProductReview;
