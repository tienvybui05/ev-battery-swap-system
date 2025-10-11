import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBatteryEmpty } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
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
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.faMagnifyingGlass} />
                            <input type="text" placeholder="Tìm trạm" />
                        </div>
                    </div>
                </div>
                <div className={styles.station}>
                    <div className={styles.local}>
                        <h3>Dh giao thông vận tải</h3>
                        <p className={styles.state}>mở</p>
                    </div>
                    <p className={styles.address}>70 tô ký</p>
                    <div className={styles.information}>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                            <p>12/20 pin</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faClock} className={styles.faClock} />
                            <p>5 min</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faLocationDot} className={styles.faLocation} />
                            <p>0.8 km</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faStar} className={styles.faStar} />
                            <p>4 sao</p>
                        </div>
                    </div>
                    <div className={styles.price}>
                        <p>150.000VNĐ/Đổi</p>
                        <Button order>Đặt chỗ</Button>
                    </div>
                </div>
                <div className={styles.station}>
                    <div className={styles.local}>
                        <h3>Dh giao thông vận tải</h3>
                        <p className={styles.state}>mở</p>
                    </div>
                    <p className={styles.address}>70 tô ký</p>
                    <div className={styles.information}>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                            <p>12/20 pin</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faClock} className={styles.faClock} />
                            <p>5 min</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faLocationDot} className={styles.faLocation} />
                            <p>0.8 km</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faStar} className={styles.faStar} />
                            <p>4 sao</p>
                        </div>
                    </div>
                    <div className={styles.price}>
                        <p>150.000VNĐ/Đổi</p>
                        <Button order>Đặt chỗ</Button>
                    </div>
                </div>
                <div className={styles.station}>
                    <div className={styles.local}>
                        <h3>Dh giao thông vận tải</h3>
                        <p className={styles.state}>mở</p>
                    </div>
                    <p className={styles.address}>70 tô ký</p>
                    <div className={styles.information}>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                            <p>12/20 pin</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faClock} className={styles.faClock} />
                            <p>5 min</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faLocationDot} className={styles.faLocation} />
                            <p>0.8 km</p>
                        </div>
                        <div className={styles.iconinfo}>
                            <FontAwesomeIcon icon={faStar} className={styles.faStar} />
                            <p>4 sao</p>
                        </div>
                    </div>
                    <div className={styles.price}>
                        <p>150.000VNĐ/Đổi</p>
                        <Button order>Đặt chỗ</Button>
                    </div>
                </div>
            </div>
        </nav>
    )

}
export default FindStation