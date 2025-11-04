// src/components/Shares/ProtectedRoute/ProtectedRoute.js
import { useState, useEffect } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsVerified(false);
        setIsLoading(false);
        return;
      }

      try {
        // GỌI BACKEND ĐỂ VERIFY ROLE THỰC
        const response = await fetch("/api/user-service/auth/verify", {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const realRole = userData.role;
          
          // CẬP NHẬT LOCAL STORAGE VỚI ROLE THẬT
          localStorage.setItem("userRole", realRole);
          setUserRole(realRole);

          // KIỂM TRA ROLE CÓ TRONG allowedRoles KHÔNG
          const hasAccess = !allowedRoles || allowedRoles.includes(realRole);
          setIsVerified(hasAccess);
        } else {
          // TOKEN INVALID - XÓA LOCAL STORAGE
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Verify error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [allowedRoles]);

  // HIỂN THỊ LOADING
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "200px",
        fontSize: "16px",
        color: "#666"
      }}>
        🔐 Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // CHUYỂN HƯỚNG ĐẾN LOGIN NẾU KHÔNG CÓ TOKEN
  if (!isVerified && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // CHUYỂN HƯỚNG ĐẾN UNAUTHORIZED NẾU KHÔNG ĐÚNG ROLE
  if (!isVerified) {
    return <Navigate to="/unauthorized" replace />;
  }

  // CHO PHÉP TRUY CẬP
  return children;
};

export default ProtectedRoute;