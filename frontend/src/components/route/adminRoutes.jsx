import { Route } from "react-router-dom";
import Dashboard from "../admin/Dashboard";
import ListOfOrders from "../admin/ListOfOrders";
import ListOfProducts from "../admin/ListOfProducts";
import ListOfUsers from "../admin/ListOfUsers";
import NewProduct from "../admin/NewProduct";
import ProcessOrder from "../admin/ProcessOrder";
import ProductReview from "../admin/ProductReview";
import UpdateProduct from "../admin/UpdateProduct";
import UpdateUser from "../admin/UpdateUser";
import UploadProductImages from "../admin/UploadProductImages";
import ProtectedRoute from "../auth/ProtectedRoute";

const adminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin={true}>
            <ListOfProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <ProtectedRoute admin={true}>
            <NewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload_images"
        element={
          <ProtectedRoute admin={true}>
            <UploadProductImages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin={true}>
            <ListOfOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin={true}>
            <ProcessOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute admin={true}>
            <ListOfUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin={true}>
            <ProductReview />
          </ProtectedRoute>
        }
      />
    </>
  );
};
export default adminRoutes;
