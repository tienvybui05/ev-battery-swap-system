import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import StatsHeader from "../components/StatsHeader/StatsHeader";
import styles from "./QueueManagement.module.css";

function QueueManagement() {
  const orders = [
    {
      id: 1,
      time: "15:30",
      name: "Lượng Gia Cát",
      car: "Tesla Model 3",
      code: "SW-2024-001",
      status: "đang chờ",
      color: "#3B82F6", // xanh dương nhạt
    },
    {
      id: 2,
      time: "16:00",
      name: "Kim Chong Beo",
      car: "BMW iX3",
      code: "SW-2024-002",
      status: "hoàn thành",
      color: "#10B981", // xanh lá
    },
    {
      id: 3,
      time: "16:30",
      name: "Lý Tiểu Long",
      car: "Nissan Leaf",
      code: "SW-2024-003",
      status: "đã xác nhận",
      color: "#6B7280", // xám trung bình
    },
    {
      id: 4,
      time: "20:30",
      name: "Buồi Vỹ",
      car: "VinFast VF8",
      code: "SW-2024-004",
      status: "đang chờ",
      color: "#3B82F6", // xanh dương nhạt
    },
    {
      id: 5,
      time: "16:30",
      name: "Đạt Không Chín",
      car: "Tesla Model Y",
      code: "SW-2025-001",
      status: "đã xác nhận",
      color: "#6B7280", // xám trung bình
    },
    {
      id: 6,
      time: "01:00",
      name: "Ngọc Tờ Rinh",
      car: "Honda e",
      code: "SW-2024-088",
      status: "staff.in-progress",
      color: "#111827", // đen đậm
    },
  ];

  const loading = false; // giữ mẫu; sau này dùng state và API

  return (
    <div className={styles.queuePage}>
      <StatsHeader />

      <div className={styles.ordersSection}>
        <h2>Đơn Đặt Hôm Nay</h2>
        <p className={styles.subtitle}>
          Quản lý đặt chỗ khách hàng và khách hàng đến trực tiếp
        </p>

        {loading ? (
          <div className={styles.spinner}></div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không có đơn nào hôm nay</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.left}>
                  <div className={styles.time}>{order.time}</div>
                  <div className={styles.info}>
                    <div className={styles.name}>{order.name}</div>
                    <div className={styles.car}>{order.car}</div>
                    <div className={styles.code}>{order.code}</div>
                  </div>
                </div>

                <div className={styles.right}>
                  <div
                    className={styles.status}
                    style={{
                      backgroundColor: order.color + "20",
                      color: order.color,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={order.status === "hoàn thành" ? faCheck : faClock}
                    />
                    <span>{order.status}</span>
                  </div>

                  {/* CHỈ HIỆN NÚT KHI status === "đang chờ" */}
                  {order.status === "đang chờ" && (
                    <button className={styles.actionBtn} style={{ backgroundColor: "#111827" }}>
                      Bắt Đầu Thay Pin{" "}
                      <FontAwesomeIcon icon={faArrowRight} size="sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueManagement;
