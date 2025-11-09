// components/CarManagement/CarManagement.js
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Shares/Button/Button";
import styles from "./CarManagement.module.css";
import { faCarSide, faBatteryFull, faPenToSquare, faRotate } from "@fortawesome/free-solid-svg-icons";

// Danh sách loại pin mẫu với thông tin tự động điền
const PIN_TYPES = {
    "Lithium-ion 50kWh": {
        loaiPin: "Lithium-ion",
        dungLuong: 50.0
    },
    "Lithium-ion 75kWh": {
        loaiPin: "Lithium-ion", 
        dungLuong: 75.0
    },
    "LFP 60kWh": {
        loaiPin: "LFP (Lithium Iron Phosphate)",
        dungLuong: 60.0
    },
    "LFP 80kWh": {
        loaiPin: "LFP (Lithium Iron Phosphate)",
        dungLuong: 80.0
    },
    "NMC 70kWh": {
        loaiPin: "NMC (Nickel Manganese Cobalt)",
        dungLuong: 70.0
    },
    "NMC 90kWh": {
        loaiPin: "NMC (Nickel Manganese Cobalt)",
        dungLuong: 90.0
    },
    "Solid-state 100kWh": {
        loaiPin: "Solid-state",
        dungLuong: 100.0
    }
};

function CarManagement() {
    // ==== PHẦN XE - KẾT NỐI BACKEND ====
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);
    const [isOpenPinManagement, setIsOpenPinManagement] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [selectedCarForPin, setSelectedCarForPin] = useState(null);
    const [availablePins, setAvailablePins] = useState([]);
    const [newCar, setNewCar] = useState({ 
        vin: "", 
        bienSo: "", 
        loaiXe: "",
        selectedPinType: "", // Loại pin được chọn từ dropdown
        loaiPin: "", // Tự động điền
        dungLuongPin: "", // Tự động điền
        sucKhoePin: "100" // Người dùng nhập
    });
    const [selectedCar, setSelectedCar] = useState(null);
    const [carList, setCarList] = useState([]);
    const [loadingCars, setLoadingCars] = useState(true);
    const [loadingPins, setLoadingPins] = useState(false);
    const [creatingPin, setCreatingPin] = useState(false);

    // Load danh sách xe từ backend khi component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            loadCarList(userId, token);
        }
    }, []);

    // Load danh sách xe từ backend
    const loadCarList = (userId, token) => {
        setLoadingCars(true);
        fetch(`/api/vehicle-service/vehicles/by-driver/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Lỗi tải danh sách xe');
            return res.json();
        })
        .then(data => {
            setCarList(data);
            setLoadingCars(false);
        })
        .catch(error => {
            console.error('Lỗi tải xe:', error);
            setLoadingCars(false);
        });
    };

    // Load danh sách pin có sẵn từ battery service
    const loadAvailablePins = () => {
        const token = localStorage.getItem('token');
        setLoadingPins(true);
        
        fetch('/api/battery-service/pins', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Lỗi tải danh sách pin');
            return res.json();
        })
        .then(data => {
            const readyPins = data.filter(pin => 
                pin.trangThaiSoHuu === 'SAN_SANG'
            );
            setAvailablePins(readyPins);
            setLoadingPins(false);
        })
        .catch(error => {
            console.error('Lỗi tải pin:', error);
            setAvailablePins([]);
            setLoadingPins(false);
        });
    };

    // ==== CÁC HÀM XỬ LÝ XE & PIN ====
    const openAdd = () => {
        setNewCar({ 
            vin: "", 
            bienSo: "", 
            loaiXe: "",
            selectedPinType: "",
            loaiPin: "",
            dungLuongPin: "",
            sucKhoePin: "100"
        });
        setIsOpenAdd(true);
    };

    // Xử lý khi chọn loại pin
    const handlePinTypeChange = (selectedType) => {
        if (selectedType && PIN_TYPES[selectedType]) {
            const pinInfo = PIN_TYPES[selectedType];
            setNewCar(prev => ({
                ...prev,
                selectedPinType: selectedType,
                loaiPin: pinInfo.loaiPin,
                dungLuongPin: pinInfo.dungLuong.toString()
            }));
        } else {
            setNewCar(prev => ({
                ...prev,
                selectedPinType: selectedType,
                loaiPin: "",
                dungLuongPin: ""
            }));
        }
    };

    // Tạo pin mới cho xe
    const createNewPinForCar = async (token, carInfo) => {
        const pinPayload = {
            loaiPin: carInfo.loaiPin,
            dungLuong: carInfo.dungLuongPin ? parseFloat(carInfo.dungLuongPin) : 0,
            tinhTrang: "DAY",
            trangThaiSoHuu: "DANG_SU_DUNG",
            sucKhoe: carInfo.sucKhoePin ? parseFloat(carInfo.sucKhoePin) : 100,
            ngayNhapKho: new Date().toISOString().split('T')[0],
            ngayBaoDuongGanNhat: new Date().toISOString().split('T')[0]
        };

        const response = await fetch('/api/battery-service/pins', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(pinPayload)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Tạo pin thất bại: ${error}`);
        }

        return await response.json();
    };

    const handleSaveNew = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!newCar.vin.trim() || !newCar.bienSo.trim() || !newCar.loaiXe.trim()) {
            alert("Vui lòng điền đầy đủ thông tin xe!");
            return;
        }

        if (!newCar.selectedPinType) {
            alert("Vui lòng chọn loại pin!");
            return;
        }

        if (!newCar.sucKhoePin || newCar.sucKhoePin < 0 || newCar.sucKhoePin > 100) {
            alert("Vui lòng nhập sức khỏe pin từ 0-100%!");
            return;
        }

        setCreatingPin(true);

        try {
            // 1. Tạo pin mới trước
            const newPin = await createNewPinForCar(token, newCar);
            
            // 2. Tạo xe với mã pin vừa tạo
            const carPayload = {
                vin: newCar.vin.trim(),
                bienSo: newCar.bienSo.trim(),
                loaiXe: newCar.loaiXe.trim(),
                maTaiXe: parseInt(userId),
                maPin: newPin.maPin
            };

            const carResponse = await fetch('/api/vehicle-service/vehicles', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(carPayload)
            });

            if (carResponse.ok) {
                const savedCar = await carResponse.json();
                alert(`Thêm xe thành công! Đã tạo pin #${newPin.maPin} cho xe.`);
                setCarList(prev => [savedCar, ...prev]);
                setIsOpenAdd(false);
            } else {
                const error = await carResponse.text();
                
                // Nếu tạo xe thất bại, xóa pin vừa tạo
                await fetch(`/api/battery-service/pins/${newPin.maPin}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                alert("Thêm xe thất bại!\n" + error);
            }
        } catch (error) {
            console.error('Lỗi thêm xe và pin:', error);
            alert("Lỗi: " + error.message);
        } finally {
            setCreatingPin(false);
        }
    };

    // Mở modal chỉnh sửa xe
    const openEdit = (car) => {
        setSelectedCar({ ...car });
        setIsOpenEdit(true);
    };

    const handleSaveEdit = () => {
        const token = localStorage.getItem('token');
        
        if (!selectedCar || !selectedCar.vin.trim() || !selectedCar.bienSo.trim() || !selectedCar.loaiXe.trim()) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = {
            vin: selectedCar.vin.trim(),
            bienSo: selectedCar.bienSo.trim(),
            loaiXe: selectedCar.loaiXe.trim(),
            maTaiXe: selectedCar.maTaiXe
        };

        fetch(`/api/vehicle-service/vehicles/${selectedCar.maPhuongTien}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if (res.ok) {
                const updatedCar = await res.json();
                alert("Cập nhật xe thành công!");
                setCarList(prev => 
                    prev.map(c => c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c)
                );
                setIsOpenEdit(false);
            } else {
                const error = await res.text();
                alert("Cập nhật xe thất bại!\n" + error);
            }
        })
        .catch(error => {
            console.error('Lỗi cập nhật xe:', error);
            alert("Lỗi kết nối!");
        });
    };

    // Mở modal quản lý pin cho xe - CHỈ cho phép thay pin
    const openPinManagement = (car) => {
        setSelectedCarForPin(car);
        loadAvailablePins();
        setIsOpenPinManagement(true);
    };

    // Hủy liên kết pin hiện tại (tháo pin ra)
    const handleUnlinkPin = () => {
        const token = localStorage.getItem('token');
        
        fetch(`/api/vehicle-service/vehicles/${selectedCarForPin.maPhuongTien}/unlink-pin`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            if (res.ok) {
                const updatedCar = await res.json();
                alert("Đã tháo pin thành công! Giờ bạn có thể thêm pin mới.");
                setCarList(prev => 
                    prev.map(c => c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c)
                );
                setSelectedCarForPin(updatedCar); // Cập nhật xe không còn pin
                
                // Load lại danh sách pin có sẵn
                loadAvailablePins();
            } else {
                const error = await res.text();
                alert("Tháo pin thất bại!\n" + error);
            }
        })
        .catch(error => {
            console.error('Lỗi tháo pin:', error);
            alert("Lỗi kết nối!");
        });
    };

    // Liên kết pin mới với xe (sau khi đã tháo pin cũ)
    const handleLinkPin = (pinId) => {
        const token = localStorage.getItem('token');
        
        fetch(`/api/vehicle-service/vehicles/${selectedCarForPin.maPhuongTien}/link-pin/${pinId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            if (res.ok) {
                const updatedCar = await res.json();
                alert("Thêm pin mới thành công!");
                setCarList(prev => 
                    prev.map(c => c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c)
                );
                setIsOpenPinManagement(false);
                setSelectedCarForPin(null);
            } else {
                const error = await res.text();
                alert("Thêm pin thất bại!\n" + error);
            }
        })
        .catch(error => {
            console.error('Lỗi thêm pin:', error);
            alert("Lỗi kết nối!");
        });
    };

    // Hàm xử lý xóa xe (và xóa pin theo)
    const openDeleteConfirm = (car) => {
        setCarToDelete(car);
        setIsOpenDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!carToDelete) return;

        const token = localStorage.getItem('token');
        
        try {
            // 1. Xóa xe trước
            const deleteCarResponse = await fetch(`/api/vehicle-service/vehicles/${carToDelete.maPhuongTien}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (deleteCarResponse.ok) {
                // 2. Nếu xe có pin, xóa pin luôn
                if (carToDelete.maPin) {
                    await fetch(`/api/battery-service/pins/${carToDelete.maPin}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                }
                
                alert("Xóa xe và pin thành công!");
                setCarList(prev => prev.filter(c => c.maPhuongTien !== carToDelete.maPhuongTien));
            } else {
                alert("Xóa xe thất bại!");
            }
        } catch (error) {
            console.error('Lỗi xóa xe:', error);
            alert("Lỗi kết nối!");
        } finally {
            setIsOpenDeleteConfirm(false);
            setCarToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsOpenDeleteConfirm(false);
        setCarToDelete(null);
    };

    return (
        <div className={styles.cardetail}>
            <div className={styles.header}>
                <h1>Xe Của Tôi</h1>
                <p>Quản lý xe và pin đã đăng ký</p>
            </div>
            
            {loadingCars ? (
                <div>Đang tải danh sách xe...</div>
            ) : carList.length === 0 ? (
                <div className={styles.noCars}>Chưa có xe nào được đăng ký</div>
            ) : (
                carList.map((car) => (
                    <div key={car.maPhuongTien} className={styles.carname}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faCarSide} className={styles.faCarSide} />
                            <div className={styles.namevin}>
                                <p className={styles.name}>{car.loaiXe}</p>
                                <p className={styles.vin}>VIN: {car.vin}</p>
                                <p className={styles.vin}>Biển số: {car.bienSo}</p>
                                {car.maPin ? (
                                    <div className={styles.pinInfo}>
                                        <FontAwesomeIcon icon={faBatteryFull} className={styles.batteryIcon} />
                                        <span>Pin: #{car.maPin} (Đang sử dụng)</span>
                                    </div>
                                ) : (
                                    <div className={styles.pinInfo}>
                                        <span className={styles.noPin}>Chưa có pin</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.carActions}>
                            <Button
                                icon
                                aria-label={`Quản lý pin cho ${car.loaiXe}`}
                                type="button"
                                onClick={() => openPinManagement(car)}
                                title="Quản lý pin"
                            >
                                <FontAwesomeIcon icon={faBatteryFull} className={styles.iconbutton} />
                            </Button>
                            <Button
                                icon
                                aria-label={`Chỉnh sửa ${car.loaiXe}`}
                                type="button"
                                onClick={() => openEdit(car)}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} />
                            </Button>
                            <Button 
                                white 
                                outline 
                                type="button" 
                                onClick={() => openDeleteConfirm(car)}
                                style={{marginLeft: '8px'}}
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>
                ))
            )}
            <Button white outline type="button" onClick={openAdd}>
                Thêm xe mới + Pin
            </Button>

            {/* Modal Thêm xe với tạo pin mới */}
            {isOpenAdd && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Thêm Xe Mới & Tạo Pin</h2>
                        
                        <div className={styles.sectionDivider}>
                            <h4>Thông tin Xe</h4>
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="vin">Mã VIN *</label>
                            <input
                                id="vin"
                                type="text"
                                value={newCar.vin}
                                onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
                                placeholder="VD: VNFAST998877"
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="bienSo">Biển số *</label>
                            <input
                                id="bienSo"
                                type="text"
                                value={newCar.bienSo}
                                onChange={(e) => setNewCar({ ...newCar, bienSo: e.target.value })}
                                placeholder="VD: 51A-123.45"
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="loaiXe">Loại xe *</label>
                            <input
                                id="loaiXe"
                                type="text"
                                value={newCar.loaiXe}
                                onChange={(e) => setNewCar({ ...newCar, loaiXe: e.target.value })}
                                placeholder="VD: VinFast VF8"
                            />
                        </div>
                        
                        <div className={styles.sectionDivider}>
                            <h4>Thông tin Pin Mới</h4>
                            <p className={styles.note}>Chọn loại pin để tự động điền thông tin</p>
                        </div>
                        
                        <div className={styles.formdetail}>
                            <label htmlFor="pinType">Loại pin *</label>
                            <select
                                id="pinType"
                                value={newCar.selectedPinType}
                                onChange={(e) => handlePinTypeChange(e.target.value)}
                            >
                                <option value="">Chọn loại pin</option>
                                {Object.keys(PIN_TYPES).map(pinType => (
                                    <option key={pinType} value={pinType}>
                                        {pinType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="loaiPin">Thông số pin (tự động)</label>
                            <input
                                id="loaiPin"
                                type="text"
                                value={newCar.loaiPin}
                                readOnly
                                placeholder="Sẽ tự động điền khi chọn loại pin"
                                className={styles.readonlyInput}
                            />
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="dungLuongPin">Dung lượng pin (kWh) (tự động)</label>
                            <input
                                id="dungLuongPin"
                                type="number"
                                value={newCar.dungLuongPin}
                                readOnly
                                placeholder="Sẽ tự động điền khi chọn loại pin"
                                className={styles.readonlyInput}
                            />
                        </div>

                        <div className={styles.formdetail}>
                            <label htmlFor="sucKhoePin">Sức khỏe pin (%) *</label>
                            <input
                                id="sucKhoePin"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={newCar.sucKhoePin}
                                onChange={(e) => setNewCar({ ...newCar, sucKhoePin: e.target.value })}
                                placeholder="Nhập từ 0-100%"
                            />
                            <div className={styles.rangeInfo}>
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <Button 
                                change 
                                type="button" 
                                onClick={handleSaveNew}
                                disabled={creatingPin || !newCar.selectedPinType}
                            >
                                {creatingPin ? 'Đang tạo...' : 'Tạo Xe & Pin'}
                            </Button>
                            <Button white blackoutline type="button" onClick={() => setIsOpenAdd(false)}>
                                Hủy
                            </Button>
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
                            <label htmlFor="editVin">Mã VIN *</label>
                            <input
                                id="editVin"
                                type="text"
                                value={selectedCar.vin}
                                onChange={(e) => setSelectedCar({ ...selectedCar, vin: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="editBienSo">Biển số *</label>
                            <input
                                id="editBienSo"
                                type="text"
                                value={selectedCar.bienSo}
                                onChange={(e) => setSelectedCar({ ...selectedCar, bienSo: e.target.value })}
                            />
                        </div>
                        <div className={styles.formdetail}>
                            <label htmlFor="editLoaiXe">Loại xe *</label>
                            <input
                                id="editLoaiXe"
                                type="text"
                                value={selectedCar.loaiXe}
                                onChange={(e) => setSelectedCar({ ...selectedCar, loaiXe: e.target.value })}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button change type="button" onClick={handleSaveEdit}>Lưu</Button>
                            <Button white blackoutline type="button" onClick={() => setIsOpenEdit(false)}>Hủy</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Quản lý Pin - CHỨC NĂNG THAY PIN */}
            {isOpenPinManagement && selectedCarForPin && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Thay Pin cho {selectedCarForPin.loaiXe}</h2>
                        
                        {/* Trạng thái pin hiện tại */}
                        <div className={styles.currentPin}>
                            <h4>Pin hiện tại:</h4>
                            {selectedCarForPin.maPin ? (
                                <div className={styles.pinStatus}>
                                    <div className={styles.pinInfoCurrent}>
                                        <FontAwesomeIcon icon={faBatteryFull} className={styles.batteryIcon} />
                                        <div>
                                            <p><strong>Pin #{selectedCarForPin.maPin}</strong></p>
                                            <p>Loại: {selectedCarForPin.pinInfo?.loaiPin || 'Chưa rõ'}</p>
                                            <p>Dung lượng: {selectedCarForPin.pinInfo?.dungLuong || 'Chưa rõ'} kWh</p>
                                            <p>Sức khỏe: {selectedCarForPin.pinInfo?.sucKhoe || 'Chưa rõ'}%</p>
                                        </div>
                                    </div>
                                    <div className={styles.unlinkAction}>
                                        <p className={styles.instruction}>Để thêm pin mới, bạn cần tháo pin hiện tại trước.</p>
                                        <Button 
                                            white 
                                            outline 
                                            type="button" 
                                            onClick={handleUnlinkPin}
                                            style={{marginTop: '10px'}}
                                        >
                                            <FontAwesomeIcon icon={faRotate} style={{marginRight: '8px'}} />
                                            Tháo Pin Hiện Tại
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.noPinSection}>
                                    <p className={styles.noPin}>🚫 Chưa có pin được lắp</p>
                                    <p className={styles.instruction}>Bạn có thể thêm pin mới từ danh sách bên dưới.</p>
                                </div>
                            )}
                        </div>

                        {/* Danh sách pin có sẵn để thêm - CHỈ hiển thị khi không có pin */}
                        {!selectedCarForPin.maPin && (
                            <div className={styles.availablePins}>
                                <h4>Pin có sẵn để thêm:</h4>
                                {loadingPins ? (
                                    <div>Đang tải danh sách pin...</div>
                                ) : availablePins.length === 0 ? (
                                    <div className={styles.noPinsSection}>
                                        <p className={styles.noPins}>Không có pin nào sẵn sàng</p>
                                        <p className={styles.suggestion}>
                                            Vui lòng liên hệ trạm để có thêm pin hoặc đợi pin được sạc đầy.
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.pinList}>
                                        <p className={styles.instruction}>Chọn pin để thêm vào xe:</p>
                                        {availablePins.map(pin => (
                                            <div key={pin.maPin} className={styles.pinItem}>
                                                <div className={styles.pinInfo}>
                                                    <FontAwesomeIcon icon={faBatteryFull} className={styles.batteryIcon} />
                                                    <div>
                                                        <p><strong>Pin #{pin.maPin}</strong></p>
                                                        <p>Loại: {pin.loaiPin}</p>
                                                        <p>Dung lượng: {pin.dungLuong} kWh</p>
                                                        <p>Sức khỏe: {pin.sucKhoe}%</p>
                                                        <p className={styles.pinStatusText}>
                                                            Trạng thái: 
                                                            <span className={pin.tinhTrang === 'DAY' ? styles.statusReady : styles.statusCharging}>
                                                                {pin.tinhTrang === 'DAY' ? ' 🔋 Sẵn sàng' : ' ⚡ Đang sạc'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    change 
                                                    type="button" 
                                                    onClick={() => handleLinkPin(pin.maPin)}
                                                >
                                                    Thêm Pin Này
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Thông báo khi đang có pin */}
                        {selectedCarForPin.maPin && (
                            <div className={styles.instructionSection}>
                                <div className={styles.infoBox}>
                                    <FontAwesomeIcon icon={faRotate} className={styles.rotateIcon} />
                                    <div>
                                        <h5>Quy trình thay pin:</h5>
                                        <ol className={styles.procedureList}>
                                            <li>Nhấn "Tháo Pin Hiện Tại" để tháo pin đang sử dụng</li>
                                            <li>Chọn pin mới từ danh sách pin có sẵn</li>
                                            <li>Nhấn "Thêm Pin Này" để lắp pin mới</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <Button white blackoutline type="button" onClick={() => setIsOpenPinManagement(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận xóa */}
            {isOpenDeleteConfirm && carToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Xác nhận xóa</h2>
                        <p>Bạn có chắc muốn xóa xe <strong>{carToDelete.loaiXe}</strong> (VIN: {carToDelete.vin})?</p>
                        
                        {carToDelete.maPin && (
                            <div className={styles.warningSection}>
                                <p className={styles.warningText}>⚠️ Cảnh báo: Pin #{carToDelete.maPin} của xe này cũng sẽ bị xóa vĩnh viễn!</p>
                                <div className={styles.pinInfoDelete}>
                                    <FontAwesomeIcon icon={faBatteryFull} className={styles.batteryIcon} />
                                    <span>Pin sẽ bị xóa: #{carToDelete.maPin}</span>
                                </div>
                            </div>
                        )}
                        
                        <p className={styles.warningText}>Hành động này không thể hoàn tác!</p>
                        <div className={styles.modalActions}>
                            <Button 
                                white 
                                blackoutline 
                                type="button" 
                                onClick={handleConfirmDelete}
                                style={{backgroundColor: '#dc3545', color: 'white', border: 'none'}}
                            >
                                Xóa Xe & Pin
                            </Button>
                            <Button change type="button" onClick={handleCancelDelete}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarManagement;