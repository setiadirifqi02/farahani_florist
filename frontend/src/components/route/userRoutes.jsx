import { Route } from "react-router-dom";
import Home from "../Home";
import AllProduct from "../products/AllProduct";

import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Register from "../auth/Register";
import ResetPassword from "../auth/ResetPassword";

import Cart from "../cart/Cart";
import ConfirmOrder from "../cart/ConfirmOrder";
import PaymentMethod from "../cart/PaymentMethod";
import Shipping from "../cart/Shipping";

import Invoice from "../invoice/Invoice";
import MyOrders from "../order/MyOrders";
import OrderDetail from "../order/OrderDetail";
import ProductDetails from "../products/ProductDetails";

import Profile from "../user/Profile";
import UpdatePassword from "../user/UpdatePassword";
import UpdateProfile from "../user/UpdateProfile";
import UploadAvatar from "../user/UploadAvatar";
import OrderConfirmation from "../order/OrderConfirmation";

const userRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/all_products" element={<AllProduct />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />

      <Route path="/cart" element={<Cart />} />
      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirm_order"
        element={
          <ProtectedRoute>
            <ConfirmOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment_method"
        element={
          <ProtectedRoute>
            <PaymentMethod />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/orders_confirmation"
        element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice/order/:id"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me/upload_avatar"
        element={
          <ProtectedRoute>
            <UploadAvatar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me/update_password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me/update_profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
    </>
  );
};
export default userRoutes;
