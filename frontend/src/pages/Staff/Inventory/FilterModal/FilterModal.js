import React, { useEffect, useState } from "react";
import styles from "./FilterModal.module.css";

export default function FilterModal({ current, onClose, onApply }) {
    const [local, setLocal] = useState(current);
    const [models, setModels] = useState([]);

    useEffect(() => {
        setLocal(current);
    }, [current]);

    // --- Fetch tất cả pin rồi lọc loại pin duy nhất ---
    const fetchModels = async () => {
        try {
            const res = await fetch("/api/battery-service/pins");
            if (!res.ok) throw new Error("Không thể tải danh sách pin");
            const data = await res.json();

            // Lấy danh sách model pin duy nhất
            const uniqueModels = [
                ...new Set(
                    data.map((p) => p.loaiPin ?? p.loai_pin).filter(Boolean)
                ),
            ];
            setModels(uniqueModels);
        } catch (err) {
            console.error("⚠️ Lỗi tải model pin:", err);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    // --- Toggle trạng thái ---
    function toggleStatus(s) {
        setLocal((l) => {
            const next = l.status.includes(s)
                ? l.status.filter((x) => x !== s)
                : [...l.status, s];
            return { ...l, status: next };
        });
    }

    function updateModel(v) {
        setLocal((l) => ({ ...l, model: v }));
    }

    function updateMinCap(v) {
        setLocal((l) => ({ ...l, minCap: v === "" ? null : Number(v) }));
    }

    function updateMaxCap(v) {
        setLocal((l) => ({ ...l, maxCap: v === "" ? null : Number(v) }));
    }

    const capValid =
        (local.minCap == null || local.minCap >= 0) &&
        (local.maxCap == null || local.maxCap >= 0) &&
        (local.minCap == null ||
            local.maxCap == null ||
            local.maxCap >= local.minCap);

    const canApply = capValid;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains(styles.overlay)) onClose();
    };

    function resetFilters() {
        onApply({
            status: [],
            model: "",
            minCap: null,
            maxCap: null,
        });
    }

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Bộ lọc Pin</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <h4>Tình trạng Pin</h4>
                    <div className={styles.checkboxRow}>
                        {["sẵn sàng", "đang sạc", "đang được sử dụng", "bảo trì"].map(
                            (s) => (
                                <label key={s}>
                                    <input
                                        type="checkbox"
                                        checked={local.status.includes(s)}
                                        onChange={() => toggleStatus(s)}
                                    />
                                    {` ${s.charAt(0).toUpperCase() + s.slice(1)}`}
                                </label>
                            )
                        )}
                    </div>

                    {/* Dropdown model pin tự động */}
                    <div className={styles.formRow}>
                        <label>Model Pin</label>
                        <select
                            value={local.model}
                            onChange={(e) => updateModel(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            {models.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h4>Dung lượng (kWh)</h4>
                    <div className={styles.filterRow}>
                        <div className={styles.formRow}>
                            <label>Tối thiểu</label>
                            <input
                                type="number"
                                value={local.minCap ?? ""}
                                onChange={(e) => updateMinCap(e.target.value)}
                                placeholder="VD: 4.5"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Tối đa</label>
                            <input
                                type="number"
                                value={local.maxCap ?? ""}
                                onChange={(e) => updateMaxCap(e.target.value)}
                                placeholder="VD: 7.5"
                            />
                        </div>
                    </div>

                    {!capValid && (
                        <small className={styles.inputError}>
                            ⚠️ Giá trị không hợp lệ (Tối đa ≥ Tối thiểu và ≥ 0)
                        </small>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.ghostBtn} onClick={resetFilters}>
                        Xóa lọc
                    </button>
                    <button className={styles.secondaryBtn} onClick={onClose}>
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
