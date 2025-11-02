import { BrowserRouter, Routes, Route, Navigate } from "react-router"; // THÊM Navigate
import { PublicLayout, PrivateLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Authentication/Login/Login";
import Register from "./pages/Authentication/Register/Register";
import AIInsights from "./pages/Admin/AIInsights/AIInsights";
import Alerts from "./pages/Admin/Alerts/Alerts";
import {
  FindStation,
  History,
  Information,
  ChangeBattery,
  Support
} from "./pages/Driver";
import { Batteries, Customers, Overview, Staff, Stations } from "./pages/Admin";
import { Report, Inventory, QueueManagement, Transaction } from "./pages/Staff";
import ProtectedRoute from "./components/Shares/ProtectedRoute/ProtectedRoute.js";

// THÊM: Component bảo vệ toàn bộ dashboard
const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* BỌC PrivateLayout VỚI ProtectedLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <PrivateLayout />
              </ProtectedLayout>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Driver - chỉ TAIXE được truy cập */}
            <Route
              path="findstation"
              element={
                <ProtectedRoute allowedRoles={["TAIXE"]}>
                  <FindStation />
                </ProtectedRoute>
              }
            />
            <Route
              path="changebattery"
              element={
                <ProtectedRoute allowedRoles={["TAIXE"]}>
                  <ChangeBattery />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute allowedRoles={["TAIXE"]}>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="information"
              element={
                <ProtectedRoute allowedRoles={["TAIXE"]}>
                  <Information />
                </ProtectedRoute>
              }
            />
            <Route
              path="support"
              element={
                <ProtectedRoute allowedRoles={["TAIXE"]}>
                  <Support />
                </ProtectedRoute>
              }
            />

            {/* Staff - chỉ NHANVIEN được truy cập */}
            <Route
              path="transaction"
              element={
                <ProtectedRoute allowedRoles={["NHANVIEN"]}>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="queueManagement"
              element={
                <ProtectedRoute allowedRoles={["NHANVIEN"]}>
                  <QueueManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="inventory"
              element={
                <ProtectedRoute allowedRoles={["NHANVIEN"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="report"
              element={
                <ProtectedRoute allowedRoles={["NHANVIEN"]}>
                  <Report />
                </ProtectedRoute>
              }
            />

            {/* Admin - chỉ ADMIN được truy cập */}
            <Route
              path="overview"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Overview />
                </ProtectedRoute>
              }
            />
            <Route
              path="stations"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Stations />
                </ProtectedRoute>
              }
            />
            <Route
              path="batteries"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Batteries />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="aiinsights"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AIInsights />
                </ProtectedRoute>
              }
            />
            <Route
              path="alerts"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Alerts />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;