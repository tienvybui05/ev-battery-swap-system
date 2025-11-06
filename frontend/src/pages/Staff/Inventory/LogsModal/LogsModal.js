import React, { useEffect, useState } from "react";
import styles from "./LogsModal.module.css";

export default function LogsModal({ slot, onClose }) {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [stations, setStations] = useState([]);

    const token = localStorage.getItem("token");

    // 🔹 Fetch lịch sử pin trạm và danh sách trạm
    useEffect(() => {
        if (!slot) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [historyRes, tramRes] = await Promise.all([
                    fetch("/api/battery-service/lichsu-pin-tram", {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                    fetch("/api/station-service/tram", {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                ]);

                if (!historyRes.ok || !tramRes.ok) {
                    throw new Error("Không thể tải dữ liệu");
                }

                const [historyData, tramData] = await Promise.all([
                    historyRes.json(),
                    tramRes.json(),
                ]);

                // Lọc lịch sử theo mã pin
                const filtered = historyData
                    .filter((h) => Number(h.maPin ?? h.ma_pin) === Number(slot.id))
                    .sort(
                        (a, b) =>
                            new Date(b.ngayThayDoi ?? b.ngay_thay_doi) -
                            new Date(a.ngayThayDoi ?? a.ngay_thay_doi)
                    );

                setStations(tramData);
                setLogs(filtered);
            } catch (err) {
                console.error("⚠️ Lỗi tải dữ liệu logs:", err);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slot]);

    // 🔹 Hàm lấy tên trạm
    const getTramName = (maTram) => {
        const tram = stations.find(
            (t) => Number(t.maTram ?? t.ma_tram) === Number(maTram)
        );
        return tram
            ? tram.tenTram ?? tram.ten_tram ?? `Trạm ${maTram}`
            : `Trạm ${maTram}`;
    };

    if (!slot) return null;

    return (
        <div
            className={styles.overlay}
            onClick={(e) =>
                e.target.classList.contains(styles.overlay) && onClose?.()
            }
        >
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Lịch sử pin – {slot.title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.body}>
                    {loading ? (
                        <p>🔄 Đang tải dữ liệu...</p>
                    ) : logs.length > 0 ? (
                        <ul className={styles.logList}>
                            {logs.map((l, i) => {
                                const time =
                                    l.ngayThayDoi ?? l.ngay_thay_doi ?? "Không rõ thời gian";
                                const action = l.hanhDong ?? l.hanh_dong ?? "—";
                                const tramName = getTramName(l.maTram ?? l.ma_tram);
                                return (
                                    <li key={i}>
                                        <strong>{new Date(time).toLocaleString("vi-VN")}</strong> —{" "}
                                        {action} tại <em>{tramName}</em>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>Không có lịch sử nào cho pin này.</p>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.secondaryBtn} onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
