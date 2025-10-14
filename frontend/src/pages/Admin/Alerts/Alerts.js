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

  return (
    <div className={styles.wrapper}>
      {/* 🔹 KPI Header */}
      <div className={styles.kpiGrid}>
        {kpiData.map((item, i) => (
          <div key={i} className={styles.kpiCard}>
            <div className={styles.kpiInfo}>
              <p className={styles.kpiTitle}>{item.title}</p>
              <h2 className={styles.kpiValue}>{item.value}</h2>
              <p className={styles.kpiSub}>{item.sub}</p>
            </div>
            <div
              className={styles.kpiIcon}
              style={{ color: item.color, backgroundColor: item.color + "20" }}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Cảnh Báo & Thông Báo Hệ Thống</h2>
        <div className={styles.actions}>
          <button className={styles.markAll}>Đánh dấu tất cả đã đọc</button>
          <button className={styles.settings}>
            <FontAwesomeIcon icon={faGear} /> Cài đặt cảnh báo
          </button>
        </div>
      </div>

      {/* 🔹 Danh sách cảnh báo */}
      <div className={styles.alertList}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${styles.alertCard} ${styles[alert.type]}`}
          >
            <div className={styles.alertMain}>
              <FontAwesomeIcon
                icon={alert.icon}
                className={`${styles.alertIcon} ${styles[alert.type + "Icon"]}`}
              />
              <div className={styles.alertInfo}>
                <p className={styles.alertTitle}>{alert.title}</p>
                <span className={styles.alertMeta}>
                  {alert.time} • {alert.source}
                </span>
              </div>
            </div>
            <div className={styles.alertActions}>
              <button className={styles.viewBtn}>Xem chi tiết</button>
              <button
                className={styles.dismissBtn}
                onClick={() => handleDismiss(alert.id)}
              >
                Ẩn thông báo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
