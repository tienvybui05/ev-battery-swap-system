import React, { useState } from "react";
import styles from "./Register.module.css";
import { Link } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    Ho_Ten: "",
    Email: "",
    Sdt: "",
    Gioi_tinh: "Nam",
    Mat_Khau: "",
    Ngay_sinh: "",
    Dia_Chi: "",
    Vai_Tro: "driver",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký:", formData);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Đăng ký người dùng</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại:</label>
            <input
              type="text"
              name="Sdt"
              value={formData.Sdt}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Giới tính:</label>
            <select
              name="Gioi_tinh"
              value={formData.Gioi_tinh}
              onChange={handleChange}
              className={styles.select}
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
            />
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Đăng ký
        </button>
        <span>Quay về <Link to="/"> Trang chủ</Link></span>
      </form>
    </div>
  );
};

export default Register;
