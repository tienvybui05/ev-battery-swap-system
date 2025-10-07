import { Link } from "react-router";
import styles from "./Header.module.css";
import Button from "../../../Shares/Button/Button";
import logo from "../../../../assets/logo/logo.svg";
function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.brand}>
        <Link to="/">
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <span>VinNhot</span>
        </Link>
      </div>
      <nav className={styles.navbar}>
        <Link to="/">Trang chủ</Link>
        <Link to="/">Bảng giá</Link>
        <Link to="/">Trạm</Link>
        <Link to="/">Liên hệ</Link>
      </nav>
      <div className={styles.actions}>
        <Button text>Đăng nhập</Button>
        <Button primary>Đăng ký</Button>
      </div>
    </header>
  );
}
export default Header;
