import { useEffect, useState } from "react";

import { Button, Card, CardBody, Spinner, Tooltip } from "@nextui-org/react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import { rupiahConverter } from "../../helpers/rupiahConverter";

import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi";
import SalesChart from "../charts/SalesChart";
import DataTable from "react-data-table-component";
import { showFormattedDate } from "../../helpers/helpers";
import SalesSummaryTable from "./components/SalesSummaryTable";

import { EyeIcon } from "@heroicons/react/24/solid";
import ExportCSVButton from "../atoms/ExportCSVButton";
import { Link } from "react-router-dom";
import ExportPDFButton from "../atoms/ExportPDFButton";
import TopProductsTable from "./components/TopProductsTable";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (startDate && endDate && !data) {
      getDashboardSales({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const onSubmitHandler = () => {
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  // console.log(data?.topProducts);

  // colomn of react data table component
  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "220px",
      wrap: true,
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row?.paymentInfo?.status,
      sortable: true,
      width: "170px",
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
      sortable: true,
      width: "170px",
      wrap: true,
    },
    {
      name: "User",
      selector: (row) => row?.user[0].email,
      width: "170px",
      wrap: true,
    },
    {
      name: "Metode Transakai",
      selector: (row) => row?.paymentMethod,
      wrap: true,
    },
    {
      name: "totalAmount",
      selector: (row) => rupiahConverter(row?.totalAmount),
      width: "170px",
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Detail Order"
          >
            <Link to={`/admin/orders/${row?._id}`} className="btn btn-primary">
              <EyeIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  // processing nested JSOn data that has nested JSON array of itemOfSales
  const itemOfSalesData = data?.itemOfSales.map((item) => ({
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

  // colomn headers for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Status Pembayaran", key: "payment_status" },
    { label: "Status Pesanan", key: "orderStatus" },
    { label: "User", key: "user" },
    { label: "Unit Pembelian", key: "orderItems" },
    { label: "Total", key: "totalAmount" },
    { label: "Metode Pembayaran", key: "paymentMethod" },
    { label: "Kota", key: "city" },
    { label: "Alamat", key: "address" },
    { label: "Tanggal", key: "date" },
  ];

  const linkStartDate = new Date(startDate).toISOString();
  const linkEndDate = endDate.toISOString();

  return (
    <>
      <MetaData title="Dashboard Sales" />
      <AdminLayout>
        <div className="flex flex-col gap-2 overflow-scroll">
          {/* Date input */}
          <div className="flex flex-col w-[360px] md:w-full md:flex-row  md:items-center gap-2 mb-5 ">
            <div className="flex flex-col">
              <label className="subTitle">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="bg-gray-100  w-full rounded-lg py-2 px-3"
              />
            </div>
            <div className="flex flex-col">
              <label className="subTitle">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="bg-gray-100 w-full rounded-lg py-2 px-3"
              />
            </div>

            <Button
              color="primary"
              className="text-white mt-12 font-poppins "
              onClick={onSubmitHandler}
            >
              Fetch
            </Button>
          </div>

          {/* Main Sales report  */}
          <div id="sales_report" className="p-5 ml-[-20px]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="subHeadingTitle  capitalize py-3">
                  Laporan Penjualan
                </h2>
                <h2 className="font-poppins text-sm text-default-500 capitalize mt-[-10px] mb-10">
                  {showFormattedDate(startDate)} - {showFormattedDate(endDate)}
                </h2>
              </div>
            </div>

            {/* Card Sales & order */}
            <div className="grid grid-cols-1  md:grid-cols-2 gap-2">
              <Card
                shadow="none"
                className="bg-green-300/80 w-[360px] md:w-full text-black font-poppins"
              >
                <CardBody>
                  <p className="text-center">Penjualan </p>
                  <h2 className="text-center">
                    {data?.totalSales
                      ? rupiahConverter(data?.totalSales)
                      : "Rp. 0"}
                  </h2>
                </CardBody>
              </Card>
              <Card
                shadow="none"
                className="bg-yellow-300/80 w-[360px] md:w-full text-black font-poppins"
              >
                <CardBody>
                  <p className="text-center">Pesanan </p>
                  <h2 className="text-center">
                    {data?.totalNumOfOrders ? data?.totalNumOfOrders : "0"}
                  </h2>
                </CardBody>
              </Card>
            </div>

            {/* Chart */}
            <SalesChart salesData={data?.sales} />

            {/* Top Products */}
            <div className="flex flex-col">
              <TopProductsTable data={data?.topProducts} />
            </div>

            {/* More sales info table */}
            <div className="flex flex-col">
              <SalesSummaryTable data={data} />
            </div>
          </div>

          {/* Order's data */}
          <div className="sales__table flex flex-col overflow-scroll my-4 md:my-8">
            <div className="flex w-full justify-between items-center lg:pr-2">
              <h2 className="subHeadingTitle capitalize py-3">
                Daftar Data Penjualan:
              </h2>

              <div className="export-btn flex gap-4 items-center">
                <ExportPDFButton
                  link={`/admin/dashboard/report?startDate=${linkStartDate}&endDate=${linkEndDate}`}
                />
                {data?.itemOfSales ? (
                  <ExportCSVButton
                    data={itemOfSalesData}
                    headers={headers}
                    filename={"Laporan Item Penjualan"}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>

            <DataTable
              className="font-poppins"
              columns={columns}
              data={data?.itemOfSales}
              pagination
            />
          </div>
        </div>

        <div className="mb-5"></div>
      </AdminLayout>
    </>
  );
};
export default Dashboard;
