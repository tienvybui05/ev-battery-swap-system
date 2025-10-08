import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons"
import styles from "./Header.module.css";
function Header({onClickSidebar}) {
  return <header className={styles.wrapper}>
    <FontAwesomeIcon icon={faBars}  onClick={onClickSidebar}/>
    header</header>;
}
export default Header;
