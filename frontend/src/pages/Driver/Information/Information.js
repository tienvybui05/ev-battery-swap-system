import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Shares/Button/Button";
import styles from "./Information.module.css";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function Information() {
    const [isOpenAdd, setIsOpenAdd] = useState(false);        // popup thêm mới
    const [isOpenEdit, setIsOpenEdit] = useState(false);      // popup chỉnh sửa
    const [newCar, setNewCar] = useState({ name: "", vin: "", style: "" });
    const [selectedCar, setSelectedCar] = useState(null);      // xe đang sửa

    const userInfo = {
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0912345678",
    };

    // Đưa carList vào state để có thể cập nhật sau khi thêm/sửa
    const [carList, setCarList] = useState([
        { id: 1, name: "VinFast VF5", vin: "VNFAST0012345", style: "Pin 37.23 kWh" },
        { id: 2, name: "Honda City EV", vin: "HDCITYEV9087", style: "Pin 50 kWh" },
        { id: 3, name: "Tesla Model 3", vin: "TESLAEV4321", style: "Pin 57.5 kWh" },
    ]);

    // Mở popup thêm
    const openAdd = () => {
        setNewCar({ name: "", vin: "", style: "" });
        setIsOpenAdd(true);
    };

    // Lưu xe mới
    const handleSaveNew = () => {
        if (!newCar.name.trim() || !newCar.vin.trim()) return;
        const next = {
            id: Date.now(), // id tạm
            name: newCar.name.trim(),
            vin: newCar.vin.trim(),
            style: newCar.style.trim(),
        };
        setCarList((prev) => [next, ...prev]);
        setIsOpenAdd(false);
    };

    // Mở popup edit với dữ liệu sẵn
    const openEdit = (car) => {
        setSelectedCar({ ...car }); // copy để chỉnh sửa local
        setIsOpenEdit(true);
    };

    // Lưu xe đã chỉnh sửa
    const handleSaveEdit = () => {
        if (!selectedCar || !selectedCar.name.trim() || !selectedCar.vin.trim()) return;
        setCarList((prev) =>
            prev.map((c) => (c.id === selectedCar.id ? { ...selectedCar, name: selectedCar.name.trim(), vin: selectedCar.vin.trim(), style: selectedCar.style?.trim() || "" } : c))
        );
        setIsOpenEdit(false);
    };

    return (
        <nav className={styles.wrapper}>
            <div className={styles.userdatail}>
                <div className={styles.header}>
                    <h1>Thông Tin Hồ Sơ</h1>
                </div>
                <form className={styles.form}>
                    <div className={styles.formdetail}>
                        <label htmlFor="name">Tên Đầy Đủ</label>
                        <input id="name" type="text" defaultValue={userInfo.fullName} />
                    </div>
                    <div className={styles.formdetail}>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="text" defaultValue={userInfo.email} />
                    </div>
                    <div className={styles.formdetail}>
                        <label htmlFor="phone">Số Điện Thoại</label>
                        <input id="phone" type="text" defaultValue={userInfo.phone} />
                    </div>
                    <Button change type="button">Lưu Thay Đổi</Button>
                </form>
            </div>

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