import { Link } from "react-router";

import styles from "./Sidebar.module.css";
import logo from "../../../../assets/logo/logo.svg";
import menu from "./menuConfig";
function Sidebar() {
  var role = "staff";
  const currentMenu = menu[role] || [];

  return (
    <nav className={styles.wrapper}>
      <div className={styles.brand}>
        <Link to="/dashboard">
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <span>VinNhot</span>
        </Link>
      </div>
      <div className={styles.content}>
        {currentMenu.map((ojb, index) => (
          <Link key={index} to={ojb.href} className={styles.active}>
            {ojb.icon}
            {ojb.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
export default Sidebar;
