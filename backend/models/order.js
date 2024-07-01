import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    transaction_id: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: [true, "Silahkan pilih metode pembayaran "],
      enum: {
        values: ["COD", "Online Payment"],
        message: "Silahkan pilih COD atau Online Payment",
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipped", "Delivered", "Cancel"],
        message: "Silahkan pilih status pesanan",
      },
      default: "Processing",
    },
    deliveredAt: Date,
    isConfirmedByUser: {
      type: String,
      enum: {
        values: ["Dikonfirmasi", "Belum Konfirmasi"],
        message:
          "Pilih konfirmasi pesanan: Belum Konfirmasi atau Dikonfirmasi!",
      },
      default: "Belum Konfirmasi",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
