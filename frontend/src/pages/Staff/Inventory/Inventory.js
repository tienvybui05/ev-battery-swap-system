import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRotateRight,
    faWrench,
    faFileLines,
    faPlus,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import StatsHeader from "../components/StatsHeader/StatsHeader";
import styles from "./Inventory.module.css";

/* ========= ÁNH XẠ MÀU CHO TRẠNG THÁI ========= */
const STATUS_COLORS = {
    "sẵn sàng": "#10B981", // xanh lá
    "đang sạc": "#F59E0B", // vàng
    "đang được sử dụng": "#3B82F6", // xanh dương
    "bảo trì": "#EF4444", // đỏ
};

/* ========= COMPONENT CHÍNH ========= */
function Inventory() {
    const [pins, setPins] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    /* -------------------- LẤY TOKEN -------------------- */
    const getAuthToken = () => localStorage.getItem("token");

    /* -------------------- FETCH DATA -------------------- */
    const fetchPinList = async () => {
        try {
            setListLoading(true);
            const token = getAuthToken();

            // ✅ Gọi song song 2 API: danh sách pin + lịch sử pin trạm
            const [pinsRes, historyRes] = await Promise.all([
                fetch("/api/battery-service/pins", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }),
                fetch("/api/battery-service/lichsu-pin-tram", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }),
            ]);

            if (pinsRes.ok && historyRes.ok) {
                const pinsData = await pinsRes.json();
                const historyData = await historyRes.json();

                console.log("📦 Danh sách pin:", pinsData);
                console.log("📜 Lịch sử pin - trạm:", historyData);

                // ✅ Ghép dữ liệu từ 2 API dựa trên maPin
                const mapped = pinsData.map((p, i) => {
                    const pinId = p.maPin ?? p.ma_pin ?? i + 1;
                    const record = historyData.find(
                        (h) =>
                            h.maPin === pinId ||
                            h.ma_pin === pinId
                    );

                    const tramName = record
                        ? `Trạm ${record.maTram ?? record.ma_tram}`
                        : "Chưa có lịch sử";

                    return {
                        id: pinId,
                        title: `Pin ${pinId} – ${tramName}`,
                        type: p.loaiPin ?? p.loai_pin ?? "Không rõ",
                        status: (p.tinhTrang ?? p.tinh_trang ?? "sẵn sàng").toLowerCase(),
                        health: Number(p.sucKhoe ?? p.suc_khoe ?? 0),
                        capacity: p.dungLuong ?? p.dung_luong ?? 0,
                        lastMaintenance:
                            p.ngayBaoDuongGanNhat ?? p.ngay_bao_duong_gan_nhat ?? "—",
                        importDate: p.ngayNhapKho ?? p.ngay_nhap_kho ?? "—",
                    };
                });

                setPins(mapped);
            } else {
                console.error("❌ Lỗi tải dữ liệu:", pinsRes.status, historyRes.status);
                setPins([]);
            }
        } catch (err) {
            console.error("⚠️ Lỗi kết nối API battery-service:", err);
            setPins([]);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchPinList();
    }, []);

    /* -------------------- LOADING -------------------- */
    if (listLoading) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <p>🔄 Đang tải dữ liệu pin...</p>
            </div>
        );
    }

    /* -------------------- UI CHÍNH -------------------- */
    return (
        <div className={styles.inventoryPage}>
            <StatsHeader />

            {/* HEADER */}
            <div className={styles.headerRow}>
                <h2>Kho Pin</h2>
                <div className={styles.headerButtons}>
                    <button
                        className={styles.filterBtn}
                        onClick={() => alert("Tính năng lọc đang phát triển")}
                    >
                        <FontAwesomeIcon icon={faFilter} /> Lọc
                    </button>

                    <button
                        className={styles.primaryBtn}
                        onClick={() => alert("Chức năng kiểm tra đang phát triển")}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Kiểm tra
                    </button>

                    <button
                        className={styles.primaryBtn}
                        onClick={fetchPinList}
                        disabled={listLoading}
                    >
                        <FontAwesomeIcon
                            icon={faRotateRight}
                            className={listLoading ? styles.spin : ""}
                        />{" "}
                        Làm mới
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className={styles.grid}>
                {pins.map((pin) => {
                    const color = STATUS_COLORS[pin.status] || "#6B7280";
                    return (
                        <div key={pin.id} className={styles.card}>
                            {/* --- HEADER --- */}
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.title}>{pin.title}</div>
                                    <div className={styles.type}>{pin.type}</div>
                                </div>
                                <div className={styles.statusBadge}>
                                    <span
                                        className={styles.statusDot}
                                        style={{ background: color }}
                                    />
                                    <span className={styles.statusText}>
                                        {pin.status.charAt(0).toUpperCase() + pin.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* --- METRICS --- */}
                            <div className={styles.metrics}>
                                <div>
                                    <div className={styles.metricLabel}>Sức khỏe:</div>
                                    <div className={styles.metricValue}>{pin.health}%</div>
                                </div>
                                <div>
                                    <div className={styles.metricLabel}>Dung lượng:</div>
                                    <div className={styles.metricValue}>
                                        {pin.capacity} kWh
                                    </div>
                                </div>
                            </div>

                            {/* --- DATES --- */}
                            <div className={styles.datesRow}>
                                <div>
                                    <div className={styles.metricLabel}>Ngày nhập kho:</div>
                                    <div className={styles.metricValue}>{pin.importDate}</div>
                                </div>
                                <div>
                                    <div className={styles.metricLabel}>
                                        Lần bảo dưỡng gần nhất:
                                    </div>
                                    <div className={styles.metricValue}>
                                        {pin.lastMaintenance}
                                    </div>
                                </div>
                            </div>

                            {/* --- PROGRESS BAR --- */}
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${pin.health}%`,
                                        background: color,
                                    }}
                                />
                            </div>

                            {/* --- ACTIONS --- */}
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.action}
                                    onClick={() => alert(`Làm mới ${pin.title}`)}
                                >
                                    <FontAwesomeIcon icon={faRotateRight} />
                                    Làm mới
                                </button>

                                <button
                                    className={styles.action}
                                    onClick={() => alert(`Chi tiết ${pin.title}`)}
                                >
                                    <FontAwesomeIcon icon={faFileLines} />
                                    Chi tiết
                                </button>

                                <button
                                    className={styles.action}
                                    onClick={() => alert(`Cài đặt ${pin.title}`)}
                                >
                                    <FontAwesomeIcon icon={faWrench} />
                                    Cài đặt
                                </button>
                            </div>
                        </div>
                    );
                })}

                {pins.length === 0 && (
                    <div className={styles.emptyState}>
                        Không có pin nào được tìm thấy.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inventory;
