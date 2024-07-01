import { useEffect, useState } from "react";

import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
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
import SalesSummaryTable from "./SalesSummaryTable";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import {
  CloudArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { CSVLink } from "react-csv";

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

  // console.log(data);

  // Export to Pdf
  const onHandleDownload = () => {
    const input = document.getElementById("sales_report");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();

      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);
      pdf.save(
        `laporan penjualan ${showFormattedDate(
          startDate
        )} - ${showFormattedDate(endDate)}.pdf`
      );
    });
  };

  // colom of react data table component
  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "220px",
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row?.paymentInfo?.status,
      sortable: true,
      width: "220px",
    },
    {
      name: "Status Pesanan",
      selector: (row) => row?.orderStatus,
      sortable: true,
      width: "220px",
    },
    {
      name: "User",
      selector: (row) => row?.user[0].email,
      width: "220px",
    },
    {
      name: "Metode Transakai",
      selector: (row) => row?.paymentMethod,
    },
    {
      name: "totalAmount",
      selector: (row) => row?.totalAmount,
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
      sortable: true,
    },
  ];

  // colom for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Status Pembayaran", key: "paymentInfo.status" },
    { label: "Status Pesanan", key: "orderStatus" },
    { label: "User", key: "user[0].email" },
    { label: "Total", key: "totalAmount" },
    { label: "Metode Pembayaran", key: "paymentMethod" },
    { label: "Tanggal", key: "updatedAt" },
  ];

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
                <h2 className="subHeadingTitle w-full capitalize py-3">
                  Laporan Penjualan
                </h2>
                <h2 className="subHeadingTitle w-full capitalize mt-[-20px] mb-10">
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
                  <p className="text-center">Sales </p>
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

            {/* More sales info table */}
            <div className="flex flex-col">
              <SalesSummaryTable data={data} />
            </div>
          </div>

          <Button
            color="primary"
            className="w-full md:w-52 text-white font-poppins"
            startContent={<CloudArrowDownIcon className="h-4 text-white" />}
            onClick={onHandleDownload}
          >
            Download Laporan
          </Button>

          {/* Order's data */}
          <div className="sales__table flex flex-col overflow-scroll my-4 md:my-8">
            <div className="flex w-full justify-between items-center lg:pr-2">
              <h2 className="subHeadingTitle capitalize py-3">
                Daftar Data Penjualan:
              </h2>

              {data?.itemOfSales ? (
                <CSVLink
                  data={data?.itemOfSales}
                  headers={headers}
                  filename="Data item penjualan Farhani Florist"
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
