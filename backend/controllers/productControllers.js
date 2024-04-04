import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utlis/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import APIFilters from "../utlis/apiFilters.js";
import { upload_file, delete_file } from "../utlis/cloudinary.js";

// Get all product API route => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const restPerPage = 4;
  const apiFilters = new APIFilters(Product, req.query)
    .search()
    .filtersProduct();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(restPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    message: "List of All Farhani Florist's Product",
    restPerPage,
    filteredProductsCount,
    products,
  });
});

// Get product API route => /api/v1/products/:id
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user"
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

// Get product API route => /api/v1/admin/products/
export const getProductsByAdmin = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    products,
  });
});

// Update product API route => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

// Upload  product images API route => /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const uploader = async (image) => upload_file(image, "farhani/products");

  const urls = await Promise.all((req.body?.images).map(uploader));

  product?.images?.push(...urls);

  await product?.save();

  res.status(200).json({
    product,
  });
});

// Delete product image - ADMIN => /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product?.images?.filter(
      (img) => img.public_id != req.body.imgId
    );

    await product?.save();
  }

  res.status(200).json({
    product,
  });
});
// Delete product API route => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Delete images associated with product
  for (let i = 0; i < product?.images?.length; i++) {
    await delete_file(product?.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product Deleted",
  });
});

// Create new product API route => /api/v1/admin/products
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

//  Create/Update product review => /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const productReview = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews.find(
    (review) => review.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(productReview);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Your review has been sent",
  });
});

//  Create/Update product review => /api/v1/reviews
export const getProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

//  Delete product review => /api/v1/admin/reviews
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    message: "Your review has been deleted",
    product,
  });
});

// Can user review => /api/v1/can_review
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({
    canReview: true,
  });
});
