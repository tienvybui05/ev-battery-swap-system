import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Shares/Button/Button";
import styles from "./Information.module.css";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// Hàm chuẩn hóa ngày sinh về yyyy-MM-dd
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    if (dateStr.includes('-')) {
        const [first, second, third] = dateStr.split('-');
        if (first.length === 4) return dateStr;
        return `${third}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
    }
    return dateStr;
};

function Information() {
    // ==== PHẦN THÔNG TIN NGƯỜI DÙNG ====
    const [userInfo, setUserInfo] = useState(null);
    const [editUserInfo, setEditUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }
        fetch(`/api/user-service/taixe/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUserInfo(data);
            setEditUserInfo({
                hoTen: data.hoTen || data.nguoiDung?.hoTen || "",
                email: data.email || data.nguoiDung?.email || "",
                soDienThoai: data.soDienThoai || data.nguoiDung?.soDienThoai || "",
                gioiTinh: data.gioiTinh || data.nguoiDung?.gioiTinh || "",
                ngaySinh: (data.ngaySinh || data.nguoiDung?.ngaySinh || "").substring(0, 10),
                bangLaiXe: data.bangLaiXe || "",
                matKhau: data.matKhau || "",
            });
            setLoading(false);
        });
    }, []);

    // Hàm Lưu thay đổi (PUT lên API)
    const handleSaveUser = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const payload = {
            hoTen: editUserInfo.hoTen,
            email: editUserInfo.email,
            soDienThoai: editUserInfo.soDienThoai,
            gioiTinh: editUserInfo.gioiTinh,
            matKhau: editUserInfo.matKhau || userInfo?.matKhau || "123456",
            ngaySinh: formatDate(editUserInfo.ngaySinh),
            bangLaiXe: editUserInfo.bangLaiXe
        };
        fetch(`/api/user-service/taixe/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            const msg = await res.text();
            if (res.ok) {
                alert("Cập nhật thành công!");
                setUserInfo(prev => ({ ...prev, ...payload }));
            } else {
                alert("Cập nhật thất bại!\n" + msg);
            }
        });
    };

    // ==== PHẦN XE (giữ nguyên) ====
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [newCar, setNewCar] = useState({ name: "", vin: "", style: "" });
    const [selectedCar, setSelectedCar] = useState(null);
    const [carList, setCarList] = useState([
        { id: 1, name: "VinFast VF5", vin: "VNFAST0012345", style: "Pin 37.23 kWh" },
        { id: 2, name: "Honda City EV", vin: "HDCITYEV9087", style: "Pin 50 kWh" },
        { id: 3, name: "Tesla Model 3", vin: "TESLAEV4321", style: "Pin 57.5 kWh" },
    ]);
    const openAdd = () => {
        setNewCar({ name: "", vin: "", style: "" });
        setIsOpenAdd(true);
    };
    const handleSaveNew = () => {
        if (!newCar.name.trim() || !newCar.vin.trim()) return;
        const next = {
            id: Date.now(),
            name: newCar.name.trim(),
            vin: newCar.vin.trim(),
            style: newCar.style.trim(),
        };
        setCarList((prev) => [next, ...prev]);
        setIsOpenAdd(false);
    };
    const openEdit = (car) => {
        setSelectedCar({ ...car });
        setIsOpenEdit(true);
    };
    const handleSaveEdit = () => {
        if (!selectedCar || !selectedCar.name.trim() || !selectedCar.vin.trim()) return;
        setCarList((prev) =>
            prev.map((c) => (c.id === selectedCar.id ? { ...selectedCar, name: selectedCar.name.trim(), vin: selectedCar.vin.trim(), style: selectedCar.style?.trim() || "" } : c))
        );
        setIsOpenEdit(false);
    };

    return (
        <nav className={styles.wrapper}>
            {/* ====== Thông tin hồ sơ tài xế ====== */}
            <div className={styles.userdatail}>
                <div className={styles.header}>
                    <h1>Thông Tin Hồ Sơ</h1>
                </div>
                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : (
                    <form className={styles.form} onSubmit={e => e.preventDefault()}>
                        <div className={styles.formdetail}>
                            <label htmlFor="hoTen">Tên Đầy Đủ</label>
                            <input
                                id="hoTen"
                                type="text"
                                value={editUserInfo?.hoTen || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, hoTen: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                value={editUserInfo?.email || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, email: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="soDienThoai">Số Điện Thoại</label>
                            <input
                                id="soDienThoai"
                                type="text"
                                value={editUserInfo?.soDienThoai || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, soDienThoai: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="gioiTinh">Giới tính</label>
                            <select
                                id="gioiTinh"
                                value={editUserInfo?.gioiTinh || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, gioiTinh: e.target.value })}
                                className={styles.input} // dùng class input để CSS đồng bộ
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="ngaySinh">Ngày sinh</label>
                            <input
                                id="ngaySinh"
                                type="date"
                                value={editUserInfo?.ngaySinh || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, ngaySinh: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="bangLaiXe">Bằng lái xe</label>
                            <input
                                id="bangLaiXe"
                                type="text"
                                value={editUserInfo?.bangLaiXe || ""}
                                onChange={e => setEditUserInfo({ ...editUserInfo, bangLaiXe: e.target.value })}
                            />
                        </div>
                        <Button change type="button" onClick={handleSaveUser}>Lưu Thay Đổi</Button>
                    </form>
                )}
            </div>

            {/* ====== Phần xe (giữ nguyên) ====== */}
            <div className={styles.cardetail}>
                <div className={styles.header}>
                    <h1>Xe Của Tôi</h1>
                    <p>Quản lý xe đã đăng ký</p>
                </div>
                {carList.map((car) => (
                    <div key={car.id} className={styles.carname}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faCarSide} className={styles.faCarSide} />
                            <div className={styles.namevin}>
                                <p className={styles.name}>{car.name}</p>
                                <p className={styles.vin}>{car.vin}</p>
                                {car.style ? <p className={styles.vin}>Loại pin: {car.style}</p> : null}
                            </div>
                        </div>
                        <Button
                            icon
                            aria-label={`Chỉnh sửa ${car.name}`}
                            type="button"
                            onClick={() => openEdit(car)}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} />
                        </Button>
                    </div>
                ))}
                <Button white outline type="button" onClick={openAdd}>
                    Thêm xe
                </Button>
            </div>

            {/* Modal Thêm xe */}
            {isOpenAdd && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Thêm Xe Mới</h2>
                        <div className={styles.formdetail}>
                            <label htmlFor="carName">Tên xe</label>
                            <input
                                id="carName"
                                type="text"
                                value={newCar.name}
                                onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                                placeholder="VD: VinFast VF8"
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="vin">Mã VIN</label>
                            <input
                                id="vin"
                                type="text"
                                value={newCar.vin}
                                onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
                                placeholder="VD: VNFAST998877"
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="style">Loại pin</label>
                            <input
                                id="style"
                                type="text"
                                value={newCar.style}
                                onChange={(e) => setNewCar({ ...newCar, style: e.target.value })}
                                placeholder="VD: 50 kWh"
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button change type="button" onClick={handleSaveNew}>Lưu</Button>
                            <Button white blackoutline type="button" onClick={() => setIsOpenAdd(false)}>Hủy</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sửa xe */}
            {isOpenEdit && selectedCar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Chỉnh Sửa Xe</h2>
                        <div className={styles.formdetail}>
                            <label htmlFor="editCarName">Tên xe</label>
                            <input
                                id="editCarName"
                                type="text"
                                value={selectedCar.name}
                                onChange={(e) => setSelectedCar({ ...selectedCar, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="editVin">Mã VIN</label>
                            <input
                                id="editVin"
                                type="text"
                                value={selectedCar.vin}
                                onChange={(e) => setSelectedCar({ ...selectedCar, vin: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="editStyle">Loại pin</label>
                            <input
                                id="editStyle"
                                type="text"
                                value={selectedCar.style || ""}
                                onChange={(e) => setSelectedCar({ ...selectedCar, style: e.target.value })}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button change type="button" onClick={handleSaveEdit}>Lưu</Button>
                            <Button white blackoutline type="button" onClick={() => setIsOpenEdit(false)}>Hủy</Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Information;
