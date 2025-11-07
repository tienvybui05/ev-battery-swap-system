import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartColumn,
    faDollarSign,
    faUser,
    faWrench,
    faBatteryFull,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatsHeader.module.css";

const StatsHeader = () => {
    const [statusData, setStatusData] = useState({
        day: 0,        // pin đầy
        charging: 0,   // pin đang sạc
        maintenance: 0 // pin bảo trì
    });

    const [loading, setLoading] = useState(true);

    // 🟢 Gọi API backend lấy dữ liệu thống kê pin (theo tình trạng kỹ thuật)
    const fetchBatteryStatus = async () => {
        try {
            const res = await fetch("/api/battery-service/status");
            if (!res.ok) throw new Error("Không thể tải dữ liệu trạng thái pin");

            const data = await res.json();
            console.log("📊 Battery status:", data);

            setStatusData({
                day: data.day ?? 0,
                charging: data.dangSac ?? 0,
                maintenance: data.baoTri ?? 0,
            });
        } catch (err) {
            console.error("⚠️ Lỗi khi tải dữ liệu pin:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatteryStatus();
    }, []);

    // 🔹 Nếu đang loading thì hiện thông báo
    if (loading) {
        return (
            <div className={styles.statsHeader}>
                <div className={styles.loading}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    // 🔹 Dữ liệu hiển thị
    const statsData = [
        { id: 1, icon: faChartColumn, color: "#4F46E5", value: "47", label: "Thay Pin Hôm Nay" },
        { id: 2, icon: faDollarSign, color: "#10B981", value: "$1175", label: "Doanh Thu" },
        { id: 3, icon: faUser, color: "#F97316", value: "4.8", label: "Đánh Giá" },
        { id: 4, icon: faWrench, color: "#EF4444", value: statusData.maintenance, label: "Pin Bảo Trì" },
        { id: 5, icon: faBatteryFull, color: "#22C55E", value: statusData.day, label: "Pin Đầy" },
        { id: 6, icon: faBolt, color: "#F59E0B", value: statusData.charging, label: "Pin Đang Sạc" },
    ];

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
