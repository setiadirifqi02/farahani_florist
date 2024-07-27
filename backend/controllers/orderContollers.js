import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utlis/errorHandler.js";
import { v4 as uuidv4 } from "uuid";

// Create new order => /api/v1/orders/new
export const createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const transaction_id = uuidv4();

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

  res.status(200).json({
    message: "Order has benn created",
    order,
  });
});

// Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No order found with the ID"), 404);
  }

  res.status(200).json({
    order,
  });
});

// Get order details by current user => /api/v1/me/orders
export const getCurrentUserOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("user", "name email")
    .where({ isConfirmedByUser: "Dikonfirmasi" });

  res.status(200).json({
    orders,
  });
});

// Get order details by current user => /api/v1/me/orders_confirmation
export const getUnconfirmUserOrder = catchAsyncErrors(
  async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email")
      .where({ isConfirmedByUser: "Belum Konfirmasi" });

    res.status(200).json({
      orders,
    });
  }
);

// Get order details by current user => /api/v1/me/orders_confirmation/:id
export const confirmedOrderByUser = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with the ID"), 404);
  }

  order.isConfirmedByUser = req.body.isConfirmedByUser;

  await order.save();

  res.status(200).json({
    message: "Order has been confirmed by user",
  });
});

// Get all orders (Admin Route) => /api/v1/admin/orders
export const getAllOrdersByAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate("user", "email");

  res.status(200).json({
    orders,
  });
});

// update orders (Admin Route) => /api/v1/admin/orders/:id
export const updateOrderByAdmin = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with the ID"), 404);
  }

  if (order?.orderStatus === "Terkirim") {
    return next(new ErrorHandler("You have already delivered thid order"), 404);
  }

  let productNotFound = false;

  //   Update products stock
  for (const item of order?.orderItems) {
    const product = await Product.findById(item?.product?.toString());

    if (!product) {
      productNotFound = true;
      break;
    }

    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  if (productNotFound) {
    return next(
      new ErrorHandler("No Product found with one or more IDs.", 404)
    );
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  if (order.orderStatus === "Terkirim") {
    order.paymentInfo.status = "Dibayar";
  }

  await order.save();

  res.status(200).json({
    message: "Order has been updated",
  });
});

// Delete order (Admin Route => /api/v1/admin/order/:id)
export const deleteOrderByAdmin = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with the ID"), 404);
  }

  await order.deleteOne();

  res.status(200).json({
    message: "Order has been deleted",
  });
});

async function getSalesData(startDate, endDate) {
  // get total sales and order data by date
  const salesData = await Order.aggregate([
    {
      // 1st Stage: Filter the data
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      // 2nd Stage Group the data
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalSales: { $sum: "$totalAmount" },
        numOfOrders: { $sum: 1 }, // count the number of orders
      },
    },
  ]);

  // get order data by date
  const itemOfSales = await Order.aggregate([
    {
      // 1st Stage: Filter the data
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
  ]);

  // get completed order data by date
  const completedOrder = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        orderStatus: "Terkirim",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalCompletedSales: { $sum: "$totalAmount" },
        numOfCompletedSales: { $sum: 1 },
      },
    },
  ]);

  // sum total amount of completed order
  let totalCompletedSales = 0;
  let numOfCompletedSales = 0;

  completedOrder.forEach((entry) => {
    const totalCompleted = entry?.totalCompletedSales;
    const numOfCompleted = entry?.numOfCompletedSales;

    totalCompletedSales += totalCompleted;
    numOfCompletedSales += numOfCompleted;
  });

  // get processing order data by date
  const processingOrder = await Order.aggregate([
    {
      // 1st Stage: Filter the data
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        orderStatus: "Diproses",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalProcessingSales: { $sum: "$totalAmount" },
        numOfProcessingSales: { $sum: 1 },
      },
    },
  ]);

  // sum total amount of processing order
  let totalProcessingSales = 0;
  let numOfProcessingSales = 0;

  processingOrder.forEach((entry) => {
    const totalProcessing = entry?.totalProcessingSales;
    const numOfProcessing = entry?.numOfProcessingSales;

    totalProcessingSales += totalProcessing;
    numOfProcessingSales += numOfProcessing;
  });

  // get cancel order data by date
  const cancelOrder = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        orderStatus: "Dibatalkan",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalCancelSales: { $sum: "$totalAmount" },
        numOfCancelSales: { $sum: 1 },
      },
    },
  ]);

  // sum total amount of processing order
  let totalCancelSales = 0;
  let numOfCancelSales = 0;

  cancelOrder.forEach((entry) => {
    const totalCancel = entry?.totalCancelSales;
    const numOfCancel = entry?.numOfCancelSales;

    totalCancelSales += totalCancel;
    numOfCancelSales += numOfCancel;
  });

  // get COD  order data by date
  const codOrder = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        paymentMethod: "COD",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalCodSales: { $sum: "$totalAmount" },
        numOfCodSales: { $sum: 1 },
      },
    },
  ]);

  // sum total number of COD order
  let totalCodSales = 0;
  let numOfCodSales = 0;

  codOrder.forEach((entry) => {
    const totalCod = entry?.totalCodSales;
    const numOfCod = entry?.numOfCodSales;

    totalCodSales += totalCod;
    numOfCodSales += numOfCod;
  });

  const onlinePaymentOrder = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        paymentMethod: "Online Payment",
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        totalOnlinePaymentSales: { $sum: "$totalAmount" },
        numOfOnlinePaymentSales: { $sum: 1 },
      },
    },
  ]);

  // sum total number of Online Payment order
  let totalOnlinePaymentSales = 0;
  let numOfOnlinePaymentSales = 0;

  onlinePaymentOrder.forEach((entry) => {
    const totalOnlinePayment = entry?.totalOnlinePaymentSales;
    const numOfOnlinePayment = entry?.numOfOnlinePaymentSales;

    totalOnlinePaymentSales += totalOnlinePayment;
    numOfOnlinePaymentSales += numOfOnlinePayment;
  });

  // Create map to store sales of data and num of order
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOfOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOfOrders = entry?.numOfOrders;

    salesMap.set(date, { sales, numOfOrders });
    totalSales += sales;
    totalNumOfOrders += numOfOrders;
  });

  // Generate an array of dates between start and end date
  const datesBetween = getDatesBetween(startDate, endDate);

  // Create final sales data array with 0 for dates without sales
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOfOrders: (salesMap.get(date) || { numOfOrders: 0 }).numOfOrders,
  }));

  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    // Unwind orderItems array
    { $unwind: "$orderItems" },
    // Group by product and calculate the total quantity ordered for each product
    {
      $group: {
        _id: "$orderItems.product",
        totalQuantity: { $sum: "$orderItems.quantity" },
      },
    },
    // Sort by totalQuantity in descending order
    { $sort: { totalQuantity: -1 } },
    // Limit the result to top 3 products
    { $limit: 5 },
    // Lookup product details from Product collection
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    // Unwind the productDetails array
    { $unwind: "$productDetails" },
    // Project the desired fields
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$productDetails.name",
        totalQuantity: 1,
        price: "$productDetails.price",
        description: "$productDetails.description",
        images: "$productDetails.images",
        category: "$productDetails.category",
        color: "$productDetails.color",
      },
    },
  ]);

  /*
  console.log(
    "Completed order :",
    totalCompletedSales,
    "Count :",
    numOfCompletedSales
  );
  console.log(
    "Processing order: ",
    totalProcessingSales,
    "Count :",
    numOfProcessingSales
  );
  console.log(
    "Cancel Sales order: ",
    totalCancelSales,
    "Count : ",
    numOfCancelSales
  );

  console.log("COD Sales :", totalCodSales, "Count :", numOfCodSales);
  console.log(
    "Online Payment Sales :",
    totalOnlinePaymentSales,
    "Count :",
    numOfOnlinePaymentSales
  );

  */

  return {
    salesData: finalSalesData,
    totalSales,
    totalNumOfOrders,
    itemOfSales,
    totalCompletedSales,
    numOfCompletedSales,
    totalProcessingSales,
    numOfProcessingSales,
    totalCancelSales,
    numOfCancelSales,
    totalCodSales,
    numOfCodSales,
    totalOnlinePaymentSales,
    numOfOnlinePaymentSales,
    topProducts,
  };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Get Sales Data  (Admin Route => /api/v1/admin/get_sales
export const getSalesByAdmin = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const {
    salesData,
    totalSales,
    totalNumOfOrders,
    itemOfSales,
    totalCompletedSales,
    numOfCompletedSales,
    totalProcessingSales,
    numOfProcessingSales,
    totalCancelSales,
    numOfCancelSales,
    totalCodSales,
    numOfCodSales,
    totalOnlinePaymentSales,
    numOfOnlinePaymentSales,
    topProducts,
  } = await getSalesData(startDate, endDate);

  res.status(200).json({
    totalSales,
    totalNumOfOrders,
    sales: salesData,
    itemOfSales,
    totalCompletedSales,
    numOfCompletedSales,
    totalProcessingSales,
    numOfProcessingSales,
    totalCancelSales,
    numOfCancelSales,
    totalCodSales,
    numOfCodSales,
    totalOnlinePaymentSales,
    numOfOnlinePaymentSales,
    topProducts,
  });
});

async function getTopProduct() {
  const topSalesProduct = await Order.aggregate([
    // Unwind orderItems array
    { $unwind: "$orderItems" },
    // Group by product and calculate the total quantity ordered for each product
    {
      $group: {
        _id: "$orderItems.product",
        totalQuantity: { $sum: "$orderItems.quantity" },
      },
    },
    // Sort by totalQuantity in descending order
    { $sort: { totalQuantity: -1 } },
    // Limit the result to top 3 products
    { $limit: 5 },
    // Lookup product details from Product collection
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    // Unwind the productDetails array
    { $unwind: "$productDetails" },
    // Project the desired fields
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$productDetails.name",
        totalQuantity: 1,
        price: "$productDetails.price",
        description: "$productDetails.description",
        images: "$productDetails.images",
        category: "$productDetails.category",
        color: "$productDetails.color",
        ratings: "$productDetails.ratings",
        numOfReviews: "$productDetails.numOfReviews",
      },
    },
  ]);

  return topSalesProduct;
}

export const getTopSalesProduct = catchAsyncErrors(async (req, res, next) => {
  const topProducts = await getTopProduct();

  res.status(200).json({
    topProducts,
  });
});
