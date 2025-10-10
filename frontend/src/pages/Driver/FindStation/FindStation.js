import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import Button from "../../../components/Shares/Button/Button";
import styles from "./FindStation.module.css";
function FindStation() {
    return (
        <nav className={styles.wrapper}>
            <div className={styles.nearstation}>
                <div className={styles.header}>
                    <h1>Trạm gần đây</h1>
                    <p>Tìm và đặt chỗ các trạm đổi pin</p>
                </div>

                <div className={styles.map}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.faLocationDot} />

                </div>
                <LinkButton to="./dashboard" black >Sử dụng vị trí của tôi</LinkButton>
            </div>
            <div className={styles.alreadystation}>
                <div className={styles.header}>
                    <h1>Trạm có sẵn</h1>
                    <div className={styles.filter}>
                        <Button text blackoutline small>Lọc</Button>
                        <div className={styles.input}>
                            <label><FontAwesomeIcon icon={faMagnifyingGlass} className={styles.faMagnifyingGlass} /></label>
                            <input type="text" placeholder="Tìm trạm" />
                        </div>
                    </div>
                </div>
                <div className={styles.station}>
                    <h1>Dh giao thông vận tải</h1>
                    <p>70 tô ký</p>
                </div>
            </div>
        </nav>
    )

}
export default FindStation