import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faPlus,
  faMapMarkerAlt,
  faEye,
  faEdit,
  faCog,
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import styles from "./Stations.module.css";

// Dữ liệu KPI đầu trang
const topKpi = [
  {
    title: "Tổng Doanh Thu",
    value: "$267.000",
    sub: "+12.5%",
    icon: faDollarSign,
    color: "#16a34a",
  },
  {
    title: "Tổng Lần Thay Pin",
    value: "12.847",
    sub: "+8.3%",
    icon: faBatteryFull,
    color: "#3b82f6",
  },
  {
    title: "Trạm Hoạt Động",
    value: "24",
    sub: "Tất Cả Trực Tuyến",
    icon: faLocationDot,
    color: "#a855f7",
  },
  {
    title: "Khách Hàng",
    value: "8.547",
    sub: "+156 mới",
    icon: faUser,
    color: "#f97316",
  },
];

// Dữ liệu danh sách trạm
const stations = [
  {
    name: "Downtown Hub",
    status: "active",
    swaps: 456,
    revenue: 11400,
    utilization: 85,
  },
  {
    name: "Mall Station",
    status: "active",
    swaps: 389,
    revenue: 9725,
    utilization: 78,
  },
  {
    name: "Airport Terminal",
    status: "maintenance",
    swaps: 234,
    revenue: 7020,
    utilization: 45,
  },
  {
    name: "Highway Rest Stop",
    status: "active",
    swaps: 567,
    revenue: 17010,
    utilization: 92,
  },
];

export default function Stations() {
  return (
    <div className={styles.wrapper}>
      {/* KPI Tổng Quan */}
      <div className={styles.kpiGrid}>
        {topKpi.map((item, index) => (
          <div key={index} className={styles.kpiCard}>
            <div className={styles.kpiInfo}>
              <p className={styles.kpiTitle}>{item.title}</p>
              <h2 className={styles.kpiValue}>{item.value}</h2>
              <p className={styles.kpiSub}>
                <span className={styles.kpiArrow}>↑</span> {item.sub}
              </p>
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
        <h2 className={styles.headerTitle}>Quản Lý Trạm</h2>
        <div className={styles.headerActions}>
          <button className={styles.filterBtn}>
            <FontAwesomeIcon icon={faFilter} /> Lọc
          </button>
          <button className={styles.addBtn}>
            <FontAwesomeIcon icon={faPlus} /> Thêm Trạm
          </button>
        </div>
      </div>

      {/* Danh sách trạm */}
      <div className={styles.stationList}>
        {stations.map((st, i) => (
          <div key={i} className={styles.stationCard}>
            <div className={styles.infoRow}>
              <div className={styles.infoLeft}>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={styles.icon}
                  />
                  <div
                    className={`${styles.status} ${
                      styles[st.status] || styles.offline
                    }`}
                  >
                    {st.status}
                  </div>
                </div>

                <div>
                  <h3 className={styles.stationName}>{st.name}</h3>
                  <div className={styles.infoDetails}>
                    <div>
                      Lần Thay Pin: <span>{st.swaps}</span>
                    </div>
                    <div>
                      Doanh Thu: <span>${st.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      Sử Dụng: <span>{st.utilization}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actionBtns}>
                <button className={styles.iconBtn}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className={styles.iconBtn}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className={styles.iconBtn}>
                  <FontAwesomeIcon icon={faCog} />
                </button>
              </div>
            </div>

            <div className={styles.progressWrapper}>
              <div className={styles.progressInfo}>
                <span>Sử Dụng</span>
                <span>{st.utilization}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${st.utilization}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
