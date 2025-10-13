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
    const stations = [
        {
            id: 1,
            name: "Trạm Giao Thông Vận Tải",
            address: "70 Tô Ký, Quận 12, TP.HCM",
            battery: "12/20",
            time: "5 min",
            distance: "0.8 km",
            rating: 4,
            price: "150.000VNĐ/Đổi",
            status: "mở",
        },
        {
            id: 2,
            name: "Trạm EV Quận 1",
            address: "15 Nguyễn Huệ, Quận 1, TP.HCM",
            battery: "9/20",
            time: "8 min",
            distance: "1.2 km",
            rating: 5,
            price: "155.000VNĐ/Đổi",
            status: "mở",
        },
        {
            id: 3,
            name: "Trạm EV Quận 7",
            address: "65 Nguyễn Văn Linh, Quận 7, TP.HCM",
            battery: "14/20",
            time: "12 min",
            distance: "3.1 km",
            rating: 4,
            price: "160.000VNĐ/Đổi",
            status: "đang bảo trì",
        },
    ];
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

                {stations.map((stations) => (
                    <div key={stations.id} className={styles.station}>
                        <div className={styles.local}>
                            <h3>{stations.name}</h3>
                            <p className={`${styles.state} ${stations.status === "đang bảo trì"
                                ? styles.maintenance
                                : ""
                                }`}>
                                {stations.status}
                            </p>
                        </div>
                        <p className={styles.address}>{stations.address}</p>
                        <div className={styles.information}>
                            <div className={styles.iconinfo}>
                                <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                                <p>{stations.battery} pin</p>
                            </div>
                            <div className={styles.iconinfo}>
                                <FontAwesomeIcon icon={faClock} className={styles.faClock} />
                                <p>{stations.time}</p>
                            </div>
                            <div className={styles.iconinfo}>
                                <FontAwesomeIcon icon={faLocationDot} className={styles.faLocation} />
                                <p>{stations.distance}</p>
                            </div>
                            <div className={styles.iconinfo}>
                                <FontAwesomeIcon icon={faStar} className={styles.faStar} />
                                <p>{stations.rating} sao</p>
                            </div>
                        </div>
                        <div className={styles.price}>
                            <p>{stations.price}</p>
                            <Button order>Đặt chỗ</Button>
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    )

}
export default FindStation