import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Ho_Ten: "",
    Email: "",
    Sdt: "",
    Gioi_tinh: "Nam",
    Mat_Khau: "",
    Ngay_sinh: "",
    Dia_Chi: "",
    Bang_Lai_Xe: "", // THÊM BẰNG LÁI XE
    Vai_Tro: "TAIXE",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Đang gọi API đăng ký tài xế...");

      // CHUẨN HÓA DATA THEO ENDPOINT register-tai-xe
      const registerData = {
        hoTen: formData.Ho_Ten,
        email: formData.Email,
        soDienThoai: formData.Sdt,
        gioiTinh: formData.Gioi_tinh,
        matKhau: formData.Mat_Khau,
        ngaySinh: formData.Ngay_sinh,
        diaChi: formData.Dia_Chi,
        bangLaiXe: formData.Bang_Lai_Xe, // THÊM BẰNG LÁI XE
        // KHÔNG CẦN vaiTro vì endpoint này mặc định là TAIXE
      };

      // SỬA ENDPOINT THÀNH register-tai-xe
      const res = await fetch("/api/user-service/auth/register-tai-xe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}: Đăng ký thất bại`);
      }

      const data = await res.json();
      console.log("Register success:", data);

      // ĐĂNG KÝ THÀNH CÔNG - CHUYỂN SANG LOGIN
      setLoading(false);
      alert("Đăng ký tài xế thành công! Chuyển đến trang đăng nhập...");
      navigate("/login");

    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Đăng ký tài xế</h2> {/* SỬA TIÊU ĐỀ */}
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputuser}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Họ tên:</label>
            <input
              type="text"
              name="Ho_Ten"
              value={formData.Ho_Ten}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại:</label>
            <input
              type="text"
              name="Sdt"
              value={formData.Sdt}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giới tính:</label>
            <select
              name="Gioi_tinh"
              value={formData.Gioi_tinh}
              onChange={handleChange}
              className={styles.select}
              disabled={loading}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu:</label>
            <input
              type="password"
              name="Mat_Khau"
              value={formData.Mat_Khau}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày sinh:</label>
            <input
              type="date"
              name="Ngay_sinh"
              value={formData.Ngay_sinh}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Địa chỉ:</label>
            <input
              type="text"
              name="Dia_Chi"
              value={formData.Dia_Chi}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          {/* THÊM TRƯỜNG BẰNG LÁI XE */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Bằng lái xe:</label>
            <input
              type="text"
              name="Bang_Lai_Xe"
              value={formData.Bang_Lai_Xe}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
              placeholder="VD: A1-123456"
            />
          </div>

          {/* ẨN CHỌN VAI TRÒ VÌ MẶC ĐỊNH LÀ TAIXE */}
          <input type="hidden" name="Vai_Tro" value="TAIXE" />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký tài xế"}
        </button>
        
        <div className={styles.loginLink}>
          <span>Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Register;