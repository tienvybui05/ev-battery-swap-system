import styles from "./Support.module.css"
import Button from "../../../components/Shares/Button/Button";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
function Support() {
    return (
        <nav className={styles.wrapper}>
            <div className={styles.contactsupport}>
                <div className={styles.header}>
                    <h1>Liên Hệ Hỗ Trợ</h1>
                    <p>Nhận trợ giúp với trải nghiệm Vinnhot của bạn</p>
                </div>
                <div className={styles.button}>
                    <Button white blackoutline> <FontAwesomeIcon icon={faPhone} className={styles.icon} />Gọi Hỗ Trợ</Button>
                    <Button white blackoutline><FontAwesomeIcon icon={faCircleExclamation} className={styles.icon} />Báo Lỗi</Button>
                </div>
            </div>
            <div className={styles.security}>
                <div className={styles.header}>
                    <h1>An Toàn & Bảo Mật</h1>
                    <p>Cài đặt bảo mật tài khoản</p>
                </div>
                <div className={styles.button}>
                    <Button white blackoutline><FontAwesomeIcon icon={faShield} className={styles.icon} />Xác Thực Hai Lần</Button>
                    <Button white blackoutline><FontAwesomeIcon icon={faGear} className={styles.icon} />Thay Mất Khẩu</Button>
                </div>
            </div>
        </nav>
    )
}
export default Support;