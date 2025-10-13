import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faPlus,
  faMapMarkerAlt,
  faEye,
  faEdit,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Stations.module.css";

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
