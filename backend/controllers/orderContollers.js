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
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  res.status(200).json({
    orders,
  });
});

// Get all orders (Admin Route) => /api/v1/admin/orders
export const getAllOrdersByAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

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

  if (order?.orderStatus === "Delivered") {
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

  if (order.orderStatus === "Delivered") {
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

  // console.log(salesData);

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

  // console.log(datesBetween);

  // Create final sales data array with 0 for dates without sales
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOfOrders: (salesMap.get(date) || { numOfOrders: 0 }).numOfOrders,
  }));

  // console.log(finalSalesData, totalSales, totalNumOfOrders);
  return { salesData: finalSalesData, totalSales, totalNumOfOrders };
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

  const { salesData, totalSales, totalNumOfOrders } = await getSalesData(
    startDate,
    endDate
  );

  res.status(200).json({
    totalSales,
    totalNumOfOrders,
    sales: salesData,
  });
});
