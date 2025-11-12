import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCreditCard,
  faMoneyBillWave,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./BatterySwapModal.module.css";
import axios from "axios";
import Select from "react-select";

function BatterySwapModal({ order, mode = "CHO_XAC_NHAN", onClose, onConfirm }) {
  const [availablePins, setAvailablePins] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [loadingPins, setLoadingPins] = useState(false);

  // trạng thái giao dịch
  const [transactionStatus, setTransactionStatus] = useState("chờ giao dịch");

  // thanh toán
  const [payment, setPayment] = useState(null);

  // chỉ fetch pin khi đang ở tab "chờ xác nhận"
  useEffect(() => {
    const fetchAvailablePins = async () => {
      if (mode !== "CHO_XAC_NHAN" || !order?.maTram || !order?.pinDi?.loaiPin) return;
      setLoadingPins(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `/api/battery-service/lichsu-pin-tram/${order.maTram}/available`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { loaiPin: order.pinDi.loaiPin },
          }
        );
        setAvailablePins(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy danh sách pin:", err);
      } finally {
        setLoadingPins(false);
      }
    };
    fetchAvailablePins();
  }, [mode, order?.maTram, order?.pinDi?.loaiPin]);

  const handleConfirm = async () => {
    if (!selectedPin) {
      alert("⚠️ Vui lòng chọn pin đến trước khi xác nhận!");
      return;
    }
    if (!payment) {
      alert("⚠️ Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 🧩 1️⃣ Tạo giao dịch đổi pin
      const payloadGiaoDich = {
        maPinTra: String(order?.pinDi?.maPin),
        maPinNhan: String(selectedPin),
        ngayGiaoDich: null,
        trangThaiGiaoDich: transactionStatus,
        thanhtien: 1200000,
        phuongThucThanhToan: payment,
        maTram: order?.maTram,
        maTaiXe: order?.maTaiXe,
      };

      const resGiaoDich = await axios.post(
        `/api/transaction-service/giaodichdoipin`,
        payloadGiaoDich,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const maGiaoDich = resGiaoDich.data.maGiaoDichDoiPin;
      console.log("✅ Tạo giao dịch thành công:", resGiaoDich.data);

      // 🧩 2️⃣ Cập nhật trạng thái đơn đặt pin với mã giao dịch vừa tạo
      const payloadUpdate = {
        trangThaiXacNhan: "Đã xác nhận",
        trangThaiDoiPin: "Đang xử lý",
        maGiaoDichDoiPin: maGiaoDich,
      };

      await axios.put(
        `/api/station-service/dat-lich/${order.maLichSuDat}`,
        payloadUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Xác nhận đơn và tạo giao dịch thành công!");
      onConfirm(resGiaoDich.data);
      onClose();
    } catch (err) {
      console.error("❌ Lỗi khi tạo giao dịch hoặc cập nhật đơn:", err);
      alert("❌ Không thể hoàn tất xác nhận, vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>
            {mode === "CHO_XAC_NHAN" ? "Xác Nhận Đơn Đặt Pin" : "Chi Tiết Giao Dịch Thay Pin"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.main}>
          {/* Thông tin khách hàng */}
          <div className={styles.customerCard}>
            <h3>Thông Tin Khách Hàng</h3>
            <div className={styles.infoGrid}>
              <div><strong>Tên:</strong> {order?.name}</div>
              <div><strong>Xe:</strong> {order?.car}</div>
              <div><strong>Mã Đặt Chỗ:</strong> {order?.code}</div>
              <div><strong>Mô hình Pin:</strong> {order?.pinDi?.loaiPin || "Không rõ"}</div>
            </div>
          </div>

          {/* Pin đi + Pin đến */}
          <div className={styles.pinGrid}>
            <div className={`${styles.pinCard} ${styles.pinOut}`}>
              <h4>Pin đi</h4>
              <p className={styles.note}>Pin tài xế mang đến trạm</p>
              <p>Mã pin: <strong>{order?.pinDi?.maPin || "Không rõ"}</strong></p>
              <p>Loại pin: <strong>{order?.pinDi?.loaiPin || "Không rõ"}</strong></p>
              <p>Dung lượng: <strong>{order?.pinDi?.dungLuong || "--"} kWh</strong></p>
              <p>Sức khỏe: <strong>{order?.pinDi?.sucKhoe || "--"}%</strong></p>
            </div>

            <div className={`${styles.pinCard} ${styles.pinIn}`}>
              <h4>Pin đến</h4>
              <p className={styles.note}>Pin nhân viên giao cho tài xế</p>
              {mode === "CHO_XAC_NHAN" ? (
                loadingPins ? (
                  <p>Đang tải pin...</p>
                ) : (
                  <>
                    <Select
                      options={availablePins.map(pin => ({
                        value: pin.maPin,
                        label: `Mã ${pin.maPin} | SK: ${pin.sucKhoe}%`
                      }))}
                      placeholder="Tìm pin..."
                      onChange={(opt) => setSelectedPin(opt?.value || "")}
                      isSearchable
                      noOptionsMessage={() => "Không tìm thấy pin phù hợp"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: 8,
                          borderColor: "#ccc",
                          boxShadow: "none",
                          "&:hover": { borderColor: "#111827" }
                        })
                      }}
                    />

                    {/* 🟢 Thông tin chi tiết pin được chọn */}
                    {selectedPin && (() => {
                      const pin = availablePins.find(p => p.maPin === Number(selectedPin));
                      if (!pin) return null;
                      return (
                        <div className={styles.pinDetails} style={{ marginTop: "8px" }}>
                          <p>Mã pin: <strong>{pin.maPin}</strong></p>
                          <p>Loại pin: <strong>{pin.loaiPin}</strong></p>
                          <p>Dung lượng: <strong>{pin.dungLuong} kWh</strong></p>
                          <p>Sức khỏe: <strong>{pin.sucKhoe}%</strong></p>
                        </div>
                      );
                    })()}
                  </>
                )
              ) : (
                <>
                  <p>Mã pin: <strong>{order?.pinDen?.maPin || "Không rõ"}</strong></p>
                  <p>Loại pin: <strong>{order?.pinDen?.loaiPin || "Không rõ"}</strong></p>
                  <p>Dung lượng: <strong>{order?.pinDen?.dungLuong || "--"} kWh</strong></p>
                  <p>Sức khỏe: <strong>{order?.pinDen?.sucKhoe || "--"}%</strong></p>
                </>
              )}
            </div>
          </div>

          {/* Trạng thái giao dịch */}
          <div className={styles.checklistRow}>
            <label>
              <input
                type="radio"
                name="status"
                checked={transactionStatus === "chờ giao dịch"}
                onChange={() => setTransactionStatus("chờ giao dịch")}
              />
              Chờ giao dịch
            </label>
            <label>
              <input
                type="radio"
                name="status"
                checked={transactionStatus === "đã hoàn thành"}
                onChange={() => setTransactionStatus("đã hoàn thành")}
              />
              Đã hoàn thành
            </label>
          </div>

          {/* Thanh toán */}
          <div className={styles.paymentBox}>
            <h4>Thanh Toán Dịch Vụ</h4>
            <div className={styles.priceRow}>
              <span>Tổng tiền:</span>
              <strong>1.200.000₫</strong>
            </div>

            <div className={styles.paymentBtns}>
              <button
                className={`${styles.payBtn} ${payment === "card" ? styles.active : ""
                  }`}
                onClick={() => setPayment("card")}
              >
                <FontAwesomeIcon icon={faCreditCard} /> Thẻ
              </button>
              <button
                className={`${styles.payBtn} ${payment === "cash" ? styles.active : ""
                  }`}
                onClick={() => setPayment("cash")}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} /> Tiền mặt
              </button>
              <button
                className={`${styles.payBtn} ${payment === "package" ? styles.active : ""
                  }`}
                onClick={() => setPayment("package")}
              >
                <FontAwesomeIcon icon={faGift} /> Sử dụng gói
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
          <button
            className={styles.primaryBtn}
            disabled={mode === "CHO_XAC_NHAN" && !selectedPin}
            onClick={handleConfirm}
          >
            {mode === "CHO_XAC_NHAN" ? "Xác Nhận Đơn" : "Lưu Trạng Thái"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatterySwapModal;