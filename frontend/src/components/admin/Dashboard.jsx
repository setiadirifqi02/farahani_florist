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

  return (
    <>
      <MetaData title="Dashboard Sales" />
      <AdminLayout>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col w-[360px] md:w-full md:flex-row  md:items-center gap-2 mb-5">
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
              className="text-white mt-7 "
              onClick={onSubmitHandler}
            >
              Fetch
            </Button>
          </div>

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

          <SalesChart salesData={data?.sales} />
        </div>

        <div className="mb-5"></div>
      </AdminLayout>
    </>
  );
};
export default Dashboard;
