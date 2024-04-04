import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { Spinner } from "@nextui-org/react";

const ProtectedRoute = ({ admin, children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <Spinner color="primary" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (admin && user?.user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;
