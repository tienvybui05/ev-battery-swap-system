import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartColumn,
    faDollarSign,
    faUser,
    faWrench,
    faBatteryFull,
    faBolt,
    faPlugCircleBolt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatsHeader.module.css";

const StatsHeader = () => {
    const [statusData, setStatusData] = useState({
        ready: 0,
        charging: 0,
        using: 0,
        maintenance: 0,
    });

    const [loading, setLoading] = useState(true);

    // 🟢 Gọi API backend lấy dữ liệu thống kê pin
    const fetchBatteryStatus = async () => {
        try {
            const res = await fetch("/api/battery-service/status");
            if (!res.ok) throw new Error("Không thể tải dữ liệu trạng thái pin");
            const data = await res.json();
            console.log("📊 Battery status:", data);
            setStatusData({
                ready: data.sanSang ?? data.ready ?? 0,
                charging: data.dangSac ?? data.charging ?? 0,
                using: data.dangSuDung ?? data.using ?? 0,
                maintenance: data.baoTri ?? data.maintenance ?? 0,
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

    // 🔹 Các dữ liệu khác vẫn giả lập
    const statsData = [
        { id: 1, icon: faChartColumn, color: "#4F46E5", value: "47", label: "Thay Pin Hôm Nay" },
        { id: 2, icon: faDollarSign, color: "#10B981", value: "$1175", label: "Doanh Thu" },
        { id: 3, icon: faUser, color: "#F97316", value: "4.8", label: "Đánh Giá" },
        { id: 4, icon: faWrench, color: "#EF4444", value: statusData.maintenance, label: "Pin Bảo Trì" },
        { id: 5, icon: faBatteryFull, color: "#22C55E", value: statusData.ready, label: "Pin Sẵn Sàng" },
        { id: 6, icon: faBolt, color: "#F59E0B", value: statusData.charging, label: "Pin Đang Sạc" },
        { id: 7, icon: faPlugCircleBolt, color: "#3B82F6", value: statusData.using, label: "Pin Đang Sử Dụng" },
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
