import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faPlus,
  faFilter,
  faEye,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Customers.module.css";

function Customers() {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      topKpi: [
        {
          title: "Tổng Doanh Thu",
          value: "$267.000",
          sub: "+12.5%",
          color: "#16a34a",
          icon: faDollarSign,
        },
        {
          title: "Tổng Lần Thay Pin",
          value: "12.847",
          sub: "+8.3%",
          color: "#3b82f6",
          icon: faBatteryFull,
        },
        {
          title: "Trạm Hoạt Động",
          value: "24",
          sub: "Tất Cả Trực Tuyến",
          color: "#a855f7",
          icon: faLocationDot,
        },
        {
          title: "Khách Hàng",
          value: "8.547",
          sub: "+156 mới",
          color: "#f97316",
          icon: faUsers,
        },
      ],
      customers: [
        {
          name: "Alex Chen",
          email: "alex@email.com",
          plan: "Gói Không Giới Hạn",
          swaps: 23,
          revenue: "$149",
          status: "active",
        },
        {
          name: "Sarah Kim",
          email: "sarah@email.com",
          plan: "Trả Theo Lần",
          swaps: 8,
          revenue: "$200",
          status: "active",
        },
        {
          name: "Mike Johnson",
          email: "mike@email.com",
          plan: "Doanh Nghiệp",
          swaps: 156,
          revenue: "$2400",
          status: "active",
        },
        {
          name: "Emily Davis",
          email: "emily@email.com",
          plan: "Gói Không Giới Hạn",
          swaps: 45,
          revenue: "$597",
          status: "suspended",
        },
      ],
    };

    setCustomerData(mockData);
    setLoading(false);
  }, []);

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

return (
  <div className={`${styles.wrapper} ${styles.fadeIn}`}>

      {/* KPI đầu trang */}
      <div className={styles.kpiGrid}>
        {customerData.topKpi.map((item, index) => (
          <div key={index} className={styles.kpiCard}>
            <div className={styles.kpiInfo}>
              <p className={styles.kpiTitle}>{item.title}</p>
              <h2 className={styles.kpiValue}>{item.value}</h2>
              <p className={styles.kpiSub}>{item.sub}</p>
            </div>
            <div
              className={styles.kpiIcon}
              style={{ color: item.color, backgroundColor: item.color + "20" }}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Quản Lý Khách Hàng</h2>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Tìm kiếm khách hàng..." />
          </div>
          <button className={styles.filterBtn}>
            <FontAwesomeIcon icon={faFilter} /> Lọc
          </button>
          <button className={styles.addBtn}>
            <FontAwesomeIcon icon={faPlus} /> Thêm Khách Hàng
          </button>
        </div>
      </div>

     
    </div>
  );
}

export default Customers;
