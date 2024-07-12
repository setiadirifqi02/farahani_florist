import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetReviewByAdminQuery } from "../../redux/api/productsApi";

import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import ReportsLayout from "./components/Reports";

const ProductReviewReport = () => {
  const query = useLocation();
  const productId = query?.search.split("?id=")[1];

  const { data, isLoading, error } = useGetReviewByAdminQuery(productId);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      wrap: true,
    },
    {
      name: "Rating",
      selector: (row) => row?.rating,
      width: "90px",
    },
    {
      name: "Ulasan",
      selector: (row) => row?.comment,
      width: "240px",
    },

    {
      name: "User",
      selector: (row) => row?.user?.name,
      width: "120px",
    },
    {
      name: "Email",
      selector: (row) => row?.user?.email,
      wrap: true,
    },
  ];

  return (
    <div className="product-review-report___container flex flex-col w-full overflow-x-scroll">
      <MetaData
        title={`Laporan Review Produk Tanaman ${data?.product?.name}`}
      />
      <ReportsLayout
        user={user?.user}
        data={data?.reviews}
        columns={columns}
        reportTitle={`Review Produk Tanaman ${data?.product?.name}`}
      />
      ;
    </div>
  );
};
export default ProductReviewReport;
