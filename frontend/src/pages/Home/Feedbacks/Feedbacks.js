import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "./Feedbacks.module.css";
const listFeedback = [
  {
    id: 1,
    name: "Đinh Quốc Đạt",
    content: "ABDCASCSASDSADDDDDDDDDASD",
  },
  {
    id: 1,
    name: "Đinh Quốc Đạt",
    content: "ABDCASCSASDSADDDDDDDDDASD",
  },
  {
    id: 1,
    name: "Đinh Quốc Đạt",
    content: "ABDCASCSASDSADDDDDDDDDASD",
  },
  {
    id: 1,
    name: "Đinh Quốc Đạt",
    content: "llllllllllllllllllllllllllllllllllll856uujjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
  },
  {
    id: 1,
    name: "Đinh Quốc Đạt",
    content: "ABDCASCSASDSADDDDDDDDDASD",
  },
];
function Feedbacks() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Khách Hàng Nói Gì Về Chúng Tôi</span>
          <p>Tham gia cùng hàng nghìn tài xế EV hài lòng</p>
        </div>
        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Pagination]}
            spaceBetween={24}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className={styles.myswiper}
          >
          {listFeedback .map((item, index) => {
              return (
                <SwiperSlide key={index} className={styles.card}>
                  <span className={styles.name}>{item.name}</span>
                  <p className={styles.contentFeedback}>{item.content}</p>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
export default Feedbacks;
