import { useEffect, useState } from "react";
import { Link as routerLink, useParams } from "react-router-dom";

import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
  SelectItem,
  Select,
  Button,
  Spinner,
} from "@nextui-org/react";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";

import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { rupiahConverter } from "../../helpers/rupiahConverter";
import { PrinterIcon } from "@heroicons/react/24/solid";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");
  const params = useParams();
  const { data } = useOrderDetailsQuery(params?.id);

  const [updateOrder, { isLoading, error, isSuccess }] =
    useUpdateOrderMutation();

  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;

  const isPaid = paymentInfo?.status === "Dibayar" ? true : false;

  const handleSelectionChange = (e) => {
    setStatus(e.target.value);
  };

  const updateOrderHandler = (id) => {
    const data = { status };

    updateOrder({ id, body: data });
  };

  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Pesanan telah diperbaharui");
    }
  }, [error, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  return (
    <AdminLayout>
      <MetaData title="Proses Pesanan" />
      <div className="process-order__page flex  flex-col w-full md:max-w-4xl">
        <div className="order-control grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <h2 className="subHeadingTitle w-full capitalize py-3">
              Status Pesanan
            </h2>
            <Select
              label="Status Pesanan"
              name="status"
              selectedKeys={[status]}
              onChange={handleSelectionChange}
            >
              <SelectItem key="Diproses" value="Diproses">
                Diproses
              </SelectItem>
              <SelectItem key="Dikirim" value="Dikirim">
                Dikirim
              </SelectItem>
              <SelectItem key="Terkirim" value="Terkirim">
                Terkirim
              </SelectItem>
              <SelectItem key="Dibatalkan" value="Dibatalkan">
                Dibatalkan
              </SelectItem>
            </Select>
            <Button
              size="md"
              color="primary"
              className="font-poppins text-white mt-4"
              onClick={() => updateOrderHandler(order?._id)}
            >
              Update Status
            </Button>
          </div>
          <div className="order-invoice flex-flex-col">
            <h2 className="subHeadingTitle w-full capitalize py-3">Invoice</h2>
            <p className="text-md font-poppins mb-6 w-[200px]">
              Buat dan Cetak invoice untuk pesanan ini?
            </p>
            <Button
              as={routerLink}
              to={`/invoice/order/${order?._id}`}
              color="primary"
              size="md"
              className="text-white font-poppins w-[120px]"
              startContent={<PrinterIcon className="h-6 text-white" />}
            />
          </div>
        </div>
        <div className="order-detail__header flex justify-between items-center">
          <h2 className="subHeadingTitle w-full capitalize py-3">
            Detail Pesanan
          </h2>
        </div>

        <div className="order-content">
          {/* Genral order detail info */}
          <Table
            hideHeader
            isStriped
            aria-label="order-detail"
            className="font-poppins"
          >
            <TableHeader>
              <TableColumn></TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell className=" font-semibold">ID</TableCell>
                <TableCell>{order?._id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className=" font-semibold">Status</TableCell>
                <TableCell
                  className={
                    String(orderStatus).includes("Terkirim")
                      ? "text-green-500"
                      : "text-red-400"
                  }
                >
                  {order?.orderStatus}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className=" font-semibold">Tanggal</TableCell>
                <TableCell>
                  {new Date(order?.createdAt).toLocaleString("id", "ID")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 className="subHeadingTitle w-full capitalize py-3">
            Informasi Pengiriman
          </h2>
          {/* Shipping Info */}
          <Table
            hideHeader
            isStriped
            aria-label="order-detail"
            className="font-poppins"
          >
            <TableHeader>
              <TableColumn></TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1" className=" capitalize">
                <TableCell className=" font-semibold">Nama</TableCell>
                <TableCell>{user?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className=" font-semibold">No Telp/Hp</TableCell>
                <TableCell>{shippingInfo?.phoneNo}</TableCell>
              </TableRow>
              <TableRow className=" capitalize">
                <TableCell className=" font-semibold">Alamat</TableCell>
                <TableCell>
                  {shippingInfo?.address}, {shippingInfo?.zipCode}, kab.{" "}
                  {shippingInfo?.city}, {shippingInfo?.province},{" "}
                  {shippingInfo?.country}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 className="subHeadingTitle w-full capitalize py-3">
            Informasi Pembayaran
          </h2>
          {/* Payment Info */}
          <Table
            hideHeader
            isStriped
            aria-label="order-detail"
            className="font-poppins"
          >
            <TableHeader>
              <TableColumn></TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1" className=" capitalize">
                <TableCell className=" font-semibold">Status</TableCell>
                <TableCell
                  className={isPaid ? "text-green-500" : "text-red-400"}
                >
                  {paymentInfo?.status}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className=" font-semibold">
                  Methode Pembayaran
                </TableCell>
                <TableCell>{order?.paymentMethod}</TableCell>
              </TableRow>
              <TableRow className=" capitalize">
                <TableCell className=" font-semibold">ID Pembayaran</TableCell>
                <TableCell>{paymentInfo?.id || "Kosong"}</TableCell>
              </TableRow>
              <TableRow className=" capitalize">
                <TableCell className=" font-semibold">Total Harga</TableCell>
                <TableCell>{rupiahConverter(totalAmount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Order items */}

          <div className="Order-item">
            <h2 className="subHeadingTitle w-full capitalize py-3">
              Unit Pemesanan
            </h2>
            {orderItems?.map((item) => (
              <div
                className="product-items flex flex-col md:flex-row
             md:items-center justify-between shadow-lg p-3 md:p-5 rounded-xl mb-5"
                key={item.name}
              >
                <div className="flex mb-5 md:items-center py-3">
                  <Avatar
                    radius="lg"
                    src={item?.image}
                    className="w-20 h-20 text-large"
                  />

                  <div className="product-items-main flex flex-col ml-6 md:ml-10">
                    <Link as={routerLink} to={`/products/${item?.product}`}>
                      <h2 className="subTitle capitalize">{item?.name}</h2>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between gap-5 items-start">
                  <small className="font-poppins font-semibold text-green-500">
                    {rupiahConverter(item?.price)}
                  </small>
                  <small className="font-poppins font-semibold text-green-500">
                    {item?.quantity} Unit
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default ProcessOrder;
