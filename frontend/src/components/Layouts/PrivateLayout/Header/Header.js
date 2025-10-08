import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import LinkButton from "../../../Shares/LinkButton/LinkButton";
function Header({ onClickSidebar }) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <FontAwesomeIcon icon={faBars} onClick={onClickSidebar} />
        <span className={styles.title}>Trang cá nhân</span>
      </div>
      <div className={styles.right}>
        <LinkButton to="/" oulineBlack>
          Đăng xuất
        </LinkButton>
      </div>
    </header>
  );
}
export default Header;
