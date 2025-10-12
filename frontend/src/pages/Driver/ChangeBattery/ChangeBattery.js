import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ChangeBattery.module.css";
import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Shares/Button/Button";
function ChangeBattery() {
    return (
        <nav className={styles.wrapper}>

            <div className={styles.orderplace}>
                <div className={styles.header}>
                    <h1>Đặt Chỗ Hoạt Động</h1>
                    <p>Đơn đặt pin hiện tại của bạn</p>
                </div>
                <div className={styles.info}>
                    <p className={styles.status}>Đã xác nhận</p>
                    <h3>Trạm metro bason</h3>
                    <p className={styles.time}>Hôm nay lúc 14:30</p>
                </div>
                <div className={styles.orderid}>
                    <FontAwesomeIcon icon={faMapLocationDot} className={styles.faMapLocationDot} />
                    <p>Mã đơn đặt chỗ</p>
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
                        <h1>Đăng ký tháng</h1>
                        <p>Hoạt Động</p>
                    </div>
                    <div className={styles.change}>
                        <p>Lần Thay Đã Sử Dụng</p>
                        <p>24/60</p>
                    </div>
                    <div className={styles.progresscontainer}>
                        <div className={styles.progressbar} style={{ width: "40%" }}></div>
                    </div>
                    <div className={styles.nextorder}>
                        <p>Hóa Đơn Tiếp Theo</p>
                        <p>12/10/2025</p>
                    </div>
                </div>
                <Button white blackoutline className={styles.button}>Quản Lý Gói</Button>
            </div>
        </nav>
    )
}
export default ChangeBattery;