import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/Shares/Button/Button";
import styles from "./Information.module.css";
import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
function Information() {
    return (
        <nav className={styles.wrapper}>
            <div className={styles.userdatail}>
                <div className={styles.header}>
                    <h1>Thông Tin Hồ Sơ</h1>
                </div>
                <form className={styles.form}>
                    <div className={styles.formdetail}>
                        <label for="name">Tên Đầy Đủ</label>
                        <input id="name" type="text" placeholder="Tìm trạm" />
                    </div>
                    <div className={styles.formdetail}>
                        <label for="email">Email</label>
                        <input id="email" type="text" placeholder="abc123@gmail.com" />
                    </div>
                    <div className={styles.formdetail}>
                        <label for="phone">Số Điện Thoại</label>
                        <input id="phone" type="text" placeholder="0912345678" />
                    </div>
                    <Button change>Lưu Thay Đổi</Button>
                </form>
            </div>
            <div className={styles.cardetail}>
                <div className={styles.header}>
                    <h1>Xe Của Tôi</h1>
                    <p>Quản lý xe đã đăng ký</p>
                </div>
                <div className={styles.carname}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faCarSide} className={styles.faCarSide} />
                        <div className={styles.namevin}>
                            <p className={styles.name}>Honda civic</p>
                            <p className={styles.vin}>VIN: APOOOT13456</p>
                        </div>
                    </div>
                    <Button icon><FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} /></Button>
                </div>
                <div className={styles.carname}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faCarSide} className={styles.faCarSide} />
                        <div className={styles.namevin}>
                            <p className={styles.name}>Honda civic</p>
                            <p className={styles.vin}>VIN: APOOOT13456</p>
                        </div>
                    </div>
                    <Button icon><FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} /></Button>
                </div>
                <div className={styles.carname}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faCarSide} className={styles.faCarSide} />
                        <div className={styles.namevin}>
                            <p className={styles.name}>Honda civic</p>
                            <p className={styles.vin}>VIN: APOOOT13456</p>
                        </div>
                    </div>
                    <Button icon><FontAwesomeIcon icon={faPenToSquare} className={styles.iconbutton} /></Button>
                </div>
                <LinkButton to="./dashboard" oulineBlack>Thêm xe</LinkButton>
            </div>
        </nav>
    )
}
export default Information;