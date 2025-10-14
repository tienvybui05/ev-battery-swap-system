import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";
import styles from "./Header.module.css";
import logo from "../../../../assets/logo/logo.svg";
import LinkButton from "../../../Shares/LinkButton/LinkButton";
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
        <ScrollLink
          to="about-section"
          smooth={true}
          duration={600}
          offset={-80}
          spy={true}
        >
          Giới thiệu
        </ScrollLink>

        <ScrollLink
          to="price-section"
          smooth={true}
          duration={600}
          offset={-80}
          spy={true}
        >
          Bảng giá
        </ScrollLink>

        <ScrollLink
          to="feedback-section"
          smooth={true}
          duration={600}
          offset={-80}
          spy={true}
        >
          Đánh giá
        </ScrollLink>
      </nav>
      <div className={styles.actions}>
        <LinkButton to="/login" text>
          Đăng nhập
        </LinkButton>
        <LinkButton to="/dashboard" primary>
          Đăng ký
        </LinkButton>
      </div>
    </header>
  );
}
export default Header;
