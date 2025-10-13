import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import styles from "./Login.module.css";
import loginVinfast from "../../../assets/loginVinfast.jpg";
import { Link } from "react-router";
function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.header}>
          <span> Chào Mừng Trở Lại </span>
          <p>Đăng nhập để truy cập tài khoản của bạn</p>
        </div>
        <div className={styles.inputForm}>
          <div className={styles.inputInfo}>
            <span>Số điện thoại</span>
            <input type="text" placeholder="Nhập số điện thoại của bạn" />
          </div>
          <div className={styles.inputInfo}>
            <span>Mật khẩu</span>
            <input type="text" placeholder="Nhập mật khẩu của bạn" />
          </div>
          <LinkButton to="/" primary>
            Đăng nhập
          </LinkButton>
        </div>
        <div className={styles.transferRegistration}>
           <div class={styles.divider}><span>------------- Hoặc -------------</span></div>
        <span>Không có tài khoản? <Link to="/">Đăng ký tại đây</Link></span>
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
