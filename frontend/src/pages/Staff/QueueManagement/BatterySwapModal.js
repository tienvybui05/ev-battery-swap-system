import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCreditCard,
  faMoneyBillWave,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./BatterySwapModal.module.css";

function BatterySwapModal({ order, onClose, onConfirm }) {
  const [checklist, setChecklist] = useState({
    qrScanned: false,
    pinConfirmed: false,
    swapDone: false,
  });

  const [payment, setPayment] = useState(null);

  const toggleChecklist = (key) =>
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Quá Trình Thay Pin</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <p className={styles.subtitle}>
          Hoàn thành thay pin cho khách hàng {order?.code}
        </p>

        {/* MAIN CONTENT */}
        <div className={styles.main}>
          <div className={styles.customerCard}>
            <h3>Thông Tin Khách Hàng</h3>
            <div className={styles.infoGrid}>
              <div><strong>Tên:</strong> {order?.name}</div>
              <div><strong>Xe:</strong> {order?.car}</div>
              <div><strong>Mã Đặt Chỗ:</strong> {order?.code}</div>
              <div><strong>Mô hình Pin:</strong> TM3-75kWh</div>
            </div>
          </div>

          <div className={styles.pinGrid}>
            <div className={`${styles.pinCard} ${styles.pinOut}`}>
              <h4>Pin đi</h4>
              <p>Pin hiện: <strong>Customer’s Battery</strong></p>
              <p>Mức sạc: <strong>15%</strong></p>
              <p>Slot đến: <strong>A2 (Charging)</strong></p>
            </div>

            <div className={`${styles.pinCard} ${styles.pinIn}`}>
              <h4>Pin đến</h4>
              <p>Pin mới: <strong>Slot B3</strong></p>
              <p>Mức sạc: <strong>100%</strong></p>
              <p>Sức khỏe: <strong>96%</strong></p>
            </div>
          </div>

          {/* Checklist */}
          <div className={styles.checklistRow}>
            <label>
              <input
                type="checkbox"
                checked={checklist.qrScanned}
                onChange={() => toggleChecklist("qrScanned")}
              />
              Mã QR Đã Quét
            </label>
            <label>
              <input
                type="checkbox"
                checked={checklist.pinConfirmed}
                onChange={() => toggleChecklist("pinConfirmed")}
              />
              PIN Đã Xác Nhận
            </label>
            <label>
              <input
                type="checkbox"
                checked={checklist.swapDone}
                onChange={() => toggleChecklist("swapDone")}
              />
              Thay Pin Hoàn Thành
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
                className={`${styles.payBtn} ${
                  payment === "card" ? styles.active : ""
                }`}
                onClick={() => setPayment("card")}
              >
                <FontAwesomeIcon icon={faCreditCard} /> Thẻ
              </button>
              <button
                className={`${styles.payBtn} ${
                  payment === "cash" ? styles.active : ""
                }`}
                onClick={() => setPayment("cash")}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} /> Tiền mặt
              </button>
              <button
                className={`${styles.payBtn} ${
                  payment === "qr" ? styles.active : ""
                }`}
                onClick={() => setPayment("qr")}
              >
                <FontAwesomeIcon icon={faQrcode} /> QR
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
            onClick={() => onConfirm(order.id)} // ✅ Gọi về QueueManagement
          >
            Xác Nhận & In Hóa Đơn
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatterySwapModal;
