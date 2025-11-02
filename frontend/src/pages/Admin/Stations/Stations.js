import axios from "axios";
import React, { useState, useEffect } from "react";
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
  faTimes,
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


export default function Stations() {
  // Mở modal
  const openModal = (mode, station = null) => {
    setModalMode(mode);
    setSelectedStation(station);
    if (station) setFormData(station);
    else
      setFormData({
        tenTram: "",
        diaChi: "",
        kinhDo: "",
        viDo: "",
        soLuongPinToiDa: "",
        soDT: "",
        trangThai: "Hoạt động",
      });
    setShowModal(true);
  };
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);         // danh sách trạm từ API
  const [modalMode, setModalMode] = useState("add");    // add | view | edit
  const [error, setError] = useState(null);             // lỗi khi gọi API
  const[selectedStation, setSelectedStation] = useState(null);

  // Dữ liệu form
  const [formData, setFormData] = useState({
    tenTram: "",
    diaChi: "",
    kinhDo: "",
    viDo: "",
    soLuongPinToiDa: "",
    soDT: "",
    trangThai: "Hoạt động",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "add") {
        await axios.post("/api/station-service/tram", formData);
        alert("✅ Thêm trạm thành công!");
      } else if (modalMode === "edit") {
        await axios.put(`/api/station-service/tram/${selectedStation.maTram}`, formData);
        alert("✅ Cập nhật trạm thành công!");
      }
      setShowModal(false);
      window.location.reload(); // làm mới danh sách
    } catch (err) {
      alert("❌ Lỗi khi lưu dữ liệu, xem console để biết thêm chi tiết.");
      console.error(err);
    }
  };

  // ✨ Thêm hàm này phía trên return:
const closeModal = () => {
  // Reset dữ liệu form về rỗng
  setFormData({
    tenTram: "",
    diaChi: "",
    kinhDo: "",
    viDo: "",
    soLuongPinToiDa: "",
    soDT: "",
    trangThai: "Hoạt động",
  });
  setSelectedStation(null);
  setShowModal(false);
};

  // GỌI API GET TRẠM KHI COMPONENT MOUNT
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("/api/station-service/tram");
        setStations(res.data);      // gán dữ liệu trả về từ backend
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải danh sách trạm:", err);
        setError("Không thể tải danh sách trạm");
        setLoading(false);
      }
    };
    fetchStations();
  }, []);  // chỉ chạy 1 lần khi load trang

  // HIỂN THỊ TRẠNG THÁI
  if (loading) return <p>Đang tải dữ liệu trạm...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
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
          <button
            className={styles.addBtn}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Trạm
          </button>
        </div>
      </div>

      {/* POPUP FORM (THÊM / XEM / SỬA) */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                {modalMode === "add"
                  ? "Thêm Trạm Mới"
                  : modalMode === "edit"
                    ? "Chỉnh Sửa Trạm"
                    : "Thông Tin Trạm"}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Tên Trạm</label>
                <input
                  name="tenTram"
                  value={formData.tenTram}
                  onChange={handleChange}
                  disabled={modalMode === "view"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Địa Chỉ</label>
                <input
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  disabled={modalMode === "view"}
                  required
                />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.formGroup}>
                  <label>Kinh Độ</label>
                  <input
                    name="kinhDo"
                    value={formData.kinhDo}
                    onChange={handleChange}
                    type="number"
                    disabled={modalMode === "view"}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vĩ Độ</label>
                  <input
                    name="viDo"
                    value={formData.viDo}
                    onChange={handleChange}
                    type="number"
                    disabled={modalMode === "view"}
                  />
                </div>
              </div>

              <div className={styles.gridRow}>
                <div className={styles.formGroup}>
                  <label>Số Lượng Pin Tối Đa</label>
                  <input
                    name="soLuongPinToiDa"
                    value={formData.soLuongPinToiDa}
                    onChange={handleChange}
                    type="number"
                    disabled={modalMode === "view"}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Số Điện Thoại</label>
                  <input
                    name="soDT"
                    value={formData.soDT}
                    onChange={handleChange}
                    disabled={modalMode === "view"}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Trạng Thái</label>
                <select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleChange}
                  disabled={modalMode === "view"}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>

              {modalMode !== "view" && (
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={closeModal}
                  >
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Lưu Trạm
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

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
                    className={`${styles.status} ${styles[
                      st.trangThai === "Hoạt động"
                        ? "active"
                        : st.trangThai === "Bảo trì"
                          ? "maintenance"
                          : "offline"
                    ]
                      }`}
                  >
                    {st.trangThai}
                  </div>
                </div>

                <div>
                  <h3 className={styles.stationName}>{st.tenTram}</h3>
                  <div className={styles.infoDetails}>
                    <div>
                      Lần Thay Pin: <span>{st.swaps}</span>
                    </div>
                    <div>
                      Doanh Thu: <span>${st.revenue}</span>
                    </div>
                    <div>
                      Sử Dụng: <span>{st.utilization}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actionBtns}>
                <button
                  className={styles.iconBtn}
                  onClick={() => openModal("view", st)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={() => openModal("edit", st)}
                >
                  <FontAwesomeIcon icon={faEdit} />
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
