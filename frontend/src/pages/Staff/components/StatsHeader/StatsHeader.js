import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartColumn,
    faDollarSign,
    faUser,
    faTriangleExclamation,
    faWrench,
    faBatteryFull,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatsHeader.module.css";

const statsData = [
    { id: 1, icon: faChartColumn, color: "#4F46E5", value: "47", label: "Thay Pin Hôm Nay" },
    { id: 2, icon: faDollarSign, color: "#10B981", value: "$1175", label: "Doanh Thu" },
    { id: 3, icon: faUser, color: "#F97316", value: "4.8", label: "Đánh Giá" },
    { id: 4, icon: faWrench, color: "#EF4444", value: "1", label: "Pin bảo Trì" },
    { id: 5, icon: faBatteryFull, color: "#22C55E", value: "145", label: "Pin Sẵn Sàng" },
    { id: 6, icon: faBolt, color: "#F59E0B", value: "87", label: "Pin Đang Sạc" },
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
