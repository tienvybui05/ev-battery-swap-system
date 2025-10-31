import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faFilter,
  faPlus,
  faGear,
  faTimes,
  faEdit,
  faTrash,
  faRefresh,
  faEnvelope,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Staff.module.css";

function Staff() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [staffData, setStaffData] = useState({
    topKpi: [
      {
        title: "Tổng Nhân Viên",
        value: "0",
        sub: "Đang tải...",
        color: "#16a34a",
        icon: faUsers,
      },
      {
        title: "Nhân Viên Active",
        value: "0",
        sub: "Đang tải...",
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
        title: "Hiệu Suất TB",
        value: "0%",
        sub: "Đang tải...",
        color: "#f97316",
        icon: faDollarSign,
      },
    ],
    staffList: [],
  });

  const [newStaff, setNewStaff] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    gioiTinh: "",
    matKhau: "",
    ngaySinh: "",
    bangCap: "",
    kinhNghiem: ""
  });

  // Lấy token từ localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Load danh sách nhân viên khi component mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setListLoading(true);
      const token = getAuthToken();
      if (!token) {
        console.error("Không tìm thấy token!");
        setListLoading(false);
        return;
      }

      console.log("🔄 Đang tải danh sách nhân viên...");
      const response = await fetch('/api/user-service/nhanvien', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("📊 Response status:", response.status);
      
      if (response.ok) {
        const nhanVienList = await response.json();
        console.log("✅ Dữ liệu nhân viên từ API:", nhanVienList);
        
        // Transform data từ API sang format hiển thị
        const transformedList = nhanVienList.map(nv => ({
          id: nv.maNhanVien,
          name: nv.nguoiDung?.hoTen || "Chưa có tên",
          role: getRoleFromData(nv),
          station: getStationFromData(nv),
          performance: calculatePerformance(nv),
          status: getStatusFromData(nv),
          initials: getInitials(nv.nguoiDung?.hoTen || "NV"),
          email: nv.nguoiDung?.email || "Chưa có email",
          soDienThoai: nv.nguoiDung?.soDienThoai || "Chưa có SĐT",
          bangCap: nv.bangCap || "Chưa có bằng cấp",
          kinhNghiem: nv.kinhNghiem || "Chưa có kinh nghiệm",
          ngaySinh: nv.nguoiDung?.ngaySinh || null,
          gioiTinh: nv.nguoiDung?.gioiTinh || "Chưa xác định"
        }));

        // Cập nhật KPI dựa trên dữ liệu thực
        updateKpiData(transformedList);

        setStaffData(prev => ({
          ...prev,
          staffList: transformedList
        }));
        
        console.log(`✅ Đã tải ${transformedList.length} nhân viên`);
      } else {
        console.error("❌ Lỗi khi tải danh sách nhân viên:", response.status);
        if (response.status === 403) {
          alert("Bạn không có quyền truy cập danh sách nhân viên!");
        } else if (response.status === 401) {
          alert("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
        }
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối:", error);
      alert("Lỗi kết nối server! Vui lòng kiểm tra kết nối.");
    } finally {
      setListLoading(false);
    }
  };

  // Cập nhật KPI dựa trên dữ liệu thực
  const updateKpiData = (staffList) => {
    const totalStaff = staffList.length;
    const activeStaff = staffList.filter(staff => staff.status === "active").length;
    const avgPerformance = staffList.length > 0 
      ? Math.round(staffList.reduce((sum, staff) => sum + staff.performance, 0) / staffList.length)
      : 0;

    setStaffData(prev => ({
      ...prev,
      topKpi: [
        {
          ...prev.topKpi[0],
          value: totalStaff.toString(),
          sub: `Tổng số nhân viên`
        },
        {
          ...prev.topKpi[1],
          value: activeStaff.toString(),
          sub: `Đang hoạt động`
        },
        {
          ...prev.topKpi[2],
          value: "24", // Giữ nguyên trạm
          sub: "Tất Cả Trực Tuyến"
        },
        {
          ...prev.topKpi[3],
          value: `${avgPerformance}%`,
          sub: `Hiệu suất trung bình`
        },
      ]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }

      console.log("🔄 Đang gửi request thêm nhân viên...");
      const response = await fetch('/api/user-service/nhanvien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStaff)
      });

      console.log("📊 Response status:", response.status);

      if (response.ok) {
        const addedStaff = await response.json();
        console.log("✅ Nhân viên mới:", addedStaff);
        
        // Thêm nhân viên mới vào danh sách
        const newStaffItem = {
          id: addedStaff.maNhanVien,
          name: addedStaff.nguoiDung.hoTen,
          role: "Nhân viên",
          station: "Chưa phân công",
          performance: 85, // Mặc định cho nhân viên mới
          status: "active",
          initials: getInitials(addedStaff.nguoiDung.hoTen),
          email: addedStaff.nguoiDung.email,
          soDienThoai: addedStaff.nguoiDung.soDienThoai,
          bangCap: addedStaff.bangCap,
          kinhNghiem: addedStaff.kinhNghiem,
          ngaySinh: addedStaff.nguoiDung.ngaySinh,
          gioiTinh: addedStaff.nguoiDung.gioiTinh
        };

        setStaffData(prev => ({
          ...prev,
          staffList: [...prev.staffList, newStaffItem]
        }));

        // Cập nhật lại KPI
        updateKpiData([...staffData.staffList, newStaffItem]);

        // Đóng modal và reset form
        setShowAddModal(false);
        setNewStaff({
          hoTen: "",
          email: "",
          soDienThoai: "",
          gioiTinh: "",
          matKhau: "",
          ngaySinh: "",
          bangCap: "",
          kinhNghiem: ""
        });

        alert("✅ Thêm nhân viên thành công!");
      } else {
        const errorText = await response.text();
        let errorMessage = "Lỗi khi thêm nhân viên";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        console.error("❌ Lỗi response:", errorMessage);
        
        if (response.status === 403) {
          errorMessage = "Bạn không có quyền thêm nhân viên!";
        } else if (response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ: " + errorMessage;
        }
        
        alert("❌ Lỗi: " + errorMessage);
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm nhân viên:", error);
      alert("❌ Lỗi kết nối server! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        const token = getAuthToken();
        if (!token) {
          alert("Vui lòng đăng nhập lại!");
          return;
        }

        const response = await fetch(`/api/user-service/nhanvien/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Xóa khỏi danh sách hiển thị
          const updatedList = staffData.staffList.filter(staff => staff.id !== id);
          setStaffData(prev => ({
            ...prev,
            staffList: updatedList
          }));

          // Cập nhật lại KPI
          updateKpiData(updatedList);

          alert("✅ Xóa nhân viên thành công!");
        } else {
          const errorText = await response.text();
          alert("❌ Lỗi khi xóa nhân viên: " + errorText);
        }
      } catch (error) {
        console.error("❌ Lỗi khi xóa nhân viên:", error);
        alert("❌ Lỗi kết nối server!");
      }
    }
  };

  // Hàm helper để xác định các giá trị từ dữ liệu API
  const getRoleFromData = (nv) => {
    const role = nv.nguoiDung?.vaiTro;
    switch(role) {
      case "NHANVIEN": return "Nhân viên";
      case "QUANLY": return "Quản lý";
      case "ADMIN": return "Quản trị viên";
      default: return "Nhân viên";
    }
  };

  const getStationFromData = (nv) => {
    // Nếu có dữ liệu trạm từ API, sử dụng ở đây
    return nv.tram || "Chưa phân công";
  };

  const calculatePerformance = (nv) => {
    // Tính hiệu suất dựa trên dữ liệu thực tế
    // Hiện tại random 70-99%, có thể thay bằng logic thực tế
    return Math.floor(Math.random() * 30) + 70;
  };

  const getStatusFromData = (nv) => {
    // Dựa vào trạng thái từ API để xác định status
    // Mặc định là active, có thể mở rộng dựa trên dữ liệu thực
    return "active";
  };

  const getInitials = (name) => {
    if (!name || name === "Chưa có tên") return "NV";
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return "Invalid date";
    }
  };

  const refreshStaffList = () => {
    fetchStaffList();
  };

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
          <button 
            className={styles.refreshBtn}
            onClick={refreshStaffList}
            title="Làm mới danh sách"
            disabled={listLoading}
          >
            <FontAwesomeIcon icon={faRefresh} className={listLoading ? styles.spin : ''} />
          </button>
          <button 
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className={styles.staffList}>
        {listLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải danh sách nhân viên...</p>
          </div>
        ) : staffData.staffList.length === 0 ? (
          <div className={styles.emptyState}>
            <p>📭 Chưa có nhân viên nào trong hệ thống</p>
            <button 
              className={styles.addBtn}
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Thêm nhân viên đầu tiên
            </button>
          </div>
        ) : (
          staffData.staffList.map((staff) => (
            <div key={staff.id} className={styles.staffCard}>
              <div className={styles.staffLeft}>
                <div className={styles.avatar}>{staff.initials}</div>
                <div className={styles.staffInfo}>
                  <h4>{staff.name}</h4>
                  <p className={styles.role}>{staff.role}</p>
                  <p className={styles.station}>{staff.station}</p>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                      <span>{staff.email}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                      <span>{staff.soDienThoai}</span>
                    </div>
                    {staff.ngaySinh && (
                      <div className={styles.contactItem}>
                        <span>🎂 {formatDate(staff.ngaySinh)}</span>
                      </div>
                    )}
                  </div>
                  {(staff.bangCap || staff.kinhNghiem) && (
                    <div className={styles.qualifications}>
                      {staff.bangCap && <span className={styles.badge}>{staff.bangCap}</span>}
                      {staff.kinhNghiem && <span className={styles.badge}>{staff.kinhNghiem}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.staffRight}>
                <div className={styles.performance}>
                  <span className={staff.performance >= 80 ? styles.high : styles.medium}>
                    {staff.performance}%
                  </span>
                  <p>Hiệu suất</p>
                </div>
                <div className={`${styles.status} ${
                  staff.status === "active" ? styles.active : 
                  staff.status === "inactive" ? styles.inactive : 
                  styles.onLeave
                }`}>
                  {staff.status === "active" ? "Đang làm" : 
                   staff.status === "inactive" ? "Không hoạt động" : 
                   "Nghỉ phép"}
                </div>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.iconBtn}
                    title="Chỉnh sửa thông tin"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeleteStaff(staff.id)}
                    title="Xóa nhân viên"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm Nhân Viên - Giữ nguyên */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thêm Nhân Viên Mới</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Form inputs - Giữ nguyên từ code trước */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Họ và Tên *</label>
                  <input
                    type="text"
                    name="hoTen"
                    value={newStaff.hoTen}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Số Điện Thoại *</label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={newStaff.soDienThoai}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giới Tính</label>
                  <select 
                    name="gioiTinh" 
                    value={newStaff.gioiTinh}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="NAM">Nam</option>
                    <option value="NU">Nữ</option>
                    <option value="KHAC">Khác</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Mật Khẩu *</label>
                  <input
                    type="password"
                    name="matKhau"
                    value={newStaff.matKhau}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    minLength="6"
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ngày Sinh</label>
                  <input
                    type="date"
                    name="ngaySinh"
                    value={newStaff.ngaySinh}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Bằng Cấp</label>
                  <input
                    type="text"
                    name="bangCap"
                    value={newStaff.bangCap}
                    onChange={handleInputChange}
                    placeholder="VD: Đại học, Cao đẳng..."
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Kinh Nghiệm</label>
                  <input
                    type="text"
                    name="kinhNghiem"
                    value={newStaff.kinhNghiem}
                    onChange={handleInputChange}
                    placeholder="VD: 2 năm kinh nghiệm..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className={styles.saveBtn}
                  disabled={loading}
                >
                  {loading ? "Đang thêm..." : "Thêm Nhân Viên"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;