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
const menu = {
    driver: [
      {
        title: "Tìm trạm",
        href: "/dashboard/findstation",
        icon: <FontAwesomeIcon icon={faLocationDot} />,
      },
      {
        title: "Thay pin",
        href: "/dashboard/changebattery",
        icon: <FontAwesomeIcon icon={faBatteryFull} />,
      },
      {
        title: "Lịch sử",
        href: "/dashboard/history",
        icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
      },
      {
        title: "Hồ sơ",
        href: "/dashboard/information",
        icon: <FontAwesomeIcon icon={faCircleUser} />,
      },
      {
        title: "Hổ trợ",
        href: "/dashboard/support",
        icon: <FontAwesomeIcon icon={faPhone} />,
      },
    ],
    admin: [
      {
        title: "Tổng quan",
        href: "/dashboard/overview",
        icon: <FontAwesomeIcon icon={faGlobe} />,
      },
      {
        title: "Trạm",
        href: "/dashboard/stations",
        icon: <FontAwesomeIcon icon={faChargingStation} />,
      },
      {
        title: "Pin",
        href: "/dashboard/batteries",
        icon: <FontAwesomeIcon icon={faBatteryFull} />,
      },
      {
        title: "Nhân viên",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faUserTie} />,
      },
      {
        title: "Khách hàng",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faUsers} />,
      },
      {
        title: "Cảnh báo",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faComment} />,
      },
    ],

    staff: [
      {
        title: "Quản lý hàng chờ",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faGlobe} />,
      },
      {
        title: "Kho hàng",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faChargingStation} />,
      },
      {
        title: "Giao dịch",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faUserTie} />,
      },
      {
        title: "Báo cáo",
        href: "/dashboard",
        icon: <FontAwesomeIcon icon={faUsers} />,
      },
    ],
  }
  export default menu;