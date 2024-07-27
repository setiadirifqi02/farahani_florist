import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Input, Spinner, Tooltip } from "@nextui-org/react";

import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import ExportCSVButton from "../atoms/ExportCSVButton";

import {
  useDeleteProductReviewMutation,
  useLazyGetReviewByAdminQuery,
} from "../../redux/api/productsApi";
import ExportPDFButton from "../atoms/ExportPDFButton";

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

  // colomn of react data table component
  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "230px",
      wrap: true,
    },
    {
      name: "Rating",
      selector: (row) => row?.rating,
    },
    {
      name: "Ulasan",
      selector: (row) => row?.comment,
      width: "230px",
    },

    {
      name: "User",
      selector: (row) => row?.user?.name,
      width: "230px",
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row?.user?.email,
      width: "230px",
      wrap: true,
    },

    {
      name: "Aksi",
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

  // colomn header for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Rating", key: "rating" },
    { label: "Ulasan", key: "comment" },
    { label: "User", key: "user.name" },
    { label: "Email", key: "user.email" },
  ];

  return (
    <>
      <MetaData title="Ulasan Produk" />
      <AdminLayout>
        <div className="product-review__page flex flex-col w-80 px-2 md:w-full">
          <h2 className="subHeadingTitle capitalize py-3">Ulasan Produk</h2>
          <form
            onSubmit={onSubmitHandler}
            className="search flex flex-col w-[340px] lg:w-96"
          >
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
              <div className="flex w-full justify-between items-center lg:pr-2">
                <h2 className="subTitle text-default-600 mb-3 capitalize">
                  {`Menampilkan Review Tanaman ${data?.product?.name}  :`}
                </h2>

                <div className="export-btn flex gap-4 items-center">
                  <ExportPDFButton
                    link={`/admin/reviews/report?id=${productId}`}
                  />

                  {/* Export to CSV Button */}
                  {data?.reviews ? (
                    <ExportCSVButton
                      data={data?.reviews}
                      headers={headers}
                      filename={`Review Tanaman ${data?.product?.name}`}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>

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
