import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetDashboardSalesQuery } from "../../redux/api/orderApi";

import "./components/report.css";

import { Button, Spinner } from "@nextui-org/react";
import { PrinterIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

import SalesChart from "../charts/SalesChart";
import SalesSummaryTable from "../admin/components/SalesSummaryTable";
import MetaData from "../layout/MetaData";

import { showFormattedDate } from "../../helpers/helpers";
import { rupiahConverter } from "../../helpers/rupiahConverter";
import TopProductsTable from "../admin/components/TopProductsTable";

const SalesReport = () => {
  const { user } = useSelector((state) => state.auth);
  const query = useLocation();

  const datesRange = query?.search?.split("?startDate=")[1];
  const startDate = datesRange.split("&endDate=")[0];
  const endDate = datesRange.split("&endDate=")[1];

  const { data, isLoading, error } = useGetDashboardSalesQuery({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const ordersData = data?.itemOfSales.map((item) => ({
    _id: item._id,
    payment_status: item.paymentInfo.status,
    orderStatus: item.orderStatus,
    user: item.user[0].email,
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
        fontSize: "10px",
      },
    },
    cells: {
      style: {
        fontSize: "10px",
      },
    },
  };

  const columns = [
    {
      name: "Status Pembayaran",
      selector: (row) => row?.payment_status,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
      sortable: true,
      width: "140px",
      wrap: true,
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row?.paymentMethod,
      wrap: true,
    },
    {
      name: "User",
      selector: (row) => row?.user,
      width: "100px",
      wrap: true,
    },
    {
      name: "Total",
      selector: (row) => row?.totalAmount,
      width: "90px",
      wrap: true,
    },
    {
      name: "Unit Pembelian",
      selector: (row) => row?.orderItems,
      width: "140px",
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
      wrap: true,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Date();

  return (
    <div className="flex w-full flex-col items-end p-5 md:p-10">
      <MetaData
        title={`Laporan Penjualan ${showFormattedDate(
          startDate
        )} - ${showFormattedDate(endDate)}`}
      />
      <Button
        onClick={handlePrint}
        color="primary"
        className="w-[100px] text-white font-poppins"
        startContent={<PrinterIcon className="h-4 text-white" />}
      >
        Cetak
      </Button>

      <div className="print-only flex flex-col w-full mt-5">
        {/* report header */}
        <div className="reports-header flex flex-col md:flex-row w-full justify-between ">
          <div className="flex gap-4">
            <div id="logo" className="flex">
              <img src="/icons/logo.png" alt="Company Logo" />
            </div>
            <div className="flex flex-col">
              <p className="font-lora text-lg">Farhani Florist Online Shop</p>
              <p className="text-[9px] font-poppins md:w-52">
                Rempoah Baturraden Purwokerto, Kab.Banyumas, Jawa Tengah
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col mt-4">
              <h2 className="font-lora mt-5 md:mt-0 text-lg font-semibold">
                Data Penjualan
              </h2>
              <h2 className="font-poppins text-sm text-default-600">{`${showFormattedDate(
                startDate
              )} - ${showFormattedDate(endDate)}`}</h2>
            </div>
          </div>
        </div>
        <div className="sales-chart flex my-20 w-full">
          <SalesChart salesData={data?.sales} />
        </div>

        {/* Top Products sales info table */}
        <div className="flex flex-col">
          <TopProductsTable data={data?.topProducts} />
        </div>

        {/* More sales info table */}
        <div className="flex flex-col">
          <SalesSummaryTable data={data} />
          <div className="flex p-3 justify-between font-poppins text-sm">
            <p>Total Penjualan </p>
            <h2>
              {data?.totalSales ? rupiahConverter(data?.totalSales) : "Rp. 0"}
            </h2>
          </div>
          <div className="flex p-3 justify-between font-poppins text-sm">
            <p>Total Pesanan </p>
            <h2>{data?.totalNumOfOrders ? data?.totalNumOfOrders : "0"}</h2>
          </div>
        </div>

        {/* Table of Sales */}
        <h2 className="subHeadingTitle w-full capitalize py-3">
          Daftar Data Penjualan
        </h2>
        <DataTable
          className="font-poppins "
          columns={columns}
          data={ordersData}
          customStyles={columnCustomSytles}
          pagination
        />

        {/* Reports footer */}
        <div className="reports-footer__container flex flex-col mt-5  font-poppins text-justify">
          <p>
            Data dan informasi yang tercantum pada laporan ini merupakan data
            yang faktual dan sebenar-benarnya. Keakuratan data dan informasi
            dalam laporan ini dapat dipertanggung jawabkan. Terima kasih atas
            kepercayaan Anda.
          </p>

          <div className="flex flex-col items-end mt-5 ">
            <p>Banyumas, {showFormattedDate(todayDate)}</p>
            <div className="blank_signature h-24"></div>

            <p className="text-center mr-20">{user?.user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalesReport;
