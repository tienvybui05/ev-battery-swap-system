import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ChangeBattery.module.css";
import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Shares/Button/Button";
function ChangeBattery() {
    const order = {
        status: "Chờ xác nhận",
        stationName: "Trạm Metro Ba Son",
        time: "Hôm nay lúc 14:30",
        orderCode: "ORD-20251013-001"
    };

    const packageInfo = {
        packageName: "Đăng ký tháng",
        status: "Hoạt động",
        used: 30,     // số lần đã sử dụng
        total: 60,    // tổng số lần trong gói
        nextBillDate: "12/11/2025"
    };
    const progressPercent = (packageInfo.used / packageInfo.total) * 100;
    return (
        <nav className={styles.wrapper}>

            <div className={styles.orderplace}>
                <div className={styles.header}>
                    <h1>Đặt Chỗ Hoạt Động</h1>
                    <p>Đơn đặt pin hiện tại của bạn</p>
                </div>
                <div className={styles.info}>
                    <p className={`${styles.status} ${order.status === "Chờ xác nhận" ? styles.pending : ""}`}>
                        {order.status}
                    </p>
                    <h3>{order.stationName}</h3>
                    <p className={styles.time}>{order.time}</p>
                </div>
                <div className={styles.orderid}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={styles.faMapLocationDot} />
                    <p>{order.orderCode}</p>
                </div>
                <LinkButton to="./dashboard" black >Đường đi</LinkButton>
            </div>
            <div className={styles.statusregister}>
                <div className={styles.header}>
                    <h1>Trạng thái đăng ký</h1>
                    <p>Gói và sử dụng hiện tại của bạn</p>
                </div>
                <div>
                    <div className={styles.packagename}>
                        <h1>{packageInfo.packageName}</h1>
                        <p>{packageInfo.status}</p>
                    </div>
                    <div className={styles.change}>
                        <p>Lần Thay Đã Sử Dụng</p>
                        <p>{packageInfo.used}/{packageInfo.total}</p>
                    </div>
                    <div className={styles.progresscontainer}>
                        <div className={styles.progressbar} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className={styles.nextorder}>
                        <p>Hóa Đơn Tiếp Theo</p>
                        <p>{packageInfo.nextBillDate}</p>
                    </div>
                </div>
                <Button white blackoutline className={styles.button}>Quản Lý Gói</Button>
            </div>
        </nav>
    )
}
export default ChangeBattery;