// components/CarManagement/CarManagement.js
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Shares/Button/Button";
import styles from "./CarManagement.module.css";
import {
  faCarSide,
  faBatteryFull,
  faPenToSquare,
  faRotate,
  faTrash,
  faPlus,
  faCarBattery,
  faBolt,
  faExchangeAlt,
  faEye,
  faGaugeHigh,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

// Danh sách loại pin mẫu với thông tin tự động điền
const PIN_TYPES = {
  "Lithium-ion 50kWh": {
    loaiPin: "Lithium-ion",
    dungLuong: 50.0,
  },
  "Lithium-ion 75kWh": {
    loaiPin: "Lithium-ion",
    dungLuong: 75.0,
  },
  "LFP 60kWh": {
    loaiPin: "LFP (Lithium Iron Phosphate)",
    dungLuong: 60.0,
  },
  "LFP 80kWh": {
    loaiPin: "LFP (Lithium Iron Phosphate)",
    dungLuong: 80.0,
  },
  "NMC 70kWh": {
    loaiPin: "NMC (Nickel Manganese Cobalt)",
    dungLuong: 70.0,
  },
  "NMC 90kWh": {
    loaiPin: "NMC (Nickel Manganese Cobalt)",
    dungLuong: 90.0,
  },
  "Solid-state 100kWh": {
    loaiPin: "Solid-state",
    dungLuong: 100.0,
  },
};

function CarManagement() {
  // ==== PHẦN XE - KẾT NỐI BACKEND ====
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);
  const [isOpenPinManagement, setIsOpenPinManagement] = useState(false);
  const [isOpenReplacePin, setIsOpenReplacePin] = useState(false);
  const [isOpenViewPin, setIsOpenViewPin] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [selectedCarForPin, setSelectedCarForPin] = useState(null);
  const [selectedPinForView, setSelectedPinForView] = useState(null);
  const [availablePins, setAvailablePins] = useState([]);
  const [newCar, setNewCar] = useState({
    vin: "",
    bienSo: "",
    loaiXe: "",
    selectedPinType: "",
    loaiPin: "",
    dungLuongPin: "",
    sucKhoePin: "100",
  });
  const [newPinForCar, setNewPinForCar] = useState({
    selectedPinType: "",
    loaiPin: "",
    dungLuongPin: "",
    sucKhoePin: "100",
  });
  const [pinHealthEdit, setPinHealthEdit] = useState(100);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carList, setCarList] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingPins, setLoadingPins] = useState(false);
  const [creatingPin, setCreatingPin] = useState(false);

  // Load danh sách xe từ backend khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      loadCarList(userId, token);
    }
  }, []);

  // Load danh sách xe từ backend
  const loadCarList = (userId, token) => {
    setLoadingCars(true);
    fetch(`/api/vehicle-service/vehicles/by-driver/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tải danh sách xe");
        return res.json();
      })
      .then((data) => {
        setCarList(data);
        setLoadingCars(false);
      })
      .catch((error) => {
        console.error("Lỗi tải xe:", error);
        setLoadingCars(false);
      });
  };

  // Load danh sách pin có sẵn từ battery service
  const loadAvailablePins = () => {
    const token = localStorage.getItem("token");
    setLoadingPins(true);

    fetch("/api/battery-service/pins", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tải danh sách pin");
        return res.json();
      })
      .then((data) => {
        const readyPins = data.filter(
          (pin) => pin.trangThaiSoHuu === "SAN_SANG"
        );
        setAvailablePins(readyPins);
        setLoadingPins(false);
      })
      .catch((error) => {
        console.error("Lỗi tải pin:", error);
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
      sucKhoePin: "100",
    });
    setIsOpenAdd(true);
  };

  // Xử lý khi chọn loại pin
  const handlePinTypeChange = (selectedType) => {
    if (selectedType && PIN_TYPES[selectedType]) {
      const pinInfo = PIN_TYPES[selectedType];
      setNewCar((prev) => ({
        ...prev,
        selectedPinType: selectedType,
        loaiPin: pinInfo.loaiPin,
        dungLuongPin: pinInfo.dungLuong.toString(),
      }));
    } else {
      setNewCar((prev) => ({
        ...prev,
        selectedPinType: selectedType,
        loaiPin: "",
        dungLuongPin: "",
      }));
    }
  };

  // Xử lý khi chọn loại pin trong modal thay pin
  const handleReplacePinTypeChange = (selectedType) => {
    if (selectedType && PIN_TYPES[selectedType]) {
      const pinInfo = PIN_TYPES[selectedType];
      setNewPinForCar((prev) => ({
        ...prev,
        selectedPinType: selectedType,
        loaiPin: pinInfo.loaiPin,
        dungLuongPin: pinInfo.dungLuong.toString(),
      }));
    } else {
      setNewPinForCar((prev) => ({
        ...prev,
        selectedPinType: selectedType,
        loaiPin: "",
        dungLuongPin: "",
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
      ngayNhapKho: new Date().toISOString().split("T")[0],
      ngayBaoDuongGanNhat: new Date().toISOString().split("T")[0],
    };

    const response = await fetch("/api/battery-service/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pinPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tạo pin thất bại: ${error}`);
    }

    return await response.json();
  };

  const handleSaveNew = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!newCar.vin.trim() || !newCar.bienSo.trim() || !newCar.loaiXe.trim()) {
      alert("Vui lòng điền đầy đủ thông tin xe!");
      return;
    }

    if (!newCar.selectedPinType) {
      alert("Vui lòng chọn loại pin!");
      return;
    }

    if (
      !newCar.sucKhoePin ||
      newCar.sucKhoePin < 0 ||
      newCar.sucKhoePin > 100
    ) {
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
        maPin: newPin.maPin,
      };

      const carResponse = await fetch("/api/vehicle-service/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(carPayload),
      });

      if (carResponse.ok) {
        const savedCar = await carResponse.json();
        alert(`Thêm xe thành công! Đã tạo pin #${newPin.maPin} cho xe.`);
        setCarList((prev) => [savedCar, ...prev]);
        setIsOpenAdd(false);
      } else {
        const error = await carResponse.text();

        // Nếu tạo xe thất bại, xóa pin vừa tạo
        await fetch(`/api/battery-service/pins/${newPin.maPin}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Thêm xe thất bại!\n" + error);
      }
    } catch (error) {
      console.error("Lỗi thêm xe và pin:", error);
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
    const token = localStorage.getItem("token");

    if (
      !selectedCar ||
      !selectedCar.vin.trim() ||
      !selectedCar.bienSo.trim() ||
      !selectedCar.loaiXe.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const payload = {
      vin: selectedCar.vin.trim(),
      bienSo: selectedCar.bienSo.trim(),
      loaiXe: selectedCar.loaiXe.trim(),
      maTaiXe: selectedCar.maTaiXe,
    };

    fetch(`/api/vehicle-service/vehicles/${selectedCar.maPhuongTien}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) {
          const updatedCar = await res.json();
          alert("Cập nhật xe thành công!");
          setCarList((prev) =>
            prev.map((c) =>
              c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c
            )
          );
          setIsOpenEdit(false);
        } else {
          const error = await res.text();
          alert("Cập nhật xe thất bại!\n" + error);
        }
      })
      .catch((error) => {
        console.error("Lỗi cập nhật xe:", error);
        alert("Lỗi kết nối!");
      });
  };

  // Mở modal thay pin
  const openReplacePin = (car) => {
    setSelectedCarForPin(car);
    setNewPinForCar({
      selectedPinType: "",
      loaiPin: "",
      dungLuongPin: "",
      sucKhoePin: "100",
    });
    setIsOpenReplacePin(true);
  };

  // Tháo pin (xóa pin hiện tại)
  const handleRemovePin = async () => {
    if (!selectedCarForPin?.maPin) return;

    const token = localStorage.getItem("token");

    try {
      // Xóa pin
      const deleteResponse = await fetch(
        `/api/battery-service/pins/${selectedCarForPin.maPin}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteResponse.ok) {
        // Cập nhật xe thành không có pin
        const updateCarResponse = await fetch(
          `/api/vehicle-service/vehicles/${selectedCarForPin.maPhuongTien}/unlink-pin`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateCarResponse.ok) {
          const updatedCar = await updateCarResponse.json();
          alert("Đã tháo và xóa pin thành công!");
          setCarList((prev) =>
            prev.map((c) =>
              c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c
            )
          );
          setIsOpenPinManagement(false);
          setSelectedCarForPin(null);
        }
      } else {
        alert("Tháo pin thất bại!");
      }
    } catch (error) {
      console.error("Lỗi tháo pin:", error);
      alert("Lỗi kết nối!");
    }
  };

  // Thay pin (tạo pin mới và gán vào xe)
  const handleReplacePin = async () => {
    if (!selectedCarForPin || !newPinForCar.selectedPinType) {
      alert("Vui lòng chọn loại pin mới!");
      return;
    }

    if (
      !newPinForCar.sucKhoePin ||
      newPinForCar.sucKhoePin < 0 ||
      newPinForCar.sucKhoePin > 100
    ) {
      alert("Vui lòng nhập sức khỏe pin từ 0-100%!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // 1. Nếu có pin cũ, xóa pin cũ trước
      if (selectedCarForPin.maPin) {
        await fetch(`/api/battery-service/pins/${selectedCarForPin.maPin}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // 2. Tạo pin mới
      const pinPayload = {
        loaiPin: newPinForCar.loaiPin,
        dungLuong: newPinForCar.dungLuongPin
          ? parseFloat(newPinForCar.dungLuongPin)
          : 0,
        tinhTrang: "DAY",
        trangThaiSoHuu: "DANG_SU_DUNG",
        sucKhoe: newPinForCar.sucKhoePin
          ? parseFloat(newPinForCar.sucKhoePin)
          : 100,
        ngayNhapKho: new Date().toISOString().split("T")[0],
        ngayBaoDuongGanNhat: new Date().toISOString().split("T")[0],
      };

      const createPinResponse = await fetch("/api/battery-service/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pinPayload),
      });

      if (!createPinResponse.ok) {
        throw new Error("Tạo pin mới thất bại");
      }

      const newPin = await createPinResponse.json();

      // 3. Gán pin mới vào xe
      const updateCarResponse = await fetch(
        `/api/vehicle-service/vehicles/${selectedCarForPin.maPhuongTien}/link-pin/${newPin.maPin}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateCarResponse.ok) {
        const updatedCar = await updateCarResponse.json();
        alert("Thay pin thành công!");
        setCarList((prev) =>
          prev.map((c) =>
            c.maPhuongTien === updatedCar.maPhuongTien ? updatedCar : c
          )
        );
        setIsOpenReplacePin(false);
        setSelectedCarForPin(null);
      } else {
        throw new Error("Gán pin mới thất bại");
      }
    } catch (error) {
      console.error("Lỗi thay pin:", error);
      alert("Thay pin thất bại: " + error.message);
    }
  };

  // Mở modal xem pin
  const openViewPin = async (car) => {
    if (!car.maPin) {
      alert("Xe này chưa có pin!");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/battery-service/pins/${car.maPin}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const pinData = await response.json();
        setSelectedPinForView({
          ...pinData,
          carInfo: car
        });
        setPinHealthEdit(pinData.sucKhoe || 100);
        setIsOpenViewPin(true);
      } else {
        alert("Không thể tải thông tin pin!");
      }
    } catch (error) {
      console.error('Lỗi tải thông tin pin:', error);
      alert("Lỗi kết nối!");
    }
  };

  // Cập nhật phần trăm pin
  const handleUpdatePinHealth = async () => {
    if (!selectedPinForView) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/battery-service/pins/${selectedPinForView.maPin}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...selectedPinForView,
          sucKhoe: pinHealthEdit
        })
      });

      if (response.ok) {
        alert("Cập nhật sức khỏe pin thành công!");
        setIsOpenViewPin(false);
        setSelectedPinForView(null);
        
        // Reload danh sách xe để cập nhật UI
        const userId = localStorage.getItem('userId');
        loadCarList(userId, token);
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error('Lỗi cập nhật pin:', error);
      alert("Lỗi kết nối!");
    }
  };

  // Hàm xử lý xóa xe (và xóa pin theo)
  const openDeleteConfirm = (car) => {
    setCarToDelete(car);
    setIsOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!carToDelete) return;

    const token = localStorage.getItem("token");

    try {
      // 1. Xóa xe trước
      const deleteCarResponse = await fetch(
        `/api/vehicle-service/vehicles/${carToDelete.maPhuongTien}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deleteCarResponse.ok) {
        // 2. Nếu xe có pin, xóa pin luôn
        if (carToDelete.maPin) {
          await fetch(`/api/battery-service/pins/${carToDelete.maPin}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        alert("Xóa xe và pin thành công!");
        setCarList((prev) =>
          prev.filter((c) => c.maPhuongTien !== carToDelete.maPhuongTien)
        );
      } else {
        alert("Xóa xe thất bại!");
      }
    } catch (error) {
      console.error("Lỗi xóa xe:", error);
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
                                    <FontAwesomeIcon
                                        icon={faBatteryFull}
                                        className={styles.batteryIcon}
                                    />
                                    <span>Pin: #{car.maPin} (Sức khỏe: {car.pinInfo?.sucKhoe || 'N/A'}%)</span>
                                </div>
                            ) : (
                                <div className={styles.pinInfo}>
                                    <span className={styles.noPin}>Chưa có pin</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.carActions}>
                        {/* Nút Xem Pin - chỉ hiển thị khi có pin */}
                        {car.maPin && (
                            <Button
                                icon
                                aria-label={`Xem pin của ${car.loaiXe}`}
                                type="button"
                                onClick={() => openViewPin(car)}
                                title="Xem pin"
                            >
                                <FontAwesomeIcon icon={faEye} className={styles.iconbutton} />
                            </Button>
                        )}

                        {/* Nút Thay Pin - chỉ hiển thị khi có pin */}
                        {car.maPin && (
                            <Button
                                icon
                                aria-label={`Thay pin cho ${car.loaiXe}`}
                                type="button"
                                onClick={() => openReplacePin(car)}
                                title="Thay pin"
                            >
                                <FontAwesomeIcon icon={faExchangeAlt} className={styles.iconbutton} />
                            </Button>
                        )}

                        {/* Nút Tháo Pin - chỉ hiển thị khi có pin */}
                        {car.maPin && (
                            <Button
                                icon
                                aria-label={`Tháo pin khỏi ${car.loaiXe}`}
                                type="button"
                                onClick={() => {
                                    setSelectedCarForPin(car);
                                    setIsOpenPinManagement(true);
                                }}
                                title="Tháo pin"
                            >
                                <FontAwesomeIcon icon={faCarBattery} className={styles.iconbutton} />
                            </Button>
                        )}

                        {/* Nút Thêm Pin - chỉ hiển thị khi không có pin */}
                        {!car.maPin && (
                            <Button
                                icon
                                aria-label={`Thêm pin cho ${car.loaiXe}`}
                                type="button"
                                onClick={() => openReplacePin(car)}
                                title="Thêm pin"
                            >
                                <FontAwesomeIcon icon={faBolt} className={styles.iconbutton} />
                            </Button>
                        )}

                        <Button
                            icon
                            aria-label={`Chỉnh sửa ${car.loaiXe}`}
                            type="button"
                            onClick={() => openEdit(car)}
                            title="Sửa xe"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} />
                        </Button>

                        <Button
                            icon
                            aria-label={`Xóa ${car.loaiXe}`}
                            type="button"
                            onClick={() => openDeleteConfirm(car)}
                            title="Xóa xe"
                        >
                            <FontAwesomeIcon icon={faTrash} className={styles.iconbutton} />
                        </Button>
                    </div>
                </div>
            ))
        )}
        <Button white outline type="button" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
            Thêm xe mới + Pin
        </Button>

      {/* Modal Thêm xe với tạo pin mới */}
      {isOpenAdd && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              <FontAwesomeIcon
                icon={faCarSide}
                style={{ marginRight: "10px", color: "#007bff" }}
              />
              Thêm Xe Mới & Tạo Pin
            </h2>

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
                onChange={(e) =>
                  setNewCar({ ...newCar, bienSo: e.target.value })
                }
                placeholder="VD: 51A-123.45"
              />
            </div>
            <div className={styles.formdetail}>
              <label htmlFor="loaiXe">Loại xe *</label>
              <input
                id="loaiXe"
                type="text"
                value={newCar.loaiXe}
                onChange={(e) =>
                  setNewCar({ ...newCar, loaiXe: e.target.value })
                }
                placeholder="VD: VinFast VF8"
              />
            </div>

            <div className={styles.sectionDivider}>
              <h4>
                <FontAwesomeIcon
                  icon={faBatteryFull}
                  style={{ marginRight: "8px", color: "#28a745" }}
                />
                Thông tin Pin
              </h4>
            </div>

            <div className={styles.formdetail}>
              <label htmlFor="pinType">Loại pin *</label>
              <select
                id="pinType"
                value={newCar.selectedPinType}
                onChange={(e) => handlePinTypeChange(e.target.value)}
              >
                <option value="">Chọn loại pin</option>
                {Object.keys(PIN_TYPES).map((pinType) => (
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
              <label htmlFor="dungLuongPin">
                Dung lượng pin (kWh) (tự động)
              </label>
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
                onChange={(e) =>
                  setNewCar({ ...newCar, sucKhoePin: e.target.value })
                }
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
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
                {creatingPin ? "Đang tạo..." : "Tạo Xe & Pin"}
              </Button>
              <Button
                white
                blackoutline
                type="button"
                onClick={() => setIsOpenAdd(false)}
              >
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
            <h2>
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ marginRight: "10px", color: "#ffc107" }}
              />
              Chỉnh Sửa Xe
            </h2>
            <div className={styles.formdetail}>
              <label htmlFor="editVin">Mã VIN *</label>
              <input
                id="editVin"
                type="text"
                value={selectedCar.vin}
                onChange={(e) =>
                  setSelectedCar({ ...selectedCar, vin: e.target.value })
                }
              />
            </div>
            <div className={styles.formdetail}>
              <label htmlFor="editBienSo">Biển số *</label>
              <input
                id="editBienSo"
                type="text"
                value={selectedCar.bienSo}
                onChange={(e) =>
                  setSelectedCar({ ...selectedCar, bienSo: e.target.value })
                }
              />
            </div>
            <div className={styles.formdetail}>
              <label htmlFor="editLoaiXe">Loại xe *</label>
              <input
                id="editLoaiXe"
                type="text"
                value={selectedCar.loaiXe}
                onChange={(e) =>
                  setSelectedCar({ ...selectedCar, loaiXe: e.target.value })
                }
              />
            </div>
            <div className={styles.modalActions}>
              <Button change type="button" onClick={handleSaveEdit}>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ marginRight: "8px" }}
                />
                Lưu Thay Đổi
              </Button>
              <Button
                white
                blackoutline
                type="button"
                onClick={() => setIsOpenEdit(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thay Pin */}
      {isOpenReplacePin && selectedCarForPin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              <FontAwesomeIcon
                icon={faExchangeAlt}
                style={{ marginRight: "10px", color: "#17a2b8" }}
              />
              {selectedCarForPin.maPin ? "Thay Pin" : "Thêm Pin"} cho{" "}
              {selectedCarForPin.loaiXe}
            </h2>

            <div className={styles.sectionDivider}>
              <h4>
                <FontAwesomeIcon
                  icon={faBatteryFull}
                  style={{ marginRight: "8px", color: "#28a745" }}
                />
                Thông tin Pin Mới
              </h4>
              <p className={styles.note}>
                Chọn loại pin để tự động điền thông tin
              </p>
            </div>

            <div className={styles.formdetail}>
              <label htmlFor="replacePinType">Loại pin *</label>
              <select
                id="replacePinType"
                value={newPinForCar.selectedPinType}
                onChange={(e) => handleReplacePinTypeChange(e.target.value)}
              >
                <option value="">Chọn loại pin</option>
                {Object.keys(PIN_TYPES).map((pinType) => (
                  <option key={pinType} value={pinType}>
                    {pinType}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formdetail}>
              <label htmlFor="replaceLoaiPin">Thông số pin (tự động)</label>
              <input
                id="replaceLoaiPin"
                type="text"
                value={newPinForCar.loaiPin}
                readOnly
                placeholder="Sẽ tự động điền khi chọn loại pin"
                className={styles.readonlyInput}
              />
            </div>

            <div className={styles.formdetail}>
              <label htmlFor="replaceDungLuongPin">
                Dung lượng pin (kWh) (tự động)
              </label>
              <input
                id="replaceDungLuongPin"
                type="number"
                value={newPinForCar.dungLuongPin}
                readOnly
                placeholder="Sẽ tự động điền khi chọn loại pin"
                className={styles.readonlyInput}
              />
            </div>

            <div className={styles.formdetail}>
              <label htmlFor="replaceSucKhoePin">Sức khỏe pin (%) *</label>
              <input
                id="replaceSucKhoePin"
                type="number"
                min="0"
                max="100"
                step="1"
                value={newPinForCar.sucKhoePin}
                onChange={(e) =>
                  setNewPinForCar({
                    ...newPinForCar,
                    sucKhoePin: e.target.value,
                  })
                }
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
                onClick={handleReplacePin}
                disabled={!newPinForCar.selectedPinType}
              >
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  style={{ marginRight: "8px" }}
                />
                {selectedCarForPin.maPin ? "Thay Pin" : "Thêm Pin"}
              </Button>
              <Button
                white
                blackoutline
                type="button"
                onClick={() => setIsOpenReplacePin(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Tháo Pin */}
      {isOpenPinManagement && selectedCarForPin && selectedCarForPin.maPin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              <FontAwesomeIcon
                icon={faCarBattery}
                style={{ marginRight: "10px", color: "#dc3545" }}
              />
              Xác nhận Tháo Pin
            </h2>
            <div className={styles.pinInfoCurrent}>
              <FontAwesomeIcon
                icon={faBatteryFull}
                className={styles.batteryIcon}
              />
              <div>
                <p>
                  <strong>Pin #{selectedCarForPin.maPin}</strong>
                </p>
                <p>Loại: {selectedCarForPin.pinInfo?.loaiPin || "Chưa rõ"}</p>
                <p>
                  Dung lượng:{" "}
                  {selectedCarForPin.pinInfo?.dungLuong || "Chưa rõ"} kWh
                </p>
                <p>
                  Sức khỏe: {selectedCarForPin.pinInfo?.sucKhoe || "Chưa rõ"}%
                </p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.actionButton} ${styles.removeButton}`}
                onClick={handleRemovePin}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: "8px" }}
                />
                Tháo pin
              </button>
              <button
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={() => setIsOpenPinManagement(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem & Chỉnh sửa Pin */}
      {isOpenViewPin && selectedPinForView && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2>
                <FontAwesomeIcon icon={faBatteryFull} style={{marginRight: '10px', color: '#28a745'}} />
                Thông Tin Pin
              </h2>
              <button className={styles.closeBtn} onClick={() => setIsOpenViewPin(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className={styles.main}>
              {/* Thông tin xe */}
              <div className={styles.customerCard}>
                <h3>Thông Tin Xe</h3>
                <div className={styles.infoGrid}>
                  <div><strong>Xe:</strong> {selectedPinForView.carInfo?.loaiXe}</div>
                  <div><strong>VIN:</strong> {selectedPinForView.carInfo?.vin}</div>
                  <div><strong>Biển số:</strong> {selectedPinForView.carInfo?.bienSo}</div>
                  <div><strong>Mã Pin:</strong> {selectedPinForView.maPin}</div>
                </div>
              </div>

              {/* Thông tin pin */}
              <div className={styles.pinGrid}>
                <div className={`${styles.pinCard} ${styles.pinInfoCard}`}>
                  <h4>Thông số Pin</h4>
                  <div className={styles.pinDetails}>
                    <p><strong>Loại pin:</strong> {selectedPinForView.loaiPin}</p>
                    <p><strong>Dung lượng:</strong> {selectedPinForView.dungLuong} kWh</p>
                    {/* <p><strong>Trạng thái:</strong> 
                      <span className={selectedPinForView.tinhTrang === 'DAY' ? styles.statusReady : styles.statusCharging}>
                        {selectedPinForView.tinhTrang === 'DAY' ? ' 🔋 Đầy' : 
                         selectedPinForView.tinhTrang === 'DANG_SAC' ? ' ⚡ Đang sạc' : ' 🔧 Bảo trì'}
                      </span>
                    </p> */}
                    {/* <p><strong>Trạng thái sở hữu:</strong> 
                      <span className={styles.ownershipStatus}>
                        {selectedPinForView.trangThaiSoHuu === 'DANG_SU_DUNG' ? ' 🚗 Đang sử dụng' : ' 📦 Sẵn sàng'}
                      </span>
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Chỉnh sửa phần trăm pin */}
              <div className={styles.healthEditSection}>
                <h4>
                  <FontAwesomeIcon icon={faGaugeHigh} style={{marginRight: '8px', color: '#ff6b35'}} />
                  Chỉnh Sửa Sức Khỏe Pin
                </h4>
                
                <div className={styles.healthSlider}>
                  <label htmlFor="pinHealth">Sức khỏe pin: <strong>{pinHealthEdit}%</strong></label>
                  <input
                    id="pinHealth"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={pinHealthEdit}
                    onChange={(e) => setPinHealthEdit(parseInt(e.target.value))}
                    className={styles.healthRange}
                  />
                  <div className={styles.rangeLabels}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className={styles.healthIndicator}>
                  <div 
                    className={styles.healthBar}
                    style={{width: `${pinHealthEdit}%`}}
                    data-health={pinHealthEdit}
                  ></div>
                </div>

                <div className={styles.healthStatus}>
                  {pinHealthEdit >= 80 && (
                    <span className={styles.statusGood}>🟢 Pin tốt</span>
                  )}
                  {pinHealthEdit >= 50 && pinHealthEdit < 80 && (
                    <span className={styles.statusFair}>🟡 Pin trung bình</span>
                  )}
                  {pinHealthEdit >= 20 && pinHealthEdit < 50 && (
                    <span className={styles.statusPoor}>🟠 Pin yếu</span>
                  )}
                  {pinHealthEdit < 20 && (
                    <span className={styles.statusCritical}>🔴 Pin cần thay thế</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={() => setIsOpenViewPin(false)}>
                Đóng
              </button>
              <button className={styles.primaryBtn} onClick={handleUpdatePinHealth}>
                <FontAwesomeIcon icon={faPenToSquare} style={{marginRight: '8px'}} />
                Cập Nhật Sức Khỏe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa xe */}
      {isOpenDeleteConfirm && carToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ marginRight: "10px", color: "#dc3545" }}
              />
              Xác nhận Xóa Xe
            </h2>
            <p>
              Bạn có chắc muốn xóa xe <strong>{carToDelete.loaiXe}</strong>{" "}
              (VIN: {carToDelete.vin})?
            </p>

            <p className={styles.warningText}>
              Hành động này không thể hoàn tác!
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.deleteButton}
                type="button"
                onClick={handleConfirmDelete}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: "8px" }}
                />
                Xóa Xe & Pin
              </button>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarManagement;