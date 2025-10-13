import { useState } from "react";
import styles from "./Support.module.css";
import Button from "../../../components/Shares/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faCircleExclamation, faShield, faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

function Support() {
    const [openReport, setOpenReport] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false)

    const [report, setReport] = useState({
        Ma_Bao_Cao: "BC-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-4),
        Tieu_De: "",
        Noi_Dung: "",
        Loai_bao_cao: [],
        Trang_Thai_Xu_Ly: "Mới",
        Phan_Hoi: "",
    });

    // checklist giống ảnh 2 (đổi tên chút cho hợp “báo cáo”)
    const checklist = [
        "Kiểm tra hư hỏng vật lý",
        "Kiểm tra kết nối",
        "Đọc nhiệt độ",
        "Kiểm tra điện áp",
        "Xác minh dung lượng",
    ];

    const toggleType = (label) => {
        setReport((prev) => {
            const has = prev.Loai_bao_cao.includes(label);
            return {
                ...prev,
                Loai_bao_cao: has
                    ? prev.Loai_bao_cao.filter((x) => x !== label)
                    : [...prev.Loai_bao_cao, label],
            };
        });
    };

    const handleSubmit = () => {
        if (!report.Tieu_De.trim() || !report.Noi_Dung.trim()) return;
        console.log("SUBMIT BAOCAO", report); // thay bằng API thật của bạn
        setOpenReport(false);
        setReport({
            Ma_Bao_Cao: "BC-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-4),
            Tieu_De: "",
            Noi_Dung: "",
            Loai_bao_cao: [],
            Trang_Thai_Xu_Ly: "Mới",
            Phan_Hoi: "",
        });
    };

    return (
        <nav className={styles.wrapper}>
            <div className={styles.contactsupport}>
                <div className={styles.header}>
                    <h1>Liên Hệ Hỗ Trợ</h1>
                    <p>Nhận trợ giúp với trải nghiệm Vinnhot của bạn</p>
                </div>
                <div className={styles.button}>
                    <Button white blackoutline type="button">
                        <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                        Gọi Hỗ Trợ
                    </Button>
                    <Button white blackoutline type="button" onClick={() => setOpenReport(true)}>
                        <FontAwesomeIcon icon={faCircleExclamation} className={styles.icon} />
                        Báo Lỗi
                    </Button>
                </div>
            </div>

            <div className={styles.security}>
                <div className={styles.header}>
                    <h1>An Toàn & Bảo Mật</h1>
                    <p>Cài đặt bảo mật tài khoản</p>
                </div>
                <div className={styles.button}>
                    <Button white blackoutline type="button">
                        <FontAwesomeIcon icon={faShield} className={styles.icon} />
                        Xác Thực Hai Lần
                    </Button>
                    <Button white blackoutline type="button" onClick={() => setOpenChangePass(true)}>
                        <FontAwesomeIcon icon={faGear} className={styles.icon} />
                        Thay Mật Khẩu
                    </Button>
                </div>
            </div>

            {openChangePass && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h1>Đổi Mật Khẩu</h1>
                        <div className={styles.formchange}>
                            <label htmlFor="oldpass">Mật khẩu cũ</label>
                            <input
                                id="oldpass"
                                type="password"
                                placeholder="123"
                            />
                        </div>
                        <div className={styles.formchange}>
                            <label htmlFor="newpass">Mật khẩu mới</label>
                            <input
                                id="newpass"
                                type="password"
                                placeholder="123"
                            />
                        </div>
                        <div className={styles.formchange}>
                            <label htmlFor="confirmpass">Xác nhận mật khẩu</label>
                            <input
                                id="confirmpass"
                                type="password"
                                placeholder="123"
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button change type="button">Lưu</Button>
                            <Button white blackoutline type="button" onClick={() => setOpenChangePass(false)}>Hủy</Button>
                        </div>
                    </div>
                </div>
            )}

            {openReport && (
                <div className={styles.modalOverlay} onClick={() => setOpenReport(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHead}>
                            <div>
                                <h2>Gửi Báo Cáo</h2>
                                <p>Kiểm tra và ghi nhận vấn đề để chúng tôi xử lý.</p>
                            </div>
                            <button
                                className={styles.iconClose}
                                type="button"
                                aria-label="Đóng"
                                onClick={() => setOpenReport(false)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {/* meta 2 cột */}
                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Mã Báo Cáo</span>
                                <span className={styles.metaValue}>{report.Ma_Bao_Cao}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Trạng Thái</span>
                                <span className={styles.metaValue}>{report.Trang_Thai_Xu_Ly}</span>
                            </div>
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="title">Tiêu Đề</label>
                            <input
                                id="title"
                                type="text"
                                value={report.Tieu_De}
                                onChange={(e) => setReport((r) => ({ ...r, Tieu_De: e.target.value }))}
                                placeholder="VD: Lỗi không nhận thông báo"
                            />
                        </div>

                        <div className={styles.checklistBlock}>
                            <div className={styles.checklistTitle}>Danh Sách Kiểm Tra</div>
                            <div className={styles.checklistGrid}>
                                {checklist.map((item) => (
                                    <label key={item} className={styles.checkboxRow}>
                                        <input
                                            type="checkbox"
                                            checked={report.Loai_bao_cao.includes(item)}
                                            onChange={() => toggleType(item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="content">Nội Dung</label>
                            <textarea
                                id="content"
                                rows={4}
                                value={report.Noi_Dung}
                                onChange={(e) => setReport((r) => ({ ...r, Noi_Dung: e.target.value }))}
                                placeholder="Mô tả chi tiết vấn đề..."
                            />
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="feedback">Ghi Chú Kiểm Tra</label>
                            <textarea
                                id="feedback"
                                rows={3}
                                value={report.Phan_Hoi}
                                onChange={(e) => setReport((r) => ({ ...r, Phan_Hoi: e.target.value }))}
                                placeholder="Bất kỳ vấn đề hoặc quan sát nào..."
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <Button white blackoutline type="button" onClick={() => setOpenReport(false)}>
                                Hủy
                            </Button>
                            <Button change type="button" onClick={handleSubmit}>
                                Hoàn Thành Kiểm Tra
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Support;
