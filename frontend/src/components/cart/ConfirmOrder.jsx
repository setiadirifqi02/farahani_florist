import { Link as routerLink, useNavigate } from "react-router-dom";

import { CreditCardIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Divider, Link } from "@nextui-org/react";

import { useSelector } from "react-redux";

import { rupiahConverter } from "../../helpers/rupiahConverter";
import { calculateOrderCost } from "../../helpers/helpers";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { itemsPrice, shippingPrice, totalPrice } =
    calculateOrderCost(cartItems);

  return (
    <>
      <MetaData title="Konfirmasi Pembelian" />
      <CheckoutSteps shipping confirmOrder />
      <div className="confirm-order__page flex content flex-col w-full lg:flex-row">
        {/* Order Shipping Info */}
        <div className="confirm-order-content flex flex-col w-full  lg:w-4/6 md:py-5">
          <h2 className="subHeadingTitle w-full capitalize py-3 border-b-1">
            Informasi Pengiriman
          </h2>
          <div className="shipping-info flex-col mb-5 md:mb-10 max-w-sm">
            <div className="flex  gap-24 items-baseline">
              <h2 className="subTitle">Nama</h2>
              <small className="font-poppins font-semibold text-default-600 capitalize">
                {user?.user?.name}
              </small>
            </div>
            <div className="flex gap-8 lg:gap-4 items-baseline">
              <h2 className="subTitle">Nomor Telp/Hp</h2>
              <small className=" font-poppins font-semibold text-default-600">
                {shippingInfo?.phoneNo}
              </small>
            </div>
            <div className="flex gap-[86px] items-baseline">
              <h2 className="subTitle">Alamat</h2>
              <small className=" font-poppins font-semibold text-default-600">
                {shippingInfo?.address}, {shippingInfo?.zipCode}, Kec.
                {shippingInfo?.district}, {shippingInfo?.city},
                {shippingInfo?.province}, {shippingInfo?.country}
              </small>
            </div>
          </div>

          {/* Order Item Info */}
          <div className="content-cart__header flex justify-between mb-5 md:mb-10">
            <h2 className="subHeadingTitle w-full capitalize py-3 border-b-1">
              Keranjang belanjamu
            </h2>
          </div>
          {cartItems?.map((item) => (
            <div
              className="product-items flex flex-col md:flex-row
             items-center justify-between border-b-2 mb-5"
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
                {item?.quantity} x {rupiahConverter(item?.price)} ={" "}
                {rupiahConverter((item.quantity * item.price).toFixed(2))}
              </small>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="summary-cart flex flex-col w-full lg:w-2/6 p-3 md:p-5 bg-gray-50 lg:ml-5 rounded-xl sticky">
          <h2 className="subHeadingTitle capitalize">Ringkasan Pembelian</h2>
          <Divider className="mt-5" />
          <div className="flex justify-between items-baseline">
            <h2 className="subTitle">Subtotal</h2>
            <p className="paragraphDetail">{rupiahConverter(itemsPrice)}</p>
          </div>
          <div className="flex justify-between items-baseline">
            <h2 className="subTitle">Biaya Pengiriman</h2>
            <p className="paragraphDetail">{rupiahConverter(shippingPrice)}</p>
          </div>
          <div className="flex justify-between items-baseline">
            <h2 className="subTitle"> Total</h2>
            <p className="paragraphDetail">{rupiahConverter(totalPrice)}</p>
          </div>
          <Button
            color="primary"
            startContent={<CreditCardIcon className="h-4 text-white" />}
            className="text-white mt-5"
            as={routerLink}
            to="/payment_method"
          >
            Lanjut Pembayaran
          </Button>
        </div>
      </div>
    </>
  );
};
export default ConfirmOrder;
