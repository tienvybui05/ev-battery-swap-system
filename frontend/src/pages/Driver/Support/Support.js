import { useState } from "react";
import styles from "./Support.module.css";
import Button from "../../../components/Shares/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhone,
    faCircleExclamation,
    faGear,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

function Support() {
    const [openReport, setOpenReport] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false);

    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loadingChange, setLoadingChange] = useState(false);

    // ================= ĐỔI MẬT KHẨU =================
    const handleChangePassword = async () => {
        if (!newPass.trim() || !confirmPass.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPass !== confirmPass) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        setLoadingChange(true);

        const resUser = await fetch(`/api/user-service/taixe/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = await resUser.json();

        const payload = {
            hoTen: user.hoTen || user.nguoiDung?.hoTen,
            email: user.email || user.nguoiDung?.email,
            soDienThoai: user.soDienThoai || user.nguoiDung?.soDienThoai,
            gioiTinh: user.gioiTinh || user.nguoiDung?.gioiTinh,
            ngaySinh: (user.ngaySinh || user.nguoiDung?.ngaySinh)?.substring(0, 10),
            bangLaiXe: user.bangLaiXe,
            matKhau: newPass
        };

        const res = await fetch(`/api/user-service/taixe/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const msg = await res.text();
        setLoadingChange(false);

        if (res.ok) {
            alert("Đổi mật khẩu thành công!");
            setOpenChangePass(false);
            setNewPass("");
            setConfirmPass("");
        } else {
            alert("Đổi mật khẩu thất bại!\n" + msg);
        }
    };

    // ================= GỬI BÁO LỖI (KHÔNG DÙNG STATE) =================
    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const tieuDe = document.getElementById("tieuDe").value;
        const noiDung = document.getElementById("noiDung").value;

        if (!userId) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        if (!tieuDe.trim() || !noiDung.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const payload = {
            maTaiXe: Number(userId),
            tieuDe,
            noiDung
        };

        console.log("Payload gửi đi:", payload);

        try {
            const res = await fetch("/api/feedback-service/baocao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Gửi báo cáo thành công!");
                setOpenReport(false);
                document.getElementById("tieuDe").value = "";
                document.getElementById("noiDung").value = "";
            } else {
                const err = await res.text();
                alert("Gửi thất bại: " + err);
            }
        } catch (err) {
            alert("Lỗi kết nối server!");
            console.error(err);
        }
    };

    return (
        <nav className={styles.wrapper}>
            {/* ================= LIÊN HỆ HỖ TRỢ ================= */}
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

                    <Button
                        white
                        blackoutline
                        type="button"
                        onClick={() => setOpenReport(true)}
                    >
                        <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className={styles.icon}
                        />
                        Báo Lỗi
                    </Button>
                </div>
            </div>

            {/* ================= BẢO MẬT ================= */}
            <div className={styles.security}>
                <div className={styles.header}>
                    <h1>An Toàn & Bảo Mật</h1>
                    <p>Cài đặt bảo mật tài khoản</p>
                </div>

                <div className={styles.button}>
                    <Button
                        white
                        blackoutline
                        type="button"
                        onClick={() => setOpenChangePass(true)}
                    >
                        <FontAwesomeIcon icon={faGear} className={styles.icon} />
                        Thay Mật Khẩu
                    </Button>
                </div>
            </div>

            {/* ================= MODAL ĐỔI MẬT KHẨU ================= */}
            {openChangePass && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h1>Đổi Mật Khẩu</h1>

                        <div className={styles.formchange}>
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        <div className={styles.formchange}>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <Button
                                change
                                type="button"
                                onClick={handleChangePassword}
                                disabled={loadingChange}
                            >
                                {loadingChange ? "Đang lưu..." : "Lưu"}
                            </Button>
                            <Button
                                white
                                blackoutline
                                type="button"
                                onClick={() => setOpenChangePass(false)}
                            >
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL BÁO LỖI ================= */}
            {openReport && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setOpenReport(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHead}>
                            <div>
                                <h2>Gửi Báo Cáo</h2>
                                <p>Ghi nhận vấn đề để chúng tôi xử lý</p>
                            </div>

                            <button
                                className={styles.iconClose}
                                type="button"
                                onClick={() => setOpenReport(false)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className={styles.formdetail}>
                            <label>Tiêu Đề</label>
                            <input
                                id="tieuDe"
                                type="text"
                                placeholder="VD: Trạm 3 lỗi pin"
                            />
                        </div>

                        <div className={styles.formdetail}>
                            <label>Nội Dung</label>
                            <textarea
                                id="noiDung"
                                rows={4}
                                placeholder="Mô tả chi tiết vấn đề..."
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <Button
                                white
                                blackoutline
                                type="button"
                                onClick={() => setOpenReport(false)}
                            >
                                Hủy
                            </Button>
                            <Button change type="button" onClick={handleSubmit}>
                                Gửi Báo Cáo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Support;
