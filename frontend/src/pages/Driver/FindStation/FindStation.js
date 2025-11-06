import { useEffect } from "react";
import axios from "axios";
import MapLeaflet from "../../../components/Map/MapLeaflet";
import { useState } from "react";
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
    // 🔹 Bước 1: Khai báo state để lưu vị trí người dùng
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [error, setError] = useState(null);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDistances = async (userLat, userLng, stationList) => {
        const apiKey =
            "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjczNWNlN2JlMWEwYzQ2YjVhY2JjOGQ5N2VjN2FiMzhlIiwiaCI6Im11cm11cjY0In0=";

        // 🔹 Kiểm tra xem trạm có tọa độ hợp lệ hay không
        const isValidCoord = (lat, lng) =>
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180;

        // 🔹 Tạo danh sách promise cho tất cả trạm hợp lệ
        const promises = stationList.map(async (st) => {
            // Bỏ qua trạm lỗi tọa độ
            if (!isValidCoord(st.lat, st.lng)) {
                return { ...st, distance: "N/A", time: "N/A", error: true };
            }

            try {
                const res = await axios.post(
                    "https://api.openrouteservice.org/v2/directions/driving-car",
                    {
                        coordinates: [
                            [userLng, userLat], // người dùng
                            [st.lng, st.lat], // trạm
                        ],
                    },
                    {
                        headers: {
                            Authorization: apiKey,
                            "Content-Type": "application/json",
                        },
                        timeout: 8000, // ⏱ giới hạn 8s để tránh “chờ vô tận”
                    }
                );

                const summary = res.data.routes[0].summary;
                const distanceKm = summary.distance / 1000; // m → km
                const durationMin = Math.ceil(summary.duration / 60); // s → phút

                return {
                    ...st,
                    distance: `${distanceKm.toFixed(2)} km`,
                    time: `${durationMin} phút`,
                };
            } catch (err) {
                console.error("Lỗi khi gọi ORS:", st.name, err.message);
                return { ...st, distance: "N/A", time: "N/A", error: true };
            }
        });

        // 🔹 Chờ tất cả hoàn tất (dù lỗi hay thành công)
        const results = await Promise.allSettled(promises);

        // 🔹 Lấy giá trị fulfilled hoặc rejected đã xử lý ở trên
        const updated = results.map((r) =>
            r.status === "fulfilled" ? r.value : { distance: "N/A", time: "N/A" }
        );

        // 🔹 Sắp xếp trạm gần nhất trước (lọc các trạm hợp lệ)
        updated.sort((a, b) => {
            const da = parseFloat(a.distance);
            const db = parseFloat(b.distance);
            if (isNaN(da)) return 1;
            if (isNaN(db)) return -1;
            return da - db;
        });

        // 🔹 Cập nhật lại state
        setStations(updated);
    };


    // 🔹 Bước 2: Hàm xử lý khi nhấn "Sử dụng vị trí của tôi"
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError("Trình duyệt của bạn không hỗ trợ định vị.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                console.log("📍 Vị trí hiện tại:", latitude, longitude);

                getDistances(latitude, longitude, stations);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Bạn đã từ chối quyền truy cập vị trí.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Không thể xác định vị trí hiện tại.");
                        break;
                    case err.TIMEOUT:
                        setError("Yêu cầu lấy vị trí quá thời gian cho phép.");
                        break;
                    default:
                        setError("Lỗi không xác định.");
                }
            }
        );
    };

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await axios.get("/api/station-service/tram");
                const formatted = res.data.map((st, idx) => ({
                    id: st.maTram || idx,
                    name: st.tenTram,
                    address: st.diaChi,
                    lat: parseFloat(st.viDo),
                    lng: parseFloat(st.kinhDo),
                    status: st.trangThai,
                    battery: st.soLuongPinToiDa || 0,
                }));
                setStations(formatted);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải danh sách trạm:", err);
                setError("Không thể tải danh sách trạm");
                setLoading(false);
            }
        };

        fetchStations();
    }, []);
    if (loading) return <p>Đang tải dữ liệu trạm...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;


    // 🔹 Hàm xử lý khi người dùng bấm "Đặt chỗ"
    const handleBooking = async (stationId) => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("⚠️ Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!");
                return;
            }

            const body = {
                maTaiXe: Number(userId),
                maTram: Number(stationId),
            };

            const response = await axios.post("/api/station-service/dat-lich", body);

            if (response.status === 200) {
                alert("✅ Đặt lịch thành công!");
                console.log("Kết quả:", response.data);
            } else {
                alert("❌ Không thể đặt lịch. Thử lại sau!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt lịch:", error);
            alert("❌ Đặt lịch thất bại: " + (error.response?.data || error.message));
        }
    };

    return (
        <nav className={styles.wrapper}>
            <div className={styles.nearstation}>
                <div className={styles.header}>
                    <h1>Trạm gần đây</h1>
                    <p>Tìm và đặt chỗ các trạm đổi pin</p>
                </div>

                <div className={styles.map}>
                    <MapLeaflet userLocation={location} stations={stations} />
                </div>

                {/* 🔹 Nút gọi hàm lấy vị trí */}
                <Button order onClick={handleGetLocation}>
                    Sử dụng vị trí của tôi
                </Button>

                {error && <p style={{ color: "red" }}>{error}</p>}
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
                            <p
                                className={`${styles.state} ${styles[
                                    stations.status === "Hoạt động"
                                        ? "open"
                                        : stations.status === "Bảo trì"
                                            ? "maintenance"
                                            : "offline"
                                ]}`}
                            >
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
                            <Button order onClick={() => handleBooking(stations.id)}>
                                Đặt chỗ
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    )

}
export default FindStation