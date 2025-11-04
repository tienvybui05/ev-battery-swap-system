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

    const getDistances = async (userLat, userLng, stationList) => {
        const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjczNWNlN2JlMWEwYzQ2YjVhY2JjOGQ5N2VjN2FiMzhlIiwiaCI6Im11cm11cjY0In0="; // 👈 dán key bạn copy ở đây
        const updated = [];

        for (const st of stationList) {
            try {
                const res = await axios.post(
                    "https://api.openrouteservice.org/v2/directions/driving-car",
                    {
                        coordinates: [
                            [userLng, userLat], // điểm đầu (người dùng)
                            [st.lng, st.lat],   // điểm đích (trạm)
                        ],
                    },
                    {
                        headers: {
                            Authorization: apiKey,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const distanceKm = res.data.routes[0].summary.distance / 1000; // mét → km
                updated.push({
                    ...st,
                    distance: distanceKm.toFixed(2),
                });
            } catch (err) {
                console.error("Lỗi khi gọi ORS:", err);
                updated.push(st);
            }
        }

        // sắp xếp trạm gần nhất trước
        updated.sort((a, b) => a.distance - b.distance);
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

    // const stations = [
    //     {
    //         id: 1,
    //         name: "Trạm Giao Thông Vận Tải",
    //         address: "70 Tô Ký, Quận 12, TP.HCM",
    //         battery: "12/20",
    //         time: "5 min",
    //         distance: "0.8 km",
    //         rating: 4,
    //         price: "150.000VNĐ/Đổi",
    //         status: "mở",
    //     },
    //     {
    //         id: 2,
    //         name: "Trạm EV Quận 1",
    //         address: "15 Nguyễn Huệ, Quận 1, TP.HCM",
    //         battery: "9/20",
    //         time: "8 min",
    //         distance: "1.2 km",
    //         rating: 5,
    //         price: "155.000VNĐ/Đổi",
    //         status: "mở",
    //     },
    //     {
    //         id: 3,
    //         name: "Trạm EV Quận 7",
    //         address: "65 Nguyễn Văn Linh, Quận 7, TP.HCM",
    //         battery: "14/20",
    //         time: "12 min",
    //         distance: "3.1 km",
    //         rating: 4,
    //         price: "160.000VNĐ/Đổi",
    //         status: "đang bảo trì",
    //     },
    // ];
    const [stations, setStations] = useState([
        {
            id: 1,
            name: "Trạm Giao Thông Vận Tải",
            address: "70 Tô Ký, Quận 12, TP.HCM",
            lat: 10.848092,
            lng: 106.717947,
        },
        {
            id: 2,
            name: "Trạm EV Quận 1",
            address: "15 Nguyễn Huệ, Quận 1, TP.HCM",
            lat: 10.774862,
            lng: 106.703018,
        },
        {
            id: 3,
            name: "Trạm EV Quận 7",
            address: "65 Nguyễn Văn Linh, Quận 7, TP.HCM",
            lat: 10.732555,
            lng: 106.721665,
        },
    ]);
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

                {/* 🔹 Hiển thị vị trí hoặc lỗi */}
                {location.lat && (
                    <p>
                        📍 Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
                    </p>
                )}
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