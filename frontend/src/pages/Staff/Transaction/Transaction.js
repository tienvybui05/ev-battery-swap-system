import React from "react";
import styles from "./Transaction.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import StatsHeader from "../components/StatsHeader/StatsHeader";

// ===== MOCK DATA ===== //
const mockTransactions = [
  // Hôm nay (5 người)
  {
    id: 1,
    date: new Date().toISOString().split("T")[0], // hôm nay
    time: "14:32",
    name: "Alex Chen",
    vehicle: "Tesla Model 3",
    outSlot: "A1",
    inSlot: "B2",
    method: "đăng ký",
    amount: 25,
  },
  {
    id: 2,
    date: new Date().toISOString().split("T")[0],
    time: "14:15",
    name: "Sarah Kim",
    vehicle: "BMW iX3",
    outSlot: "A3",
    inSlot: "B1",
    method: "thẻ",
    amount: 25,
  },
  {
    id: 3,
    date: new Date().toISOString().split("T")[0],
    time: "13:58",
    name: "Mike Johnson",
    vehicle: "Nissan Leaf",
    outSlot: "B3",
    inSlot: "A2",
    method: "tiền mặt",
    amount: 25,
  },
  {
    id: 4,
    date: new Date().toISOString().split("T")[0],
    time: "15:10",
    name: "Emily Tran",
    vehicle: "Hyundai Kona",
    outSlot: "C1",
    inSlot: "D2",
    method: "QR",
    amount: 30,
  },
  {
    id: 5,
    date: new Date().toISOString().split("T")[0],
    time: "16:45",
    name: "David Lee",
    vehicle: "VinFast VF8",
    outSlot: "D1",
    inSlot: "E3",
    method: "QR",
    amount: 28,
  },

  // 4 ngày trước khác nhau (4 người)
  {
    id: 6,
    date: "2025-10-12",
    time: "11:25",
    name: "Minh Nguyen",
    vehicle: "Kia EV6",
    outSlot: "B1",
    inSlot: "C2",
    method: "đăng ký",
    amount: 25,
  },
  {
    id: 7,
    date: "2025-10-11",
    time: "09:10",
    name: "Linh Pham",
    vehicle: "Tesla Model Y",
    outSlot: "A2",
    inSlot: "C1",
    method: "thẻ",
    amount: 26,
  },
  {
    id: 8,
    date: "2025-10-10",
    time: "18:20",
    name: "Hoang Bui",
    vehicle: "BYD Atto 3",
    outSlot: "D4",
    inSlot: "A3",
    method: "QR",
    amount: 27,
  },
  {
    id: 9,
    date: "2025-10-10",
    time: "10:50",
    name: "An Vo",
    vehicle: "MG4 Electric",
    outSlot: "E2",
    inSlot: "C1",
    method: "tiền mặt",
    amount: 24,
  },
];

function TransactionItem({ tx }) {
  const badgeClass =
    tx.method === "đăng ký"
      ? `${styles.badge} ${styles.badgePrimary}`
      : tx.method === "thẻ"
      ? `${styles.badge} ${styles.badgeInfo}`
      : tx.method === "QR"
      ? `${styles.badge} ${styles.badgeQR}`
      : `${styles.badge} ${styles.badgeNeutral}`;

  return (
    <div className={styles.item}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.time}>{tx.time}</div>
        <div className={badgeClass}>{tx.method}</div>
      </div>

      {/* MIDDLE */}
      <div className={styles.middle}>
        <div className={styles.name}>{tx.name}</div>
        <div className={styles.vehicle}>{tx.vehicle}</div>
        <div className={styles.meta}>
          <span className={styles.muted}>ra:</span>&nbsp;{tx.outSlot}
          &nbsp;↗&nbsp;↙&nbsp;
          <span className={styles.muted}>vào:</span>&nbsp;{tx.inSlot}
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.amount}>${tx.amount}</div>
        <button className={styles.iconBtn} aria-label="details">
          <FontAwesomeIcon icon={faDollarSign} />
        </button>
      </div>
    </div>
  );
}

export default function Transaction() {
  const today = new Date().toISOString().split("T")[0];
  const todayTransactions = mockTransactions.filter((t) => t.date === today);
  const historyTransactions = mockTransactions.filter((t) => t.date !== today);

  return (
    <div className={styles.container}>
      {/* đẩy phần header/các thẻ chỉ số xuống thấp hơn */}
      <div className={styles.headerWrap}>
        <StatsHeader title="Giao Dịch" />
      </div>

      {/* GIAO DỊCH GẦN ĐÂY */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Giao Dịch Gần Đây</h3>
          <p className={styles.subTitle}>Thay pin hoàn thành hôm nay</p>
        </div>

        <div className={styles.list}>
          {todayTransactions.map((t) => (
            <TransactionItem key={t.id} tx={t} />
          ))}
        </div>
      </section>

      {/* LỊCH SỬ GIAO DỊCH */}
      {historyTransactions.length > 0 && (
        <section className={`${styles.card} ${styles.historyCard}`}>
          <div className={styles.cardHeader}>
            <h3>Lịch Sử Giao Dịch</h3>
          </div>

          {Object.entries(
            historyTransactions.reduce((groups, tx) => {
              const date = tx.date;
              if (!groups[date]) groups[date] = [];
              groups[date].push(tx);
              return groups;
            }, {})
          )
            .sort(([a], [b]) => (a > b ? -1 : 1)) // ngày mới trước
            .map(([date, txs]) => (
              <div key={date} className={styles.historyGroup}>
                <div className={styles.dateLabel}>
                  Ngày giao dịch:{" "}
                  {new Date(date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
                <div className={styles.list}>
                  {txs.map((t) => (
                    <TransactionItem key={t.id} tx={t} />
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}
    </div>
  );
}
