import LinkButton from "../../../components/Shares/LinkButton/LinkButton";
import styles from "./AboutMe.module.css";
import vf3yellow from "../../../assets/vf3yellow.png";
import tramsac from "../../../assets/tramsac.png";
function AboutMe() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.title}>
            Trạm Thay Pin EV Nhanh Chóng và Đáng Tin Cậy
          </span>
          <p className={styles.describe}>
            Bỏ qua thời gian chờ, thay pin ngay. Quay lại đường trong vòng chưa
            đầy 3 phút với công nghệ thay pin cách mạng của chúng tôi.
          </p>
          <div className={styles.action}>
            <LinkButton to="/" primary>
              Tìm trạm
            </LinkButton>
          </div>
          <div className={styles.statistical}>
            <div className={styles.box}>
              <span>10</span>
              <p>Trạm</p>
            </div>
            <div className={styles.box}>
              <span>10</span>
              <p>Tài xế</p>
            </div>
            <div className={styles.box}>
              <span>10</span>
              <p>Lần thay pin</p>
            </div>
          </div>
        </div>
        <div className={styles.imageHome}>
          <img src={tramsac} alt="Trạm sạc" className={styles.animation} />
          <img src={vf3yellow} alt="Ảnh trang chủ"  className={styles.imgprimary} />
        </div>
      </div>
    </div>
  );
}
export default AboutMe;
