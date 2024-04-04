import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utlis/emailTamplate.js";
import ErrorHandler from "../utlis/errorHandler.js";
import sendEmail from "../utlis/sendEmail.js";
import sendToken from "../utlis/sendToken.js";
import crypto from "crypto";
import { upload_file, delete_file } from "../utlis/cloudinary.js";

// Register new user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res, "User has been created");
});

// login user => /api/v1/login

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email& password", 400));
  }

  //   find user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //   Check if password is correct;
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res, "Login is successed ");
});

// Upload   user avatar => /api/v1/me/upload_avatar
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "farhani/avatars");

  // Remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  res.status(200).json({
    user,
  });
});

// Forgot password of user => /api/v1/password/forgot

export const forgotUser = catchAsyncErrors(async (req, res, next) => {
  // Find user in the database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset password url => /api/vi/password/forgot
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Farhani Florist Shop Password Recovery",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Reset password => /api/v1/password/reset:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //  Hash the URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Set the new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res, "Password reset is successed");
});

// Get current user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

// Update password user => /api/v1/password/update
export const updatePasswordUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  // Check the previous user's password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    message: "Password has been updated",
  });
});

// Update user profile => /api/v1/me/update
export const updaUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    message: "Profile has been updated",
    user,
  });
});

// Get all users (Admin Route) => /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    message: "List of all users Farhani Florist Shop",
    users,
  });
});

// Get spesific user by Id (Admin Route) => /api/v1/admin/users/:id
export const getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    user,
  });
});

// Update user profile (Admin Route)=> /api/v1/admin/users/:id
export const updateUserProfileByAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
    });

    res.status(200).json({
      message: "Profile has been updated",
      user,
    });
  }
);

//  Delete user profile (Admin Route) => /api/v1/admin/users/:id
export const deleteUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 404)
    );
  }

  // Remove user avatar from cloudinary

  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    message: "User profile has been deleted",
  });
});
