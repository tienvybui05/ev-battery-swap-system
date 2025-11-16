import { useEffect, useState } from "react";
import styles from "./History.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryEmpty, faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Shares/Button/Button";
import axios from "axios";

function History() {

    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatMoney = (value) =>
        value.toLocaleString("vi-VN") + "₫";

    const formatDate = (dateStr) => {
        if (!dateStr) return "--";
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN") + " lúc " + d.toLocaleTimeString("vi-VN");
    };

    const handleReview = (transactionId) => {
        alert(`⭐ Bạn muốn đánh giá giao dịch #${transactionId}`);
        // TODO: mở modal đánh giá
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const token = localStorage.getItem("token");

                if (!userId) return;

                // 1) Lấy mã tài xế
                const taiXeRes = await axios.get(
                    `/api/user-service/taixe/user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const maTaiXe = taiXeRes.data?.maTaiXe;
                if (!maTaiXe) {
                    setHistoryList([]);
                    return;
                }

                // 2) Lấy lịch sử giao dịch (chỉ Đã hoàn thành)
                const res = await axios.get(
                    `/api/transaction-service/giaodichdoipin/tai-xe/${maTaiXe}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const list = res.data.map((gd) => ({
                    id: gd.maGiaoDichDoiPin,
                    stationName: `Trạm #${gd.maTram}`,
                    date: formatDate(gd.ngayGiaoDich),
                    price: formatMoney(gd.thanhtien || 0),
                    status: gd.trangThaiGiaoDich,
                }));

                setHistoryList(list);

            } catch (err) {
                console.error("❌ Lỗi load lịch sử:", err);
                setHistoryList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <nav className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Lịch Sử Thay Pin</h1>
                <p>Các giao dịch thay pin gần đây của bạn</p>
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : historyList.length === 0 ? (
                <p className={styles.empty}>Bạn chưa có giao dịch nào.</p>
            ) : (
                <div className={styles.list}>
                    {historyList.map((item) => (
                        <div key={item.id} className={styles.card}>

                            {/* LEFT: Icon + station */}
                            <div className={styles.left}>
                                <div className={styles.iconBox}>
                                    <FontAwesomeIcon icon={faBatteryEmpty} />
                                </div>

                                <div className={styles.info}>
                                    <h3 className={styles.station}>{item.stationName}</h3>
                                    <p className={styles.date}>{item.date}</p>
                                    <span className={styles.statusTag}>{item.status}</span>
                                </div>
                            </div>

                            {/* RIGHT: Price + Review */}
                            <div className={styles.right}>
                                <p className={styles.price}>{item.price}</p>

                                {item.status === "Đã hoàn thành" && (
                                    <button
                                        className={styles.reviewBtn}
                                        onClick={() => handleReview(item.id)}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                        <span>Đánh giá</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}

export default History;