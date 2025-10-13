import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faWrench,
  faCalendar,
  faClock,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Batteries.module.css";

function Batteries() {
  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Giả lập dữ liệu mock (sau này có thể thay bằng API thật)
  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        topKpi: [
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
        ],
        fleet: {
          totalBatteries: 263,
          healthy: 145,
          degraded: 87,
          critical: 31,
        },
        allocation: [
          { station: "Trạm Trung Tâm", used: 17, total: 20 },
          { station: "Trạm Thương Mại", used: 10, total: 15 },
          { station: "Trạm Sân Bay", used: 10, total: 25 },
        ],
      };
      setBatteryData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

 
}

export default Batteries;
