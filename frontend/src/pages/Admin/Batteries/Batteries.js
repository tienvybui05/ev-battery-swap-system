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
    faRotateRight,
    faFilter,
    faFileLines,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Batteries.module.css";

/* ========= ÁNH XẠ MÀU TRẠNG THÁI ========= */
const STATUS_COLORS = {
    "sẵn sàng": "#10B981",
    "đang sạc": "#F59E0B",
    "đang được sử dụng": "#3B82F6",
    "bảo trì": "#EF4444",
};

function Batteries() {
    const [batteryData] = useState({
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
        fleet: { totalBatteries: 263, healthy: 145, degraded: 87, critical: 31 },
        allocation: [
            { station: "Trạm Trung Tâm", used: 17, total: 20 },
            { station: "Trạm Thương Mại", used: 10, total: 15 },
            { station: "Trạm Sân Bay", used: 10, total: 25 },
        ],
    });

    const [pins, setPins] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    const getAuthToken = () => localStorage.getItem("token");

    const fetchPinList = async () => {
        try {
            setListLoading(true);
            const token = getAuthToken();

            const response = await fetch("/api/battery-service/pins", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                const mapped = data.map((p, i) => ({
                    id: p.maPin ?? p.ma_pin ?? i + 1,
                    title: `Pin ${p.maPin ?? p.ma_pin ?? i + 1}`,
                    type: p.loaiPin ?? p.loai_pin ?? "Không rõ",
                    status: (p.tinhTrang ?? p.tinh_trang ?? "sẵn sàng").toLowerCase(),
                    health: Number(p.sucKhoe ?? p.suc_khoe ?? 0),
                    capacity: p.dungLuong ?? p.dung_luong ?? 0,
                    lastMaintenance:
                        p.ngayBaoDuongGanNhat ?? p.ngay_bao_duong_gan_nhat ?? "—",
                    importDate: p.ngayNhapKho ?? p.ngay_nhap_kho ?? "—",
                }));
                setPins(mapped);
            } else {
                console.error("❌ Lỗi tải danh sách pin:", response.status);
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

    if (listLoading) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <p>🔄 Đang tải dữ liệu pin...</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* KPI */}
            <div className={styles.kpiGrid}>
                {batteryData.topKpi.map((item, index) => (
                    <div key={index} className={styles.kpiCard}>
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

            {/* === 3 CARD: Fleet / Maintenance / Allocation === */}
            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <h3>Tổng Quan Đội Pin</h3>
                    <div className={styles.fleetStats}>
                        <p>
                            Tổng số pin: <span>{batteryData.fleet.totalBatteries}</span>
                        </p>
                        <p>
                            Tình trạng tốt (&gt;90%):{" "}
                            <span className={styles.green}>{batteryData.fleet.healthy}</span>
                        </p>
                        <p>
                            Suy giảm (70–90%):{" "}
                            <span className={styles.yellow}>{batteryData.fleet.degraded}</span>
                        </p>
                        <p>
                            Nguy kịch (&lt;70%):{" "}
                            <span className={styles.red}>{batteryData.fleet.critical}</span>
                        </p>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>Lịch Bảo Trì</h3>
                    <div className={styles.maintenanceList}>
                        <div className={`${styles.maintenanceItem} ${styles.redBg}`}>
                            <FontAwesomeIcon icon={faWrench} />
                            <div>
                                <strong>Khẩn cấp: 8 pin</strong>
                                <p>Cần kiểm tra ngay lập tức</p>
                            </div>
                        </div>
                        <div className={`${styles.maintenanceItem} ${styles.yellowBg}`}>
                            <FontAwesomeIcon icon={faCalendar} />
                            <div>
                                <strong>Tuần này: 15 pin</strong>
                                <p>Bảo trì theo kế hoạch</p>
                            </div>
                        </div>
                        <div className={`${styles.maintenanceItem} ${styles.blueBg}`}>
                            <FontAwesomeIcon icon={faClock} />
                            <div>
                                <strong>Tháng sau: 23 pin</strong>
                                <p>Kiểm tra định kỳ</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>Phân Bổ Pin</h3>
                    <div className={styles.allocationList}>
                        {batteryData.allocation.map((st, i) => {
                            const percent = Math.round((st.used / st.total) * 100);
                            return (
                                <div key={i} className={styles.allocationRow}>
                                    <span>{st.station}</span>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <span>
                    {st.used}/{st.total}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                    <button className={styles.optimizeBtn}>Tối Ưu Phân Bổ</button>
                </div>
            </div>

            {/* === DANH SÁCH PIN === */}
            <div className={styles.inventoryPage}>
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
                            <FontAwesomeIcon icon={faRotateRight} /> Làm mới
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    {pins.map((pin) => {
                        const color = STATUS_COLORS[pin.status] || "#6B7280";
                        return (
                            <div key={pin.id} className={styles.card}>
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

                                <div className={styles.datesRow}>
                                    <div>
                                        <div className={styles.metricLabel}>Ngày nhập kho:</div>
                                        <div className={styles.metricValue}>{pin.importDate}</div>
                                    </div>
                                    <div>
                                        <div className={styles.metricLabel}>Bảo dưỡng:</div>
                                        <div className={styles.metricValue}>
                                            {pin.lastMaintenance}
                                        </div>
                                    </div>
                                </div>

                                {/* === THANH MÀU TÌNH TRẠNG === */}
                                <div className={styles.pinProgressBar}>
                                    <div
                                        className={styles.pinProgressFill}
                                        style={{
                                            width: `${pin.health}%`,
                                            background: color,
                                        }}
                                    />
                                </div>

                                {/* ACTIONS */}
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.action}
                                        onClick={() => alert(`Làm mới ${pin.title}`)}
                                    >
                                        <FontAwesomeIcon icon={faRotateRight} /> Làm mới
                                    </button>
                                    <button
                                        className={styles.action}
                                        onClick={() => alert(`Chi tiết ${pin.title}`)}
                                    >
                                        <FontAwesomeIcon icon={faFileLines} /> Chi tiết
                                    </button>
                                    <button
                                        className={styles.action}
                                        onClick={() => alert(`Cài đặt ${pin.title}`)}
                                    >
                                        <FontAwesomeIcon icon={faWrench} /> Cài đặt
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Batteries;



/*
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
    const [batteryData, setBatteryData] = useState({
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
    });

    return (
        <div className={styles.wrapper}>
            {/!* KPI đầu trang *!/}
            <div className={styles.kpiGrid}>
                {batteryData.topKpi.map((item, index) => (
                    <div key={index} className={styles.kpiCard}>
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

            {/!* Header *!/}
            <div className={styles.header}>
                <h2 className={styles.title}>Quản Lý Đội Pin</h2>
                <div className={styles.headerActions}>
                    <select className={styles.selectBox}>
                        <option>30 ngày</option>
                        <option>7 ngày</option>
                        <option>90 ngày</option>
                    </select>
                    <button className={styles.exportBtn}>
                        <FontAwesomeIcon icon={faDownload} /> Xuất Dữ Liệu
                    </button>
                </div>
            </div>

            {/!* Grid 3 card *!/}
            <div className={styles.cardGrid}>
                {/!* 1️⃣ Thống kê đội pin *!/}
                <div className={styles.card}>
                    <h3>Tổng Quan Đội Pin</h3>
                    <div className={styles.fleetStats}>
                        <p>
                            Tổng số pin: <span>{batteryData.fleet.totalBatteries}</span>
                        </p>
                        <p>
                            Tình trạng tốt (&gt;90%):{" "}
                            <span className={styles.green}>{batteryData.fleet.healthy}</span>
                        </p>
                        <p>
                            Suy giảm (70–90%):{" "}
                            <span className={styles.yellow}>{batteryData.fleet.degraded}</span>
                        </p>
                        <p>
                            Nguy kịch (&lt;70%):{" "}
                            <span className={styles.red}>{batteryData.fleet.critical}</span>
                        </p>
                    </div>
                </div>

                {/!* 2️⃣ Lịch bảo trì *!/}
                <div className={styles.card}>
                    <h3>Lịch Bảo Trì</h3>
                    <div className={styles.maintenanceList}>
                        <div className={`${styles.maintenanceItem} ${styles.redBg}`}>
                            <FontAwesomeIcon icon={faWrench} />
                            <div>
                                <strong>Khẩn cấp: 8 pin</strong>
                                <p>Cần kiểm tra ngay lập tức</p>
                            </div>
                        </div>

                        <div className={`${styles.maintenanceItem} ${styles.yellowBg}`}>
                            <FontAwesomeIcon icon={faCalendar} />
                            <div>
                                <strong>Tuần này: 15 pin</strong>
                                <p>Bảo trì theo kế hoạch</p>
                            </div>
                        </div>

                        <div className={`${styles.maintenanceItem} ${styles.blueBg}`}>
                            <FontAwesomeIcon icon={faClock} />
                            <div>
                                <strong>Tháng sau: 23 pin</strong>
                                <p>Kiểm tra định kỳ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/!* 3️⃣ Phân bổ pin *!/}
                <div className={styles.card}>
                    <h3>Phân Bổ Pin</h3>
                    <div className={styles.allocationList}>
                        {batteryData.allocation.map((st, i) => {
                            const percent = Math.round((st.used / st.total) * 100);
                            return (
                                <div key={i} className={styles.allocationRow}>
                                    <span>{st.station}</span>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <span>
                    {st.used}/{st.total}
                  </span>
                                </div>
                            );
                        })}
                    </div>

                    <button className={styles.optimizeBtn}>Tối Ưu Phân Bổ</button>
                </div>
            </div>
        </div>
    );
}

export default Batteries;*/
