import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faFilter,
  faPlus,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Staff.module.css";

function Staff() {
  const [staffData] = useState({
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
    staffList: [
      {
        name: "John Smith",
        role: "Station Manager",
        station: "Downtown Hub",
        performance: 95,
        status: "active",
        initials: "JS",
      },
      {
        name: "John Hey",
        role: "Station Manager",
        station: "Downtown Hub",
        performance: 85,
        status: "active",
        initials: "JS",
      },
      {
        name: "Lisa Wang",
        role: "Technician",
        station: "Mall Station",
        performance: 88,
        status: "active",
        initials: "LW",
      },
      {
        name: "Carlos Rodriguez",
        role: "Supervisor",
        station: "Airport Terminal",
        performance: 92,
        status: "on-leave",
        initials: "CR",
      },
      {
        name: "Huỳnh Tuấn Lượng",
        role: "Supervisor",
        station: "Airport Terminal",
        performance: 98,
        status: "on-leave",
        initials: "CR",
      },
    ],
  });

  return (
    <div className={styles.wrapper}>
      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {staffData.topKpi.map((item, index) => (
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
        <h2 className={styles.title}>Quản Lý Nhân Viên</h2>
        <div className={styles.headerActions}>
          <button className={styles.filterBtn}>
            <FontAwesomeIcon icon={faFilter} /> Lọc
          </button>
          <button className={styles.addBtn}>
            <FontAwesomeIcon icon={faPlus} /> Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className={styles.staffList}>
        {staffData.staffList.map((staff, i) => (
          <div key={i} className={styles.staffCard}>
            <div className={styles.staffLeft}>
              <div className={styles.avatar}>{staff.initials}</div>
              <div className={styles.staffInfo}>
                <h4>{staff.name}</h4>
                <p>
                  {staff.role} <br />
                  <span>{staff.station}</span>
                </p>
              </div>
            </div>

            <div className={styles.staffRight}>
              <div className={styles.performance}>
                <span className={styles.green}>{staff.performance}%</span>
                <p>Performance</p>
              </div>
              <div
                className={`${styles.status} ${
                  staff.status === "active"
                    ? styles.active
                    : staff.status === "on-leave"
                    ? styles.onLeave
                    : ""
                }`}
              >
                {staff.status}
              </div>
              <button className={styles.iconBtn}>
                <FontAwesomeIcon icon={faGear} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Staff;
