import { useEffect } from "react";
import { useParams } from "react-router-dom";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import "./invoice.css";
import { Button, Spinner } from "@nextui-org/react";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";

import { rupiahConverter } from "../../helpers/rupiahConverter";

const Invoice = () => {
  const params = useParams();

  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};

  const { shippingInfo, orderItems, paymentInfo, user, totalAmount } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const onHandleDownload = () => {
    const input = document.getElementById("order_invoice");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();

      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);
      pdf.save(`invoice_${order?._id}.pdf`);
    });
  };

  return (
    <>
      <MetaData title="Invoice" />
      <div className="order-invoice contents font-poppins my-5">
        <div className="flex  justify-center  mb-5">
          <Button
            color="primary"
            endContent={<PrinterIcon className="h-6 text-white" />}
            className="text-white"
            onClick={onHandleDownload}
          >
            Download Invoice
          </Button>
        </div>
        <div id="order_invoice" className="p-3 border-1 border-green-500">
          <header className="clearfix">
            <div id="logo" className="flex items-center justify-center w-full">
              <img src="/icons/logo.png" alt="Company Logo" />
            </div>
            <h1 className="headingTitle py-5">INVOICE {order?._id}</h1>
            <div id="company" className="p-5 text-[12px]">
              <div>Farhani Florist</div>
              <div>
                Jalan Raya, Dusun I, Rempoah, Baturaden,
                <br />
                Kab. Banyumas, Jawa Tengah
              </div>
              <div>088220259500</div>
              {/* <div>
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </div> */}
            </div>
            <div id="project" className="p-10 text-sm">
              <div>
                <span>Name</span> {user?.name}
              </div>
              <div>
                <span>EMAIL</span> {user?.email}
              </div>
              <div>
                <span>PHONE</span> {shippingInfo?.phoneNo}
              </div>
              <div>
                <span>ADDRESS</span> {shippingInfo?.address},{" "}
                {shippingInfo?.zipCode},<br /> kab. {shippingInfo?.city},{" "}
                {shippingInfo?.province}, {shippingInfo?.country}
              </div>
              <div>
                <span>DATE</span>{" "}
                {new Date(order?.createdAt).toLocaleString("id", "ID")}
              </div>
              <div className="flex">
                <span>Status</span>
                <p className=" capitalize">{paymentInfo?.status}</p>
              </div>
            </div>
          </header>
          <main>
            <table className="mt-5 text-sm">
              <thead>
                <tr>
                  <th className="service">ID</th>
                  <th className="desc">Nama</th>
                  <th>Harga</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item, i) => (
                  <tr key={i}>
                    <td className="service">{item?.product}</td>
                    <td className="desc">{item?.name}</td>
                    <td className="unit">{rupiahConverter(item?.price)}</td>
                    <td className="qty">{item?.quantity}</td>
                    <td className="total">
                      {rupiahConverter(item?.price * item?.quantity)}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="4">
                    <b>Subtotal</b>
                  </td>
                  <td className="total">
                    {rupiahConverter(order?.itemsPrice)}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4">
                    <b>Biaya Pengiriman</b>
                  </td>
                  <td className="total">
                    {rupiahConverter(order?.shippingAmount)}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4" className="grand total">
                    <b>Total</b>
                  </td>
                  <td className="grand total">
                    {rupiahConverter(totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <div id="notices">
              <div>NOTICE:</div>
              <div className="notice">
                A finance charge of 1.5% will be made on unpaid balances after
                30 days.
              </div>
            </div> */}
          </main>
          <footer className=" text-[8px]">
            Invoice was created on a computer and is valid without the
            signature.
          </footer>
        </div>
      </div>
    </>
  );
};
export default Invoice;
