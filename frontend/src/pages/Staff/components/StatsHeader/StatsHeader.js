import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartColumn,
  faDollarSign,
  faClock,
  faUser,
  faTriangleExclamation,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatsHeader.module.css";

const statsData = [
  { id: 1, icon: faChartColumn, color: "#4F46E5", value: "47", label: "Thay Pin Hôm Nay" },
  { id: 2, icon: faDollarSign, color: "#10B981", value: "$1175", label: "Doanh Thu" },
  { id: 3, icon: faClock, color: "#8B5CF6", value: "2.8m", label: "Thời Gian Trung Bình" },
  { id: 4, icon: faUser, color: "#F97316", value: "4.8", label: "Đánh Giá" },
  { id: 5, icon: faTriangleExclamation, color: "#FACC15", value: "3", label: "Pin Năng Suất" },
  { id: 6, icon: faWrench, color: "#EF4444", value: "1", label: "Bảo Trì" },
];

const StatsHeader = () => {
  return (
    <div className={styles.statsHeader}>
      {statsData.map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={item.icon} size="lg" color={item.color} />
          </div>
          <div className={styles.value}>{item.value}</div>
          <div className={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
