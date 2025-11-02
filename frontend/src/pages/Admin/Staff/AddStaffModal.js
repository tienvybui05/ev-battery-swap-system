import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./Staff.module.css";

function AddStaffModal({ show, onClose, onAddStaff, loading }) {
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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newStaff.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!newStaff.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(newStaff.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!newStaff.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(newStaff.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    if (!newStaff.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (newStaff.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddStaff(newStaff);
    }
  };

  const handleClose = () => {
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
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Thêm Nhân Viên Mới</h3>
          <button 
            className={styles.closeBtn}
            onClick={handleClose}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
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
                className={errors.hoTen ? styles.errorInput : ""}
              />
              {errors.hoTen && <span className={styles.errorText}>{errors.hoTen}</span>}
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
                className={errors.email ? styles.errorInput : ""}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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
                className={errors.soDienThoai ? styles.errorInput : ""}
              />
              {errors.soDienThoai && <span className={styles.errorText}>{errors.soDienThoai}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Giới Tính *</label>
              <select 
                name="gioiTinh" 
                value={newStaff.gioiTinh}
                onChange={handleInputChange}
                disabled={loading}
                required
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
                className={errors.matKhau ? styles.errorInput : ""}
              />
              {errors.matKhau && <span className={styles.errorText}>{errors.matKhau}</span>}
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
              onClick={handleClose}
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
  );
}

export default AddStaffModal;