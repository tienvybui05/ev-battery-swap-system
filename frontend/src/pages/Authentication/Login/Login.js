import { useState } from "react";
import { useNavigate, Link } from "react-router"; // 👈 dùng để điều hướng
import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import styles from "./Login.module.css";
import loginVinfast from "../../../assets/loginVinfast.jpg";

function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.phone.trim() || !formData.password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("https://api.vinfast-demo.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Đăng nhập thất bại!");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      navigate("/"); 
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.header}>
          <span>Chào Mừng Trở Lại</span>
          <p>Đăng nhập để truy cập tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputInfo}>
            <span>Số điện thoại</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>
          <div className={styles.inputInfo}>
            <span>Mật khẩu</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>

          {/* Thông báo lỗi */}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            Đăng nhập
          </button>
        </form>

        <div className={styles.transferRegistration}>
          <div className={styles.divider}>
            <span>------------- Hoặc -------------</span>
          </div>
          <span>
            Không có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
          </span>
        </div>
      </div>

      <div className={styles.imagesLogin}>
        <img
          src={loginVinfast}
          title="Giao diện ảnh đăng nhập"
          className={styles.longinVin}
        />
      </div>
    </div>
  );
}

export default Login;
