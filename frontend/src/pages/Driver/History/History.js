import styles from "./History.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryEmpty } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Shares/Button/Button";
function History() {
    return (
        <nav className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Lịch Sử Thay Pin</h1>
                <p>Lần thay pin gần đây và giao dịch của bạn</p>
            </div>
            <div>
                <div className={styles.orderhistory}>
                    <div className={styles.statoninfo}>
                        <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                        <div className={styles.addresstime}>
                            <h1>Trạm metro bason</h1>
                            <p>12/10/2025 lúc 14:30</p>
                        </div>
                    </div>
                    <div className={styles.pricestatus}>
                        <p className={styles.price}>125.000VNĐ</p>
                        <p className={styles.status}>hoàn thành</p>
                    </div>
                </div>
                <div className={styles.orderhistory}>
                    <div className={styles.statoninfo}>
                        <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                        <div className={styles.addresstime}>
                            <h1>Trạm metro bason</h1>
                            <p>12/10/2025 lúc 14:30</p>
                        </div>
                    </div>
                    <div className={styles.pricestatus}>
                        <p className={styles.price}>125.000VNĐ</p>
                        <p className={styles.status}>hoàn thành</p>
                    </div>
                </div>
                <div className={styles.orderhistory}>
                    <div className={styles.statoninfo}>
                        <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                        <div className={styles.addresstime}>
                            <h1>Trạm metro bason</h1>
                            <p>12/10/2025 lúc 14:30</p>
                        </div>
                    </div>
                    <div className={styles.pricestatus}>
                        <p className={styles.price}>125.000VNĐ</p>
                        <p className={styles.status}>hoàn thành</p>
                    </div>
                </div>
            </div>
            <Button white blackoutline className={styles.button}>Tải Lịch Sử Thêm</Button>
        </nav>
    )
}
export default History;