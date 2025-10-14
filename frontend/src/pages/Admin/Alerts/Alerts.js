import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faGear,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Alerts.module.css";

function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      icon: faTimesCircle,
      title: "Trạm B1 có tình trạng pin dưới 50%",
      time: "2 phút trước",
      source: "Trạm Trung Tâm",
    },
    {
      id: 2,
      type: "warning",
      icon: faExclamationTriangle,
      title: "Dự đoán nhu cầu cao trong khung 18h–20h",
      time: "15 phút trước",
      source: "Tất cả các trạm",
    },
    {
      id: 3,
      type: "info",
      icon: faCheckCircle,
      title: "Đã đạt chỉ tiêu doanh thu tháng",
      time: "1 giờ trước",
      source: "Hệ thống",
    },
    {
      id: 4,
      type: "critical",
      icon: faTimesCircle,
      title: "Lỗi cổng thanh toán — kết nối bị gián đoạn",
      time: "2 giờ trước",
      source: "Tất cả các trạm",
    },
  ]);

  const handleDismiss = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const kpiData = [
    {
      title: "Tổng Doanh Thu",
      value: "$267.000",
      sub: "+12.5%",
      color: "#16a34a",
      icon: faDollarSign,
    },
    {
      title: "Tổng Lần Thay Pin",
      value: "12.847",
      sub: "+8.3%",
      color: "#3b82f6",
      icon: faBatteryFull,
    },
    {
      title: "Trạm Hoạt Động",
      value: "24",
      sub: "Tất cả trực tuyến",
      color: "#a855f7",
      icon: faLocationDot,
    },
    {
      title: "Khách Hàng",
      value: "8.547",
      sub: "+156 mới",
      color: "#f97316",
      icon: faUsers,
    },
  ];

  
}

export default Alerts;
