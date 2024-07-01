import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RadioGroup, Radio, Button, Divider, Spinner } from "@nextui-org/react";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateCheckoutMutation,
  useCreateNewOrderMutation,
} from "../../redux/api/orderApi";
import useSnap from "../../hooks/useSnap";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  const [onlinePaymnet, { data, error: checkOutError }] =
    useCreateCheckoutMutation();
  // console.log(data?.token?.token);

  const { snapEmbed } = useSnap();

  useEffect(() => {
    if (data) {
      snapEmbed(data?.token?.token, {
        onSuccess: function (result) {
          console.log("success", result);
          navigate("/me/orders?order_success=true");
        },
        onPending: function (result) {
          console.log("pending", result);
          localStorage.setItem("payment", JSON.stringify(result));
          navigate("/me/orders?order_success=true");
        },
        onClose: function (result) {
          console.log("pending", result);
          navigate("/payment_method");
        },
      });
    }
    if (checkOutError) {
      console.log(checkOutError);
    }
  }, [data, checkOutError]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      navigate("/me/orders_confirmation?order_success=true");
    }
  }, [error, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const { itemsPrice, shippingPrice, totalPrice } =
    calculateOrderCost(cartItems);

  const { _id, name, email } = user?.user;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (method === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: 0,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Belum dibayar",
        },
        paymentMethod: "COD",
      };

      if (cartItems?.length === 0) {
        return toast.error("Tambah produk ke kerajang telebih dahulu!");
      }

      createNewOrder(orderData);
    }

    if (method === "online_payment") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: 0,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Belum dibayar",
        },
        paymentMethod: "Online Payment",
        orderUser_id: _id,
        userName: name,
        userEmail: email,
      };

      // payment gateway
      if (cartItems?.length === 0) {
        return toast.error("Tambah produk ke kerajang telebih dahulu!");
      }
      console.log(orderData);
      onlinePaymnet(orderData);
    }
  };
  return (
    <>
      <MetaData title="Metode Pemabyaran" />
      <CheckoutSteps shipping confirmOrder payment />
      <div>
        <form onSubmit={onSubmitHandler}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className=" subHeadingTitle w-full capitalize py-3">
                Pilih metode pembayaran
              </h2>
              <p className="font-poppins max-w-md mx-auto mt-4 text-base leading-relaxed text-gray-600">
                Pilih metode pembayaran yang tersedia di farhani florist shop
              </p>
            </div>

            <div className="max-w-sm mx-auto mt-8 sm:mt-16">
              <RadioGroup
                className="space-y-3 bg-gray-100 p-5 rounded-md font-poppins"
                label="Pilih metode Pembayaran"
              >
                <Divider />
                <Radio value="COD" onChange={(e) => setMethod("COD")}>
                  COD (Cash On Delivery)
                </Radio>
                <Radio
                  value="online_payment"
                  onChange={(e) => setMethod("online_payment")}
                >
                  Online Payment
                </Radio>
              </RadioGroup>

              <Button
                type="submit"
                radius="lg"
                className="inline-flex items-center justify-center w-full 
                px-12 py-4 mt-6 font-semibold text-white bg-green-500"
              >
                Bayar
              </Button>
            </div>
          </div>
        </form>
        <div id="snap-container"></div>
      </div>
      ;
    </>
  );
};
export default PaymentMethod;
