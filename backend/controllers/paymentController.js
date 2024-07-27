import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import midtransClient from "midtrans-client";
import { v4 as uuidv4 } from "uuid";

// Create new order => /api/v1/payment/checkout
export const createPayment = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    paymentMethod,
    paymentInfo,
    orderUser_id,
    totalAmount,
    userName,
    userEmail,
  } = req.body;

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER,
    clientKey: process.env.MIDTRANS_CLIENT,
  });

  const transaction_id = uuidv4();

  let dataOrder = {
    transaction_details: {
      order_id: transaction_id,
      gross_amount: totalAmount,
    },
    customer_details: {
      first_name: userName,
      email: userEmail,
    },
    item_details: orderItems?.map((item) => ({
      id: item?.product,
      name: item?.name,
      price: item?.price,
      quantity: item?.quantity,
    })),
    shipping_address: {
      address: shippingInfo?.address,
      city: shippingInfo?.city,
      postal_code: shippingInfo?.zipCode,
      phone: shippingInfo?.phoneNo,
      country_code: "IDN",
    },
    // enabled_payments: ["permata_va", "bca_va", "bni_va", "bri_va", "cimb_va"],
    // bca_va: {
    //   va_number: "12345678911",
    //   sub_company_code: "00000",
    //   free_text: {
    //     inquiry: [
    //       {
    //         en: "text in English",
    //         id: "text in Bahasa Indonesia",
    //       },
    //     ],
    //     payment: [
    //       {
    //         en: "text in English",
    //         id: "text in Bahasa Indonesia",
    //       },
    //     ],
    //   },
    // },
    // bni_va: {
    //   va_number: "12345678",
    // },
    // bri_va: {
    //   va_number: "1234567891234",
    // },
    // cimb_va: {
    //   va_number: "1234567891234567",
    // },
    // callbacks: {
    //   finish: `${process.env.FRONTEND_URL}/me/orders`,
    //   error: `${process.env.FRONTEND_URL}/me/orders`,
    //   pending: `${process.env.FRONTEND_URL}/me/orders`,
    // },
  };

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    transaction_id,
    user: req.user._id,
  });

  const token = await snap.createTransaction(dataOrder);
  // console.log(token, dataOrder);
  // console.log(order);

  res.status(200).json({
    token,
    dataOrder,
    // order,
  });
});

const updateNotif = async (order_id, transaction_id, status) => {
  const order = await Order.findOneAndUpdate(
    { transaction_id: order_id },
    { paymentInfo: { status: status, id: transaction_id } },
    {
      new: true,
    }
  );

  return order;
};

// Webhook midtrans https notification
export const transactionNotif = catchAsyncErrors(async (req, res, nex) => {
  const data = req.body;

  let transactionStatus = data.transaction_status;
  let fraudStatus = data.fraud_status;

  // console.log(data, transactionStatus, fraudStatus);

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      const transactionOrder = await updateNotif(
        data?.order_id,
        data?.transaction_id,
        "Dibayar"
      );
      // console.log(transactionOrder);
    }
  } else if (transactionStatus == "settlement") {
    const transactionOrder = await updateNotif(
      data?.order_id,
      data?.transaction_id,
      "Dibayar"
    );
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    const transactionOrder = await updateNotif(
      data?.order_id,
      data?.transaction_id,
      "Dibatalkan"
    );
  } else if (transactionStatus == "pending") {
    const transactionOrder = await updateNotif(
      data?.order_id,
      data?.transaction_id,
      "Menunggu Pembayaran"
    );
  }

  res.status(200).json({
    status: "success",
    message: "OK",
  });
});
