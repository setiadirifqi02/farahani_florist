import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAdminProductsQuery } from "../../redux/api/productsApi";

import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";

import ReportsLayout from "./components/Reports";
import MetaData from "../layout/MetaData";

import { showFormattedDate } from "../../helpers/helpers";
import { rupiahConverter } from "../../helpers/rupiahConverter";

const ProductReport = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAdminProductsQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      style: {
        fontSize: "8px",
      },
    },
    {
      name: "Nama Produk",
      selector: (row) => row.name,
      sortable: true,
      style: {
        fontSize: "8px",
      },
    },
    {
      name: "Warna",
      selector: (row) => row.color,
      sortable: true,
      style: {
        fontSize: "8px",
      },
    },
    {
      name: "Harga",
      selector: (row) => rupiahConverter(row.price),
      sortable: true,
      style: {
        fontSize: "8px",
      },
    },

    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      width: "90px",
      style: {
        fontSize: "8px",
      },
    },
    {
      name: "Input by",
      selector: (row) => row?.user?.email,
      width: "140px",
      style: {
        fontSize: "8px",
      },
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
      width: "140px",
      style: {
        fontSize: "10px",
      },
    },
  ];

  return (
    <div className="product-report__container flex flex-col w-full overflow-x-scroll">
      <MetaData title={"Laporan Data Daftar Produk"} />
      <ReportsLayout
        user={user?.user}
        data={data?.products}
        columns={columns}
        reportTitle={"Produk Tanaman Hias"}
      />
    </div>
  );
};
export default ProductReport;
