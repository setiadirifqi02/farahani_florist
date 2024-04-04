import { useEffect } from "react";
import { Link as routerLink, useParams } from "react-router-dom";

import {
  Avatar,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
} from "@nextui-org/react";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import { rupiahConverter } from "../../helpers/rupiahConverter";

import { useOrderDetailsQuery } from "../../redux/api/orderApi";

const OrderDetail = () => {
  const params = useParams();

  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
    transaction_id,
  } = order;

  const isPaid = paymentInfo?.status === "Dibayar" ? true : false;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;
  return (
    <>
      <MetaData title="Rincian Pesanan" />
      <div className="order-detail__page flex content flex-col w-full md:max-w-4xl">
        <div className="order-detail__header flex justify-between items-center">
          <h2 className="subHeadingTitle w-full capitalize py-3">
            Detail Pesanan
          </h2>
          <Button
            as={routerLink}
            to={`/invoice/order/${order?._id}`}
            color="primary"
            size="sm"
            className="text-white font-poppins"
            startContent={<PrinterIcon className="h-8 text-white" />}
          >
            Invoice
          </Button>
        </div>
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
                  String(orderStatus).includes("Delivered")
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
              <TableCell className=" font-semibold">Transaksi Id</TableCell>
              <TableCell>{transaction_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className=" font-semibold">Status</TableCell>
              <TableCell
                className={
                  isPaid
                    ? "text-green-500 capitalize"
                    : "text-red-400 capitalize"
                }
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
             items-center justify-between shadow-lg p-3 md:p-5 rounded-xl mb-5"
              key={item.name}
            >
              <div className="flex mb-5 items-center py-3">
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
              <small className="font-poppins font-semibold text-green-500">
                {rupiahConverter(item?.price)}
              </small>
              <small className="font-poppins font-semibold text-green-500">
                {item?.quantity} Unit
              </small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default OrderDetail;
