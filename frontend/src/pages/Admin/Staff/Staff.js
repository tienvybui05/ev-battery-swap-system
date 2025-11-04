import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faFilter,
  faPlus,
  faRefresh,
  faEdit,
  faTrash,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Staff.module.css";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal"; // Import component mới

function Staff() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
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

      console.log("Đang tải danh sách nhân viên...");
      const response = await fetch('/api/user-service/nhanvien', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const nhanVienList = await response.json();
        console.log("Dữ liệu nhân viên từ API:", nhanVienList);
        
        // Transform data từ API sang format hiển thị
        const transformedList = nhanVienList.map(nv => ({
          id: nv.maNhanVien,
          name: nv.nguoiDung?.hoTen || "Chưa có tên",
          role: getRoleFromData(nv),
          station: getStationFromData(nv),
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
        
        console.log(`Đã tải ${transformedList.length} nhân viên`);
      } else {
        console.error("Lỗi khi tải danh sách nhân viên:", response.status);
        if (response.status === 403) {
          alert("Bạn không có quyền truy cập danh sách nhân viên!");
        } else if (response.status === 401) {
          alert("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối server! Vui lòng kiểm tra kết nối.");
    } finally {
      setListLoading(false);
    }
  };

  // Cập nhật KPI dựa trên dữ liệu thực
  const updateKpiData = (staffList) => {
    const totalStaff = staffList.length;
    const activeStaff = staffList.length;

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
          value: "24",
          sub: "Tất Cả Trực Tuyến"
        },
        {
          ...prev.topKpi[3],
          value: `${totalStaff > 0 ? Math.round(activeStaff/totalStaff * 100) : 0}%`,
          sub: `Tỷ lệ hoạt động`
        },
      ]
    }));
  };

  // Hàm xử lý thêm nhân viên mới
  const handleAddStaff = async (newStaffData) => {
    setLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }

      console.log("Dữ liệu gửi đi:", newStaffData);

      const requestData = {
        hoTen: newStaffData.hoTen,
        email: newStaffData.email,
        soDienThoai: newStaffData.soDienThoai,
        gioiTinh: newStaffData.gioiTinh || "NAM",
        matKhau: newStaffData.matKhau,
        ngaySinh: newStaffData.ngaySinh || null,
        bangCap: newStaffData.bangCap || "",
        kinhNghiem: newStaffData.kinhNghiem || ""
      };

      console.log("Đang gửi request thêm nhân viên...");
      const response = await fetch('/api/user-service/nhanvien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const addedStaff = await response.json();
        console.log("Nhân viên mới:", addedStaff);
        
        const newStaffItem = {
          id: addedStaff.maNhanVien,
          name: addedStaff.nguoiDung?.hoTen || addedStaff.hoTen,
          role: "Nhân viên",
          station: "Chưa phân công",
          initials: getInitials(addedStaff.nguoiDung?.hoTen || addedStaff.hoTen),
          email: addedStaff.nguoiDung?.email || addedStaff.email,
          soDienThoai: addedStaff.nguoiDung?.soDienThoai || addedStaff.soDienThoai,
          bangCap: addedStaff.bangCap,
          kinhNghiem: addedStaff.kinhNghiem,
          ngaySinh: addedStaff.nguoiDung?.ngaySinh || addedStaff.ngaySinh,
          gioiTinh: addedStaff.nguoiDung?.gioiTinh || addedStaff.gioiTinh
        };

        setStaffData(prev => {
          const updatedList = [...prev.staffList, newStaffItem];
          updateKpiData(updatedList);
          return {
            ...prev,
            staffList: updatedList
          };
        });

        setShowAddModal(false);
        alert("Thêm nhân viên thành công!");
      } else {
        const errorText = await response.text();
        console.error("Chi tiết lỗi từ server:", errorText);
        
        let errorMessage = "Lỗi khi thêm nhân viên";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        alert("Lỗi: " + errorMessage);
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      alert("Lỗi kết nối server! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý sửa nhân viên
  const handleEditStaff = async (id, staffData) => {
    setEditLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }

      console.log("Dữ liệu cập nhật:", staffData);

      const requestData = {
        hoTen: staffData.hoTen,
        email: staffData.email,
        soDienThoai: staffData.soDienThoai,
        gioiTinh: staffData.gioiTinh,
        ngaySinh: staffData.ngaySinh || null,
        bangCap: staffData.bangCap || "",
        kinhNghiem: staffData.kinhNghiem || ""
      };

      console.log("Đang gửi request cập nhật nhân viên...");
      const response = await fetch(`/api/user-service/nhanvien/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const updatedStaff = await response.json();
        console.log("Nhân viên đã cập nhật:", updatedStaff);
        
        // Cập nhật danh sách
        setStaffData(prev => {
          const updatedList = prev.staffList.map(staff => 
            staff.id === id ? {
              ...staff,
              name: updatedStaff.nguoiDung?.hoTen || updatedStaff.hoTen,
              email: updatedStaff.nguoiDung?.email || updatedStaff.email,
              soDienThoai: updatedStaff.nguoiDung?.soDienThoai || updatedStaff.soDienThoai,
              bangCap: updatedStaff.bangCap,
              kinhNghiem: updatedStaff.kinhNghiem,
              ngaySinh: updatedStaff.nguoiDung?.ngaySinh || updatedStaff.ngaySinh,
              gioiTinh: updatedStaff.nguoiDung?.gioiTinh || updatedStaff.gioiTinh,
              initials: getInitials(updatedStaff.nguoiDung?.hoTen || updatedStaff.hoTen)
            } : staff
          );
          return {
            ...prev,
            staffList: updatedList
          };
        });

        setShowEditModal(false);
        setSelectedStaff(null);
        alert("Cập nhật thông tin nhân viên thành công!");
      } else {
        const errorText = await response.text();
        console.error("Chi tiết lỗi từ server:", errorText);
        
        let errorMessage = "Lỗi khi cập nhật nhân viên";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        alert("Lỗi: " + errorMessage);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      alert("Lỗi kết nối server! Vui lòng thử lại.");
    } finally {
      setEditLoading(false);
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
          const updatedList = staffData.staffList.filter(staff => staff.id !== id);
          setStaffData(prev => ({
            ...prev,
            staffList: updatedList
          }));

          updateKpiData(updatedList);
          alert("Xóa nhân viên thành công!");
        } else {
          const errorText = await response.text();
          alert("Lỗi khi xóa nhân viên: " + errorText);
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        alert("Lỗi kết nối server!");
      }
    }
  };

  // Hàm mở modal sửa
  const handleOpenEditModal = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
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
    return nv.tram || "Chưa phân công";
  };

  const getInitials = (name) => {
    if (!name || name === "Chưa có tên") return "NV";
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
            {/* Empty state */}
          </div>
        ) : (
          staffData.staffList.map((staff) => (
            <div key={staff.id} className={styles.staffCard}>
              <div className={styles.staffLeft}>
                {/* <div className={styles.avatar}>{staff.initials}</div> */}
                <div className={styles.staffInfo}>
                  <h4>{staff.name}</h4>
                  <p className={styles.station}>{staff.station}</p>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                      <span>{staff.soDienThoai}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.staffRight}>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.iconBtn}
                    title="Chỉnh sửa thông tin"
                    onClick={() => handleOpenEditModal(staff)}
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

      {/* Modal Thêm Nhân Viên */}
      <AddStaffModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddStaff={handleAddStaff}
        loading={loading}
      />

      {/* Modal Sửa Nhân Viên */}
      <EditStaffModal 
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStaff(null);
        }}
        onUpdateStaff={handleEditStaff}
        loading={editLoading}
        staff={selectedStaff}
      />
    </div>
  );
}

export default Staff;