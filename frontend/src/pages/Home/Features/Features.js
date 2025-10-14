import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBoltLightning,
  faBatteryFull,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Features.module.css";
import vinfastLuxSa from "../../../assets/vinfastLuxSa.png";
function Features() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Tính năng mạnh mẽ</span>
          <p>
           VinNhot mang đến cho bạn lợi thế với các công cụ tiên tiến được thiết kế dành cho cả người mới bắt đầu và nhà giao dịch chuyên nghiệp.
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.card}>
            <FontAwesomeIcon
              icon={faBoltLightning}
              className={styles.faBoltLightning}
            />
            <span>Sạc Nhanh Tức Thì</span>
            <p>
              Sạc đầy pin trong vòng 20–30 phút với công nghệ sạc nhanh tiên
              tiến – tiết kiệm thời gian cho mọi hành trình
            </p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon
              icon={faBatteryFull}
              className={styles.faBatteryFull}
            />
            <span>Luôn Sẵn Sàng</span>
            <p>
              Sạc đầy pin trong vòng 20–30 phút với công nghệ sạc nhanh tiên
              tiến – tiết kiệm thời gian cho mọi hành trình
            </p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon
              icon={faLocationDot}
              className={styles.faLocationDot}
            />
            <span>Phủ Sóng Toàn Quốc</span>
            <p>
              Hơn 30 trạm và đang mở rộng tại các thành phố lớn, trung tâm
              thương mại và tuyến cao tốc
            </p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon
              icon={faUserShield}
              className={styles.faUserShield}
            />
            <span>An Toàn & Tin Cậy</span>
            <p>
              Tất cả trạm sạc được kiểm định nghiêm ngặt, đảm bảo an toàn điện
              và hiệu suất tối ưu cho xe của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Features;
