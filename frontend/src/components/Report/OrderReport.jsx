import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetOrdersByAdminQuery } from "../../redux/api/orderApi";

import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import ReportsLayout from "./components/Reports";

import { showFormattedDate } from "../../helpers/helpers";

const OrderReport = () => {
  const { data, isLoading, error } = useGetOrdersByAdminQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

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

  const columnCustomSytles = {
    headCells: {
      style: {
        fontSize: "8px",
      },
    },
    cells: {
      style: {
        fontSize: "8px",
      },
    },
  };

  const columns = [
    {
      name: "Status Pembayaran",
      selector: (row) => row?.payment_status,
      sortable: true,
      width: "130px",
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
      sortable: true,
      width: "120px",
    },
    {
      name: "User",
      selector: (row) => row?.user,
      width: "120px",
      wrap: true,
    },
    {
      name: "Total",
      selector: (row) => row?.totalAmount,
      width: "90px",
    },
    {
      name: "Unit Pembelian",
      selector: (row) => row?.orderItems,
      width: "200px",
      wrap: true,
    },
    {
      name: "Kota",
      selector: (row) => row?.city,
    },
    {
      name: "Alamat",
      selector: (row) => row?.address,
      width: "120px",
      wrap: true,
    },
    {
      name: "Tanggal",
      selector: (row) => showFormattedDate(row?.date),
      sortable: true,
    },
  ];

  return (
    <div className="product-review-report___container flex flex-col w-full overflow-x-scroll">
      <MetaData title={"Laporan Data Daftar Pesanan"} />
      <ReportsLayout
        user={user?.user}
        data={ordersData}
        columns={columns}
        customStyles={columnCustomSytles}
        reportTitle={"Daftar Pesanan"}
      />
      ;
    </div>
  );
};
export default OrderReport;
