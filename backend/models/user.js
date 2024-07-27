import mongoose from "mongoose";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const strongPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Silahkan masukan nama pengguna!"],
      maxLength: [50, "Nama pengguna melebihii 50 karakter"],
    },
    email: {
      type: String,
      required: [true, "Shilakan masukan nama email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Silahkan masukan password pengguna!"],
      select: false,
      validate: {
        validator: function (v) {
          return strongPasswordRegex.test(v);
        },
        message: (props) =>
          `Password minimal 8 karakter mengandung huruf capital, huruf kecil, angka, dan karakter spesial`,
      },
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    shippingInfo: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      phoneNo: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt the password before saving user to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcyrpt.hash(this.password, 10);
});

// Return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_SESSION,
  });
};

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcyrpt.compare(enteredPassword, this.password);
};

// Generate token for reset password
userSchema.methods.getResetPasswordToken = function () {
  // Gernerate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
