import React, { useEffect, useMemo, useState } from "react";
import styles from "./CheckModal.module.css";

export default function CheckModal({ open, onClose, onDone }) {
    const [loading, setLoading] = useState(true);
    const [pins, setPins] = useState([]);
    const [stations, setStations] = useState([]);
    const [oldHealth, setOldHealth] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [form, setForm] = useState({
        maPin: "",
        loaiPin: "",
        dungLuong: "",
        newTinhTrang: "đang sạc",
        newSucKhoe: "",
        maTram: "",
    });

    const token = localStorage.getItem("token");

    // 🔹 Load dữ liệu Pin & Trạm
    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoading(true);
                const [pinsRes, tramRes] = await Promise.all([
                    fetch("/api/battery-service/pins", {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                    fetch("/api/station-service/tram", {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }),
                ]);

                const pinsData = pinsRes.ok ? await pinsRes.json() : [];
                const tramData = tramRes.ok ? await tramRes.json() : [];

                setPins(pinsData);

                // Lọc trạm trùng tên
                const uniq = [];
                const seen = new Set();
                tramData.forEach((t) => {
                    const name = (t.tenTram ?? t.ten_tram ?? "").trim();
                    if (name && !seen.has(name)) {
                        uniq.push(t);
                        seen.add(name);
                    }
                });
                setStations(uniq);
            } catch (err) {
                console.error("⚠️ Lỗi load dữ liệu:", err);
                setPins([]);
                setStations([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [open]);

    // 🔹 Lọc các pin “đang được sử dụng”
    const inUsePins = useMemo(() => {
        return pins.filter(
            (p) =>
                (p.tinhTrang ?? p.tinh_trang ?? "").toLowerCase().trim() ===
                "đang được sử dụng"
        );
    }, [pins]);

    // 🔹 Khi chọn pin → tự điền thông tin
    function handleSelectPin(id) {
        const p = pins.find((x) => Number(x.maPin ?? x.ma_pin) === Number(id));
        if (!p) return;
        setForm((f) => ({
            ...f,
            maPin: id,
            loaiPin: p?.loaiPin ?? p?.loai_pin ?? "",
            dungLuong: p?.dungLuong ?? p?.dung_luong ?? "",
        }));
        setOldHealth(Number(p?.sucKhoe ?? p?.suc_khoe ?? 100));
    }

    // 🔹 Cập nhật field form
    function update(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    // 🔹 Kiểm tra hợp lệ % sức khỏe
    const healthValue = Number(form.newSucKhoe);
    const invalidHealth =
        isNaN(healthValue) ||
        healthValue < 0 ||
        healthValue > 100 ||
        (oldHealth !== null && healthValue > oldHealth);

    // 🔹 Rule kiểm tra hợp lệ tổng thể
    const canSubmit =
        form.maPin &&
        form.maTram &&
        form.newTinhTrang &&
        form.newSucKhoe !== "" &&
        !invalidHealth;

    // 🔹 Khi nhấn “Xác nhận”
    async function handleSubmit() {
        try {
            const pinId = form.maPin;
            const pinUpdate = {
                loaiPin: form.loaiPin,
                dungLuong: form.dungLuong,
                tinhTrang: form.newTinhTrang,
                sucKhoe: Number(form.newSucKhoe),
            };

            const res1 = await fetch(`/api/battery-service/pins/${pinId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(pinUpdate),
            });
            if (!res1.ok) throw new Error("Cập nhật pin thất bại");

            const historyBody = {
                hanhDong: "Trả pin về trạm",
                maPin: Number(form.maPin),
                maTram: Number(form.maTram),
                ngayThayDoi: new Date().toISOString(),
            };

            const res2 = await fetch("/api/battery-service/lichsu-pin-tram", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(historyBody),
            });
            if (!res2.ok) throw new Error("Ghi lịch sử thất bại");

            // ✅ Hiển thị thông báo ngắn, auto đóng sau 1.5s
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onDone?.();
                onClose?.();
            }, 1500);
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi: " + err.message);
        }
    }

    if (!open) return null;

    return (
        <div
            className={styles.overlay}
            onClick={(e) =>
                e.target.classList.contains(styles.overlay) && onClose?.()
            }
        >
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Ghi nhận pin trả về trạm</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.body}>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <>
                            <div className={styles.twoCols}>
                                <div className={styles.formRow}>
                                    <label>Chọn pin (đang được sử dụng)</label>
                                    <select
                                        value={form.maPin}
                                        onChange={(e) => handleSelectPin(e.target.value)}
                                    >
                                        <option value="">-- Chọn --</option>
                                        {inUsePins.map((p) => {
                                            const id = p.maPin ?? p.ma_pin;
                                            return (
                                                <option key={id} value={id}>
                                                    {`Pin ${id} | ${p.loaiPin ?? p.loai_pin ?? ""} (${p.dungLuong ?? p.dung_luong ?? ""} kWh)`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className={styles.formRow}>
                                    <label>Chọn trạm</label>
                                    <select
                                        value={form.maTram}
                                        onChange={(e) => update("maTram", e.target.value)}
                                    >
                                        <option value="">-- Chọn --</option>
                                        {stations.map((t) => {
                                            const id = t.maTram ?? t.ma_tram;
                                            const name = t.tenTram ?? t.ten_tram ?? `Trạm ${id}`;
                                            return (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formRow}>
                                    <label>Model</label>
                                    <input value={form.loaiPin} readOnly />
                                </div>

                                <div className={styles.formRow}>
                                    <label>Dung lượng (kWh)</label>
                                    <input value={form.dungLuong} readOnly />
                                </div>

                                <div className={styles.formRow}>
                                    <label>% Sức khỏe (0–100)</label>
                                    <input
                                        type="number"
                                        value={form.newSucKhoe}
                                        onChange={(e) => update("newSucKhoe", e.target.value)}
                                        placeholder="VD: 88"
                                        min="0"
                                        max={oldHealth ?? 100}
                                        className={invalidHealth ? styles.inputError : ""}
                                    />
                                    {oldHealth !== null && (
                                        <small className={styles.note}>
                                            Sức khỏe không được vượt quá {oldHealth}%
                                        </small>
                                    )}
                                </div>

                                <div className={styles.formRow}>
                                    <label>Trạng thái mới</label>
                                    <select
                                        value={form.newTinhTrang}
                                        onChange={(e) => update("newTinhTrang", e.target.value)}
                                    >
                                        <option value="đang sạc">Đang sạc</option>
                                        <option value="bảo trì">Bảo trì</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.secondaryBtn} onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={handleSubmit}
                        disabled={!canSubmit || loading}
                    >
                        Xác nhận
                    </button>
                </div>

                {showSuccess && <div className={styles.toast}>✅ Cập nhật thành công!</div>}
            </div>
        </div>
    );
}
