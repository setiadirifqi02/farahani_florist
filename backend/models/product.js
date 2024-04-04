import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Silahkan masukan nama produk!"],
      maxLength: [200, "Nama produk tidak melebihi 200 karakter"],
    },
    price: {
      type: Number,
      required: [true, "Silahkan masukan harga produk! "],
      maxLenght: [10, "Harga produk tidak melebihi 10 karakter"],
    },
    description: {
      type: String,
      required: [true, "Silahkan masukan deskripsi produk!"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Silahkan masukan kategori produk!"],
      enum: {
        values: ["Bunga", "Daun", "Pohon", "Buah", "Akar"],
        message: "Mohon pilih kategori yang tersedia",
      },
    },
    color: {
      type: String,
      required: [true, "Silahkan masukan warna produk"],
    },
    stock: {
      type: Number,
      required: [true, "Silahkan masukan stok produk"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
