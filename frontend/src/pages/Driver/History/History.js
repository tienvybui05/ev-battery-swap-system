import styles from "./History.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryEmpty } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Shares/Button/Button";
function History() {
    const historyList = [
        {
            id: 1,
            stationName: "Trạm Metro Ba Son",
            date: "12/10/2025 lúc 14:30",
            price: "125.000VNĐ",
            status: "hoàn thành",
        },
        {
            id: 2,
            stationName: "Trạm EV Nguyễn Văn Linh",
            date: "10/10/2025 lúc 16:45",
            price: "130.000VNĐ",
            status: "hoàn thành",
        },
        {
            id: 3,
            stationName: "Trạm Điện Máy Xanh Thủ Đức",
            date: "08/10/2025 lúc 09:10",
            price: "120.000VNĐ",
            status: "đang xử lý",
        },
        {
            id: 4,
            stationName: "Trạm EV Hùng Vương",
            date: "05/10/2025 lúc 19:20",
            price: "140.000VNĐ",
            status: "đã hủy",
        },
    ];
    return (
        <nav className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Lịch Sử Thay Pin</h1>
                <p>Lần thay pin gần đây và giao dịch của bạn</p>
            </div>
            <div>
                {historyList.map((item) => (
                    <div key={item.id} className={styles.orderhistory}>
                        <div className={styles.statoninfo}>
                            <FontAwesomeIcon icon={faBatteryEmpty} className={styles.faBatteryEmpty} />
                            <div className={styles.addresstime}>
                                <h1>{item.stationName}</h1>
                                <p>{item.date}</p>
                            </div>
                        </div>
                        <div className={styles.pricestatus}>
                            <p className={styles.price}>{item.price}</p>
                            <p className={styles.status}>{item.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button white blackoutline className={styles.button}>Tải Lịch Sử Thêm</Button>
        </nav>
    )
}
export default History;