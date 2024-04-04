import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Spinner, Tooltip } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { EyeIcon, PrinterIcon } from "@heroicons/react/24/solid";

import MetaData from "../layout/MetaData";

import { useMyOrdersQuery } from "../../redux/api/orderApi";
import { useDispatch } from "react-redux";
import { clearCartItem } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderSuccess = searchParams.get("order_success");

  // console.log(order);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderSuccess) {
      dispatch(clearCartItem());
      navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
    },
    {
      name: "Dibayar",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row.paymentInfo.status,
    },
    {
      name: "Status Pesanan",
      selector: (row) => row.orderStatus,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Lihat Rincian"
          >
            <Link to={`/me/order/${row?._id}`} className="btn btn-primary">
              <EyeIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Cetak Invoice"
          >
            <Link
              to={`/invoice/order/${row?._id}`}
              className="btn btn-success ms-2"
            >
              <PrinterIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <MetaData title="Daftar Pesanan" />
      <div className="my-order__page flex flex-col content w-full">
        <h2 className="subHeadingTitle w-full capitalize py-3">
          {" "}
          Daftar Pesanan anda : {data?.orders?.length}
        </h2>
        <DataTable
          className="font-poppins"
          columns={columns}
          data={data?.orders}
          pagination
        />
      </div>
    </>
  );
};
export default MyOrders;
