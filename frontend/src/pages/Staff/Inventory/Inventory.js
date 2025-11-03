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

            const response = await fetch("/api/battery-service/pins", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                console.log("📦 Danh sách pin từ API:", data);

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
                                    <div className={styles.metricValue}>{pin.lastMaintenance}</div>
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
                    <div className={styles.emptyState}>Không có pin nào được tìm thấy.</div>
                )}
            </div>
        </div>
    );
}

export default Inventory;
/*
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faWrench,
  faFileLines,
  faPlus,
  faFilter,
  faXmark,
  faCheck,
  faBatteryHalf,
} from "@fortawesome/free-solid-svg-icons";
import StatsHeader from "../components/StatsHeader/StatsHeader";
import styles from "./Inventory.module.css";

const initialSlots = [
  {
    id: "A1",
    title: "Slot A1",
    type: "TM3-75kWh",
    status: "đầy",
    soh: 95,
    voltage: 400,
    cycles: 1250,
    temp: 25,
    lastChange: "10 min ago",
    level: 0.95,
    logs: [
      { t: "2024-06-01", msg: "Installed" },
      { t: "2024-06-12", msg: "Charging cycle" },
    ],
    checks: [],
  },
  {
    id: "A2",
    title: "Slot A2",
    type: "TM3-75kWh",
    status: "đang sạc",
    soh: 92,
    voltage: 380,
    cycles: 1180,
    temp: 28,
    lastChange: "2 hours ago",
    level: 0.56,
    logs: [{ t: "2024-06-10", msg: "Start charging" }],
    checks: [],
  },
  {
    id: "A3",
    title: "Slot A3",
    type: "BMW-80kWh",
    status: "đầy",
    soh: 88,
    voltage: 395,
    cycles: 1650,
    temp: 24,
    lastChange: "1 hour ago",
    level: 0.86,
    logs: [],
    checks: [],
  },
  {
    id: "B1",
    title: "Slot B1",
    type: "TM3-75kWh",
    status: "bảo trì",
    soh: 60,
    voltage: 0,
    cycles: 2000,
    temp: 0,
    lastChange: "maintenance",
    level: 0.2,
    logs: [{ t: "2024-05-20", msg: "Sent to maintenance" }],
    checks: [],
  },
  {
    id: "B2",
    title: "Slot B2",
    type: "BMW-80kWh",
    status: "đang sạc",
    soh: 86,
    voltage: 390,
    cycles: 1400,
    temp: 26,
    lastChange: "30 min ago",
    level: 0.75,
    logs: [],
    checks: [],
  },
  {
    id: "B3",
    title: "Slot B3",
    type: "BMW-80kWh",
    status: "đầy",
    soh: 90,
    voltage: 398,
    cycles: 1300,
    temp: 23,
    lastChange: "3 hours ago",
    level: 0.9,
    logs: [],
    checks: [],
  },
];

const EMPTY_FILTERS = {
  status: [],
  slotPrefix: "",
  minSoH: null,
};

function Inventory() {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // realtime drift for charging slots
  useEffect(() => {
    const id = setInterval(() => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.status !== "đang sạc") return s;

          const level = Math.min(
            1,
            +(s.level + Math.random() * 0.01).toFixed(3)
          );

          const voltage = Math.round(s.voltage + Math.random() * 1);

          return {
            ...s,
            level,
            voltage,
            temp: s.temp + (Math.random() * 0.2 - 0.1),
          };
        })
      );
    }, 5000);

    return () => clearInterval(id);
  }, []);

  function refreshSlot(slotId) {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;

        const voltage = s.voltage
          ? Math.round(s.voltage + (Math.random() * 6 - 3))
          : s.voltage;

        const temp = Math.max(
          15,
          Math.round(s.temp + (Math.random() * 3 - 1))
        );

        const level = Math.max(
          0,
          Math.min(1, +(s.level + (Math.random() * 0.03 - 0.01)).toFixed(3))
        );

        const log = {
          t: new Date().toISOString(),
          msg: "Refreshed readings",
        };

        let status = s.status;
        if (s.status !== "bảo trì") {
          status = level >= 0.85 ? "đầy" : "đang sạc";
        }

        return {
          ...s,
          voltage,
          temp,
          level,
          lastChange: "just now",
          status,
          logs: [log, ...s.logs].slice(0, 30),
        };
      })
    );
  }

  function openSettings(slot) {
    setSelectedSlot(slot);
    setShowSettings(true);
  }

  function openLogs(slot) {
    setSelectedSlot(slot);
    setShowLogs(true);
  }

  function openCheckModal(slot) {
    setSelectedSlot(slot);
    setShowCheckModal(true);
  }

  function applyStatusChange(slotId, action) {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;

        if (action === "maintenance") {
          const log = {
            t: new Date().toISOString(),
            msg: "Requested maintenance",
          };
          return {
            ...s,
            status: "bảo trì",
            logs: [log, ...s.logs].slice(0, 30),
          };
        }

        if (action === "ready") {
          const status = (s.level || 0) >= 0.85 ? "đầy" : "đang sạc";
          const log = {
            t: new Date().toISOString(),
            msg: "Marked ready",
          };
          return {
            ...s,
            status,
            logs: [log, ...s.logs].slice(0, 30),
          };
        }

        return s;
      })
    );

    setShowSettings(false);
  }

  function completeCheckAndCreatePin(formData) {
    const newId = `C${Math.floor(Math.random() * 900 + 100)}`;
    const sohNum = Number(formData.soh) || 50;

    const newSlot = {
      id: newId,
      title: `Slot ${newId}`,
      type: formData.model || "Unknown",
      status: sohNum >= 85 ? "đầy" : "đang sạc",
      soh: sohNum,
      voltage: Number(formData.voltage) || 380,
      cycles: Number(formData.cycles) || 0,
      temp: Number(formData.temp) || 25,
      lastChange: "just checked",
      level: (sohNum || 50) / 100,
      logs: [
        { t: new Date().toISOString(), msg: "Created from check" },
      ],
      checks: [formData],
    };

    setSlots((prev) => [newSlot, ...prev]);
    setShowCheckModal(false);
  }

  // ========== FILTERS ==========
  function applyFilter(nf) {
    const normalized = {
      status: Array.isArray(nf?.status) ? nf.status : [],
      slotPrefix:
        typeof nf?.slotPrefix === "string"
          ? nf.slotPrefix.trim().toUpperCase()
          : "",
      minSoH:
        nf?.minSoH === "" || nf?.minSoH == null
          ? null
          : Number.isNaN(Number(nf.minSoH))
          ? null
          : Number(nf.minSoH),
    };

    setFilters(normalized);
    setShowFilter(false);
  }

  const visibleSlots = useMemo(() => {
    return slots.filter((s) => {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [];

      if (statuses.length && !statuses.includes(s.status)) {
        return false;
      }

      const prefix = (filters.slotPrefix || "").toUpperCase();
      if (prefix && !String(s.id).toUpperCase().startsWith(prefix)) {
        return false;
      }

      const min = filters.minSoH;
      if (
        min != null &&
        Number.isFinite(min) &&
        s.soh < Number(min)
      ) {
        return false;
      }

      return true;
    });
  }, [slots, filters]);

  return (
    <div className={styles.inventoryPage}>
      <StatsHeader />

      <div className={styles.headerRow}>
        <h2>Kho Pin</h2>

        <div className={styles.headerButtons}>
          <button
            className={styles.filterBtn}
            onClick={() => setShowFilter(true)}
          >
            <FontAwesomeIcon icon={faFilter} />
            {" "}
            Lọc
          </button>

          <button
            className={styles.primaryBtn}
            onClick={() => openCheckModal(null)}
          >
            <FontAwesomeIcon icon={faPlus} />
            {" "}
            Kiểm tra
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {visibleSlots.map((s) => (
          <div key={s.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.title}>{s.title}</div>
                <div className={styles.type}>{s.type}</div>
              </div>

              <div className={styles.statusBadge}>
                <span
                  className={styles.statusDot}
                  style={{
                    background: colorForLevel(s.status, s.level),
                  }}
                />
                <span className={styles.statusText}>{s.status}</span>
              </div>
            </div>

            <div className={styles.metrics}>
              <div>
                <div className={styles.metricLabel}>Sức Khỏe:</div>
                <div className={styles.metricValue}>{s.soh}%</div>
              </div>

              <div>
                <div className={styles.metricLabel}>Điện áp:</div>
                <div className={styles.metricValue}>{s.voltage}V</div>
              </div>

              <div>
                <div className={styles.metricLabel}>Số vòng:</div>
                <div className={styles.metricValue}>
                  {s.cycles.toLocaleString()}
                </div>
              </div>

              <div>
                <div className={styles.metricLabel}>Nhiệt độ:</div>
                <div className={styles.metricValue}>
                  {Math.round(s.temp)}°C
                </div>
              </div>

              <div>
                <div className={styles.metricLabel}>Thay Pin Cuối:</div>
                <div className={styles.metricValue}>{s.lastChange}</div>
              </div>
            </div>

            <div className={styles.progressWrap}>
              <div className={styles.progressTopRow}>
                <div className={styles.batteryLabel}>
                  <FontAwesomeIcon
                    icon={faBatteryHalf}
                    className={styles.batteryIcon}
                  />
                  <span className={styles.batteryText}>
                    {Math.round((s.level || 0) * 100)}% Pin
                  </span>
                </div>

                <div className={styles.levelNote}>
                  {s.status === "bảo trì"
                    ? "Cần bảo dưỡng"
                    : s.level >= 0.85
                    ? "Đủ"
                    : "Cần nạp thêm"}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.round((s.level || 0) * 100)}%`,
                    background: colorForLevel(s.status, s.level),
                  }}
                />
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.action}
                onClick={() => refreshSlot(s.id)}
                title="Làm mới"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span className={styles.actionText}>Làm mới</span>
              </button>

              <button
                className={styles.action}
                onClick={() => openSettings(s)}
                title="Cài đặt"
              >
                <FontAwesomeIcon icon={faWrench} />
                <span className={styles.actionText}>Cài đặt</span>
              </button>

              <button
                className={styles.action}
                onClick={() => openLogs(s)}
                title="Chi tiết / logs"
              >
                <FontAwesomeIcon icon={faFileLines} />
                <span className={styles.actionText}>Chi tiết / logs</span>
              </button>
            </div>
          </div>
        ))}

        {visibleSlots.length === 0 && (
          <div className={styles.emptyState}>
            Không có slot nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/!* MODALS *!/}
      {showSettings && selectedSlot && (
        <SettingsModal
          slot={selectedSlot}
          onClose={() => setShowSettings(false)}
          onApply={(action) =>
            applyStatusChange(selectedSlot.id, action)
          }
        />
      )}

      {showLogs && selectedSlot && (
        <LogsModal
          slot={selectedSlot}
          onClose={() => setShowLogs(false)}
        />
      )}

      {showCheckModal && (
        <CheckModal
          slot={selectedSlot}
          onClose={() => setShowCheckModal(false)}
          onComplete={(form) => completeCheckAndCreatePin(form)}
        />
      )}

      {showFilter && (
        <FilterModal
          current={filters}
          onClose={() => setShowFilter(false)}
          onApply={(nf) => applyFilter(nf)}
        />
      )}
    </div>
  );
}

function colorForLevel(status, level) {
  if (status === "bảo trì") return "#EF4444";
  if ((level || 0) >= 0.85) return "#10B981";
  if (status === "đang sạc" || (level || 0) < 0.85) return "#F59E0B";
  return "#111827";
}

/!* ---------- Settings Modal ---------- *!/
function SettingsModal({ slot, onClose, onApply }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Cài Đặt Slot: {slot.title}</h3>
          <button
            className={styles.iconBtn}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>
            Với pin, trạng thái sạc thường được xác định từ mức pin. Bạn có thể:
          </p>

          <div className={styles.settingsActions}>
            <div className={styles.settingsCard}>
              <h4>Sẵn sàng</h4>
              <p>
                Đánh dấu pin là sẵn sàng. Hệ thống sẽ tự chuyển thành
                <strong> Đầy </strong>
                nếu mức pin ≥ 85%, ngược lại là
                <strong> Đang sạc</strong>.
              </p>

              <div className={styles.settingsRow}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => onApply("ready")}
                >
                  Sẵn sàng
                </button>
              </div>
            </div>

            <div className={styles.settingsCard}>
              <h4>Yêu cầu bảo dưỡng</h4>
              <p>
                Gửi yêu cầu bảo dưỡng — pin sẽ được đặt trạng thái
                <strong> Bảo trì</strong>.
              </p>

              <div className={styles.settingsRow}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => onApply("maintenance")}
                >
                  Yêu cầu bảo dưỡng
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

/!* ---------- Logs Modal ---------- *!/
function LogsModal({ slot, onClose }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.modal} ${styles.large}`}>
        <div className={styles.modalHeader}>
          <h3>
            Chi tiết / Logs - {slot.title}
          </h3>

          <button
            className={styles.iconBtn}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h4>Lịch sử</h4>

          <ul className={styles.logList}>
            {slot.logs.length
              ? slot.logs.map((l, i) => (
                  <li key={i}>
                    <strong>{l.t}</strong>
                    {" — "}
                    {l.msg}
                  </li>
                ))
              : <li>Không có lịch sử</li>
            }
          </ul>

          <h4>Nhật ký lỗi</h4>
          <p>Không có lỗi ghi nhận (demo)</p>

          <h4>Lịch sử kiểm tra</h4>
          <ul>
            {slot.checks?.length
              ? slot.checks.map((c, i) => (
                  <li key={i}>
                    {c.date || "—"}: {c.report || "Kiểm tra"}
                  </li>
                ))
              : <li>Chưa có kiểm tra</li>
            }
          </ul>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/!* ---------- Check Modal (ID pin & Khách hàng cùng hàng; thời gian chuẩn; lỗi đỏ) ---------- *!/
function CheckModal({ slot, onClose, onComplete }) {
  const [loadingPins, setLoadingPins] = useState(true);
  const [availablePins, setAvailablePins] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setAvailablePins([
        { id: "BAT-2024-001", customer: "Alex Chen" },
        { id: "BAT-2024-002", customer: "Nguyễn Văn Huy" },
        { id: "BAT-2024-003", customer: "Lê Hoàng" },
      ]);
      setLoadingPins(false);
    }, 400);

    return () => clearTimeout(t);
  }, []);

  const [form, setForm] = useState({
    pinId: "",
    customer: "",
    model: slot?.type || "",
    soh: "",
    voltage: "",
    cycles: "",
    temp: "",
    date: new Date().toISOString().slice(0, 16),
    checklist: {
      physical: false,
      connection: false,
      temp: false,
      voltage: false,
      capacity: false,
    },
    report: "",
  });

  function handlePinSelect(id) {
    const f = availablePins.find((p) => p.id === id);
    setForm((x) => ({
      ...x,
      pinId: id,
      customer: f ? f.customer : "",
    }));
  }

  function update(field, value) {
    setForm((x) => ({ ...x, [field]: value }));
  }

  function toggleChecklist(key) {
    setForm((x) => ({
      ...x,
      checklist: { ...x.checklist, [key]: !x.checklist[key] },
    }));
  }

  // validation + error box
  const sohNum = form.soh === "" ? null : Number(form.soh);
  const voltageNum = form.voltage === "" ? null : Number(form.voltage);
  const cyclesNum = form.cycles === "" ? null : Number(form.cycles);
  const tempNum = form.temp === "" ? null : Number(form.temp);

  const errors = [];
  if (sohNum == null || Number.isNaN(sohNum) || sohNum < 0 || sohNum > 100) {
    errors.push("SoH phải là số từ 0 đến 100");
  }
  if (voltageNum == null || Number.isNaN(voltageNum) || voltageNum < 0) {
    errors.push("Điện áp phải là số dương");
  }
  if (cyclesNum == null || Number.isNaN(cyclesNum) || cyclesNum < 0) {
    errors.push("Số vòng phải là số ≥ 0");
  }
  if (tempNum == null || Number.isNaN(tempNum) || tempNum < -20 || tempNum > 120) {
    errors.push("Nhiệt độ bất thường (phải hợp lý)");
  }

  const canSubmit = errors.length === 0;

  function handleSubmit() {
    if (!canSubmit) return;

    onComplete({
      ...form,
      soh: sohNum,
      voltage: voltageNum,
      cycles: cyclesNum,
      temp: tempNum,
      date: new Date(form.date).toISOString(),
    });
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.modal} ${styles.large}`}>
        <div className={styles.modalHeader}>
          <h3>Kiểm Tra & Ghi Nhận Pin Trả Về</h3>

          <button
            className={styles.iconBtn}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.subtleLead}>
            Kiểm tra pin trả về cho bất kỳ hư hỏng hoặc vấn đề nào trước khi lưu kho.
          </p>

          {/!* Hàng 1: ID Pin + Khách hàng *!/}
          <div className={styles.twoColsRow}>
            <div className={styles.formRow}>
              <label>ID Pin Trả Về</label>

              {loadingPins ? (
                <p>Đang tải danh sách pin...</p>
              ) : (
                <select
                  value={form.pinId}
                  onChange={(e) => handlePinSelect(e.target.value)}
                >
                  <option value="">-- Chọn ID Pin --</option>
                  {availablePins.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.formRow}>
              <label>Khách Hàng</label>

              <input
                type="text"
                value={form.customer}
                readOnly
                placeholder="Tự động hiển thị"
              />
            </div>
          </div>

          <h4>Danh Sách Kiểm Tra</h4>

          <div className={styles.checklistGrid}>
            <label>
              <input
                type="checkbox"
                checked={form.checklist.physical}
                onChange={() => toggleChecklist("physical")}
              />
              {" "}
              Kiểm tra hư hỏng vật lý
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.checklist.connection}
                onChange={() => toggleChecklist("connection")}
              />
              {" "}
              Kiểm tra kết nối
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.checklist.temp}
                onChange={() => toggleChecklist("temp")}
              />
              {" "}
              Đọc nhiệt độ
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.checklist.voltage}
                onChange={() => toggleChecklist("voltage")}
              />
              {" "}
              Kiểm tra điện áp
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.checklist.capacity}
                onChange={() => toggleChecklist("capacity")}
              />
              {" "}
              Xác minh dung lượng
            </label>
          </div>

          {/!* Hàng 2: Model + Thời gian kiểm tra *!/}
          <div className={styles.twoColsRow}>
            <div className={styles.formRow}>
              <label>Model</label>

              <input
                className={styles.modelInput}
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="Nhập model..."
              />
            </div>

            <div className={styles.formRow}>
              <label>Thời gian kiểm tra</label>

              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={styles.datetimeInput}
              />
            </div>
          </div>

          <h4>Thông số kiểm tra (bắt buộc)</h4>

          <div className={styles.formGrid}>
            <div className={styles.formRow}>
              <label>Sức Khỏe (SoH %)</label>
              <input
                type="number"
                value={form.soh}
                onChange={(e) => update("soh", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <label>Điện áp (V)</label>
              <input
                type="number"
                value={form.voltage}
                onChange={(e) => update("voltage", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <label>Số vòng</label>
              <input
                type="number"
                value={form.cycles}
                onChange={(e) => update("cycles", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <label>Nhiệt độ (°C)</label>
              <input
                type="number"
                value={form.temp}
                onChange={(e) => update("temp", e.target.value)}
              />
            </div>
          </div>

          <h4>Ghi chú kiểm tra</h4>

          <textarea
            placeholder="Bất kỳ vấn đề hoặc quan sát nào..."
            value={form.report}
            onChange={(e) => update("report", e.target.value)}
          />

          {errors.length > 0 && (
            <div className={styles.formErrors}>
              <strong>Lỗi:</strong>
              <ul>
                {errors.map((er, i) => (
                  <li key={i}>{er}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className={styles.primaryBtn}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <FontAwesomeIcon icon={faCheck} />
            {" "}
            Hoàn thành & ghi nhận
          </button>
        </div>
      </div>
    </div>
  );
}

/!* ---------- Filter Modal (có nút Xóa lọc) ---------- *!/
function FilterModal({ current, onClose, onApply }) {
  const STATUS_OPTIONS = ["đầy", "đang sạc", "bảo trì"];

  const [local, setLocal] = useState(current);

  useEffect(() => setLocal(current), [current]);

  function toggleStatus(s) {
    setLocal((l) => ({
      ...l,
      status: l.status.includes(s)
        ? l.status.filter((x) => x !== s)
        : [...l.status, s],
    }));
  }

  function updatePrefix(v) {
    setLocal((l) => ({
      ...l,
      slotPrefix: (v || "").toUpperCase().trim(),
    }));
  }

  function updateMinSoH(v) {
    setLocal((l) => ({
      ...l,
      minSoH: v === "" ? null : Number(v),
    }));
  }

  const prefixValid =
    local.slotPrefix === "" || /^[A-Z]$/.test(local.slotPrefix);

  const minSoHValid =
    local.minSoH == null || (local.minSoH >= 0 && local.minSoH <= 100);

  const canApply = prefixValid && minSoHValid;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Lọc Kho Pin</h3>

          <button
            className={styles.iconBtn}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h4>Trạng thái</h4>

          <div className={styles.checkboxRow}>
            {STATUS_OPTIONS.map((val) => (
              <label key={val}>
                <input
                  type="checkbox"
                  checked={local.status.includes(val)}
                  onChange={() => toggleStatus(val)}
                />
                {" "}
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </label>
            ))}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.formRow}>
              <label>Vị trí Slot bắt đầu (ví dụ: A)</label>

              <input
                value={local.slotPrefix}
                onChange={(e) => updatePrefix(e.target.value)}
                placeholder="A"
              />

              {!prefixValid && (
                <small className={styles.inputError}>
                  Chỉ 1 chữ cái (A–Z)
                </small>
              )}
            </div>

            <div className={styles.formRow}>
              <label>Min SoH (%)</label>

              <input
                type="number"
                value={local.minSoH ?? ""}
                onChange={(e) => updateMinSoH(e.target.value)}
                placeholder="Ví dụ: 85"
              />

              {!minSoHValid && (
                <small className={styles.inputError}>
                  Giá trị 0–100
                </small>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.ghostBtn}
            onClick={() => onApply(EMPTY_FILTERS)}
          >
            Xóa lọc
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className={styles.primaryBtn}
            onClick={() => canApply && onApply(local)}
            disabled={!canApply}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
*/