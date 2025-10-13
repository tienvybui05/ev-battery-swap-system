import React, { useEffect, useMemo, useState } from "react";
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

/**
 * Inventory page - single-file implementation with internal popups
 * - Updated per user's requests:
 *   1) Settings modal limited to "Sẵn sàng" (sets trạng thái theo level) and "Yêu cầu bảo dưỡng" (bảo trì)
 *   2) Progress bar + color logic improved; shows %Pin + icon
 *   3) Check modal reworked: nicer layout, checklist on top, validation/conditions
 *   4) Filter modal reworked: checklist on top, nicer layout, validation/conditions
 */

const initialSlots = [
  {
    id: "A1",
    title: "Slot A1",
    type: "TM3-75kWh",
    status: "đầy", // "đầy" | "đang sạc" | "bảo trì"
    soh: 95, // %
    voltage: 400, // V
    cycles: 1250,
    temp: 25,
    lastChange: "10 min ago",
    level: 0.95, // 0..1
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
    level: 0.88,
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

function Inventory() {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    status: [], // e.g. ["đang sạc", "đầy"]
    slotPrefix: "", // e.g. "A"
    minSoH: null,
  });

  // simulate real-time small updates on charging slots
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.status === "đang sạc") {
            const newLevel = Math.min(1, +(s.level + Math.random() * 0.01).toFixed(3));

            const newVoltage = Math.round(s.voltage + Math.random() * 1);
            return {
              ...s,
              level: newLevel,
          
              voltage: newVoltage,
              temp: s.temp + (Math.random() * 0.2 - 0.1),
            };
          }
          return s;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // helper: refresh single slot (simulate fetching latest values)
  function refreshSlot(slotId) {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;

        const newVoltage = s.voltage ? Math.round(s.voltage + (Math.random() * 6 - 3)) : s.voltage;
        const newTemp = Math.max(15, Math.round(s.temp + (Math.random() * 3 - 1)));
        const newLevel = Math.max(0, Math.min(1, +(s.level + (Math.random() * 0.03 - 0.01)).toFixed(3)));
        const newLog = { t: new Date().toISOString(), msg: "Refreshed readings" };
        // update status automatically if not maintenance
        let newStatus = s.status;
        if (s.status !== "bảo trì") {
          if (newLevel >= 0.85) newStatus = "đầy";
          else if (newLevel > 0) newStatus = "đang sạc";
        }
        return {
          ...s,
          voltage: newVoltage,
          temp: newTemp,
          level: newLevel,
          lastChange: "just now",
          status: newStatus,
          logs: [newLog, ...s.logs].slice(0, 30),
        };
      })
    );
  }

  // settings modal: open
  function openSettings(slot) {
    setSelectedSlot(slot);
    setShowSettings(true);
  }

  // apply status change from SettingsModal
  function applyStatusChange(slotId, action) {
    // action: "ready" | "maintenance"
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        if (action === "maintenance") {
          const log = { t: new Date().toISOString(), msg: "Requested maintenance" };
          return { ...s, status: "bảo trì", logs: [log, ...s.logs].slice(0, 30) };
        }
        // action === "ready": set to đầy nếu level>=0.85 else đang sạc
        if (action === "ready") {
          const newStatus = (s.level || 0) >= 0.85 ? "đầy" : "đang sạc";
          const log = { t: new Date().toISOString(), msg: "Marked ready" };
          return { ...s, status: newStatus, logs: [log, ...s.logs].slice(0, 30) };
        }
        return s;
      })
    );
    setShowSettings(false);
  }

  // logs modal
  function openLogs(slot) {
    setSelectedSlot(slot);
    setShowLogs(true);
  }

  // check-return modal (creates new pin record when finished)
  function openCheckModal(slot) {
    setSelectedSlot(slot);
    setShowCheckModal(true);
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
      logs: [{ t: new Date().toISOString(), msg: "Created from check" }],
      checks: [formData],
    };
    setSlots((prev) => [newSlot, ...prev]);
    setShowCheckModal(false);
  }

  // Filter handlers
  function applyFilter(newFilters) {
    setFilters(newFilters);
    setShowFilter(false);
  }

  const visibleSlots = useMemo(() => {
    return slots.filter((s) => {
      if (filters.status.length && !filters.status.includes(s.status)) return false;
      if (filters.slotPrefix && !s.id.startsWith(filters.slotPrefix)) return false;
      if (filters.minSoH != null && s.soh < filters.minSoH) return false;
      return true;
    });
  }, [slots, filters]);

  return (
    <div className={styles.inventoryPage}>
      <StatsHeader />

      <div className={styles.headerRow}>
        <h2>Kho Pin</h2>
        <div className={styles.headerButtons}>
          <button className={styles.filterBtn} onClick={() => setShowFilter(true)}>
            <FontAwesomeIcon icon={faFilter} /> Lọc
          </button>
          <button className={styles.primaryBtn} onClick={() => openCheckModal(null)}>
            <FontAwesomeIcon icon={faPlus} /> Kiểm tra
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
                <span className={styles.statusDot} style={{ background: colorForLevel(s.status, s.level) }} />
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
                <div className={styles.metricValue}>{s.cycles.toLocaleString()}</div>
              </div>
              <div>
                <div className={styles.metricLabel}>Nhiệt độ:</div>
                <div className={styles.metricValue}>{Math.round(s.temp)}°C</div>
              </div>
              <div>
                <div className={styles.metricLabel}>Thay Pin Cuối:</div>
                <div className={styles.metricValue}>{s.lastChange}</div>
              </div>
            </div>

            {/* progress bar with percent + icon */}
            <div className={styles.progressWrap}>
              <div className={styles.progressTopRow}>
                <div className={styles.batteryLabel}>
                  <FontAwesomeIcon icon={faBatteryHalf} className={styles.batteryIcon} />
                  <span className={styles.batteryText}>{Math.round((s.level || 0) * 100)}% Pin</span>
                </div>
                <div className={styles.levelNote}>
                  {s.status === "bảo trì" ? "Bảo trì" : s.level >= 0.85 ? "Đủ" : "Còn lại"}
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
                <FontAwesomeIcon icon={faRotateRight} /> <span className={styles.actionText}>Làm mới</span>
              </button>

              <button
                className={styles.action}
                onClick={() => openSettings(s)}
                title="Cài đặt"
              >
                <FontAwesomeIcon icon={faWrench} /> <span className={styles.actionText}>Cài đặt</span>
              </button>

              <button
                className={styles.action}
                onClick={() => openLogs(s)}
                title="Chi tiết / logs"
              >
                <FontAwesomeIcon icon={faFileLines} /> <span className={styles.actionText}>Chi tiết / logs</span>
              </button>
            </div>
          </div>
        ))}

        {visibleSlots.length === 0 && (
          <div className={styles.emptyState}>Không có slot nào phù hợp với bộ lọc.</div>
        )}
      </div>

      {/* modals */}
      {showSettings && selectedSlot && (
        <SettingsModal
          slot={selectedSlot}
          onClose={() => setShowSettings(false)}
          onApply={(action) => applyStatusChange(selectedSlot.id, action)}
        />
      )}

      {showLogs && selectedSlot && (
        <LogsModal slot={selectedSlot} onClose={() => setShowLogs(false)} />
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

/* ---------- Helper components (inside file) ---------- */

function colorForLevel(status, level) {
  // refined logic:
  // - nếu bảo trì -> đỏ
  // - nếu level >= 0.85 -> xanh
  // - nếu status === 'đang sạc' hoặc level < 0.85 -> vàng
  // fallback dark
  if (status === "bảo trì") return "#EF4444"; // red
  if ((level || 0) >= 0.85) return "#10B981"; // green
  if (status === "đang sạc" || (level || 0) < 0.85) return "#F59E0B"; // amber
  return "#111827";
}

/* Settings modal: simplified actions per request */
function SettingsModal({ slot, onClose, onApply }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Cài Đặt Slot: {slot.title}</h3>
          <button className={styles.iconBtn} onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <div className={styles.modalBody}>
          <p>
            Với pin, trạng thái sạc thường được xác định từ mức pin. Bạn có thể:
          </p>

          <div className={styles.settingsActions}>
            <div className={styles.settingsCard}>
              <h4>Sẵn sàng</h4>
              <p>Đánh dấu pin là sẵn sàng. Hệ thống sẽ tự chuyển thành <strong>Đầy</strong> nếu mức pin ≥ 85%, ngược lại là <strong>Đang sạc</strong>.</p>
              <div className={styles.settingsRow}>
                <button className={styles.primaryBtn} onClick={() => onApply("ready")}>Sẵn sàng</button>
              </div>
            </div>

            <div className={styles.settingsCard}>
              <h4>Yêu cầu bảo dưỡng</h4>
              <p>Gửi yêu cầu bảo dưỡng — pin sẽ được đặt trạng thái <strong>Bảo trì</strong>.</p>
              <div className={styles.settingsRow}>
                <button className={styles.secondaryBtn} onClick={() => onApply("maintenance")}>Yêu cầu bảo dưỡng</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

/* Logs modal (kept mostly same but uses nicer headings) */
function LogsModal({ slot, onClose }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.modal} ${styles.large}`}>
        <div className={styles.modalHeader}>
          <h3>Chi tiết / Logs - {slot.title}</h3>
          <button className={styles.iconBtn} onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className={styles.modalBody}>
          <h4>Lịch sử</h4>
          <ul className={styles.logList}>
            {slot.logs.length ? slot.logs.map((l, idx) => <li key={idx}><strong>{l.t}</strong> — {l.msg}</li>) : <li>Không có lịch sử</li>}
          </ul>

          <h4>Nhật ký lỗi</h4>
          <p>Không có lỗi ghi nhận (demo)</p>

          <h4>Chi tiết chỉ số (mô phỏng)</h4>
          <p>SoH / Điện áp / Số vòng được lưu trong logs. Khi có backend, sẽ hiện biểu đồ thời gian.</p>

          <h4>Lịch sử kiểm tra</h4>
          <ul>
            {slot.checks && slot.checks.length ? slot.checks.map((c, i) => <li key={i}>{c.date || "—"}: {c.report || "Kiểm tra"}</li>) : <li>Chưa có kiểm tra</li>}
          </ul>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* Check modal (Kiểm tra và ghi nhận) - improved UI + fake API + date picker */
function CheckModal({ slot, onClose, onComplete }) {
  const [loadingPins, setLoadingPins] = useState(true);
  const [availablePins, setAvailablePins] = useState([]);

  // fake API mô phỏng danh sách pin trả về
  useEffect(() => {
    setTimeout(() => {
      setAvailablePins([
        { id: "BAT-2024-001", customer: "Alex Chen" },
        { id: "BAT-2024-002", customer: "Nguyễn Văn Huy" },
        { id: "BAT-2024-003", customer: "Lê Hoàng" },
      ]);
      setLoadingPins(false);
    }, 600);
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

  // khi chọn pin id => tự gán tên khách
  function handlePinSelect(id) {
    const found = availablePins.find((p) => p.id === id);
    setForm((f) => ({
      ...f,
      pinId: id,
      customer: found ? found.customer : "",
    }));
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleChecklist(key) {
    setForm((f) => ({
      ...f,
      checklist: { ...f.checklist, [key]: !f.checklist[key] },
    }));
  }

  // validation logic (giữ nguyên)
  const sohNum = form.soh === "" ? null : Number(form.soh);
  const voltageNum = form.voltage === "" ? null : Number(form.voltage);
  const cyclesNum = form.cycles === "" ? null : Number(form.cycles);
  const tempNum = form.temp === "" ? null : Number(form.temp);

  const errors = [];
  if (sohNum == null || Number.isNaN(sohNum) || sohNum < 0 || sohNum > 100)
    errors.push("SoH phải là số từ 0 đến 100");
  if (voltageNum == null || Number.isNaN(voltageNum) || voltageNum < 0)
    errors.push("Điện áp phải là số dương");
  if (cyclesNum == null || Number.isNaN(cyclesNum) || cyclesNum < 0)
    errors.push("Số vòng phải là số >= 0");
  if (tempNum == null || Number.isNaN(tempNum) || tempNum < -20 || tempNum > 120)
    errors.push("Nhiệt độ bất thường (phải hợp lý)");

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
          <button className={styles.iconBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p style={{ color: "#6b7280", marginBottom: "10px" }}>
            Kiểm tra pin trả về cho bất kỳ hư hỏng hoặc vấn đề nào trước khi lưu kho.
          </p>

          {/* Dropdown chọn pin */}
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
            <input type="text" value={form.customer} readOnly placeholder="Tự động hiển thị" />
          </div>

          <h4>Danh Sách Kiểm Tra</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 16px",
              background: "#f9fafb",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              marginBottom: "16px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={form.checklist.physical}
                onChange={() => toggleChecklist("physical")}
              />{" "}
              Kiểm tra hư hỏng vật lý
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.checklist.connection}
                onChange={() => toggleChecklist("connection")}
              />{" "}
              Kiểm tra kết nối
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.checklist.temp}
                onChange={() => toggleChecklist("temp")}
              />{" "}
              Đọc nhiệt độ
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.checklist.voltage}
                onChange={() => toggleChecklist("voltage")}
              />{" "}
              Kiểm tra điện áp
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.checklist.capacity}
                onChange={() => toggleChecklist("capacity")}
              />{" "}
              Xác minh dung lượng
            </label>
          </div>

          <div className={styles.twoCols}>
            <div>
              <p>
                <strong>Model:</strong>{" "}
                <input
                  className={styles.modelInput}
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="Nhập model..."
                />
              </p>
            </div>
            <div>
              <label>Thời gian kiểm tra</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
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
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Hủy
          </button>
          <button
            className={styles.primaryBtn}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <FontAwesomeIcon icon={faCheck} /> Hoàn thành & ghi nhận
          </button>
        </div>
      </div>
    </div>
  );
}


/* Filter modal - improved UI + validation */
function FilterModal({ current, onClose, onApply }) {
  const [local, setLocal] = useState(current);

  useEffect(() => setLocal(current), [current]);

  function toggleStatus(s) {
    setLocal((l) => {
      const next = l.status.includes(s) ? l.status.filter((x) => x !== s) : [...l.status, s];
      return { ...l, status: next };
    });
  }

  function updatePrefix(val) {
    const v = (val || "").toUpperCase().trim();
    setLocal((l) => ({ ...l, slotPrefix: v }));
  }

  function updateMinSoH(v) {
    const n = v === "" ? null : Number(v);
    setLocal((l) => ({ ...l, minSoH: n }));
  }

  const prefixValid = local.slotPrefix === "" || /^[A-Z]$/.test(local.slotPrefix);
  const minSoHValid = local.minSoH == null || (local.minSoH >= 0 && local.minSoH <= 100);

  const canApply = prefixValid && minSoHValid;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Lọc Kho Pin</h3>
          <button className={styles.iconBtn} onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <div className={styles.modalBody}>
          <h4>Trạng thái</h4>
          <div className={styles.checkboxRow}>
            {["    Đầy     ", "    Đang sạc   ", "    Bảo trì    "].map((s) => (
              <label key={s}><input type="checkbox" checked={local.status.includes(s)} onChange={() => toggleStatus(s)} /> {s}</label>
            ))}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.formRow}>
              <label>Vị trí Slot bắt đầu (ví dụ: A)</label>
              <input value={local.slotPrefix} onChange={(e) => updatePrefix(e.target.value)} placeholder="A" />
              {!prefixValid && <small className={styles.inputError}>Chỉ 1 chữ cái (A-Z)</small>}
            </div>

            <div className={styles.formRow}>
              <label>Min SoH (%)</label>
              <input type="number" value={local.minSoH ?? ""} onChange={(e) => updateMinSoH(e.target.value)} placeholder="Ví dụ: 70" />
              {!minSoHValid && <small className={styles.inputError}>Giá trị 0–100</small>}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Hủy</button>
          <button className={styles.primaryBtn} onClick={() => canApply && onApply(local)} disabled={!canApply}>Áp dụng</button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
