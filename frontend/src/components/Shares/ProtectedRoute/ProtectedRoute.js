// components/ProtectedRoute.js
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />; // Hoặc trang "Không có quyền"
  }

  return children;
};

export default ProtectedRoute;