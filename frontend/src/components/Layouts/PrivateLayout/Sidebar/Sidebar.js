import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBatteryFull,
  faClockRotateLeft,
  faCircleUser,
  faPhone,
  faGlobe,
  faChargingStation,
  faUsers,
  faUserTie,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";
import logo from "../../../../assets/logo/logo.svg";
function Sidebar() {
  var role = "admin";
  const menu = {
    taixe: [
      {
        title: "Tìm trạm",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faLocationDot} />,
      },
      {
        title: "Thay pin",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faBatteryFull} />,
      },
      {
        title: "Lịch sử",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
      },
      {
        title: "Hồ sơ",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faCircleUser} />,
      },
      {
        title: "Hổ trợ",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faPhone} />,
      },
    ],
    admin: [
      {
        title: "Tổng quan",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faGlobe} />,
      },
      {
        title: "Trạm",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faChargingStation} />,
      },
      {
        title: "Nhân viên",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faUserTie} />,
      },
      {
        title: "Khách hàng",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faUsers} />,
      },
      {
        title: "Cảnh báo",
        href: "/manager",
        icon: <FontAwesomeIcon icon={faComment} />,
      },
    ],
  };
  const currentMenu = menu[role] || [];

  return (
    <nav className={styles.wrapper}>
      <div className={styles.brand}>
        <Link to="/">
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
