import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination } from "swiper/modules";
import styles from "./PriceList.module.css";
import Button from "../../../components/Shares/Button/Button.js";
function PriceList() {
  const batteryPack = [
    {
      id: "1",
      name: "Gói 1 tháng",
      describe: "Chỉ trả khi thay pin, Truy cập tất cả các trạm",
      price: 100000,
      numberOfChanges: 8,
      usageTime: 1,
    },
    {
      id: "2",
      name: "Gói 2 tháng",
      describe: "Chỉ trả khi thay pin, Truy cập tất cả các trạm",
      price: 100000,
      numberOfChanges: 8,
      usageTime: 1,
    },
    {
      id: "3",
      name: "Gói 3 tháng",
      describe: "Chỉ trả khi thay pin, Truy cập tất cả các trạm",
      price: 100000,
      numberOfChanges: 8,
      usageTime: 1,
    },
    {
      id: "4",
      name: "Gói 4 tháng",
      describe: "Chỉ trả khi thay pin, Truy cập tất cả các trạm",
      price: 100000,
      numberOfChanges: 8,
      usageTime: 1,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Chúng tôi cung cấp mức giá cao cấp phải chăng.</span>
          <p>Chọn gói phù hợp nhất với nhu cầu lái xe của bạn</p>
        </div>
        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[ Pagination]}
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
            {batteryPack.map((item, index) => {
              return (
                <SwiperSlide key={index} className={styles.card}>
                  <span className={styles.name}>{item.name}</span>
                  <div className={styles.price}>
                    {item.price}
                    <span>/vnđ</span>
                  </div>
                  <span className={styles.describe}>{item.describe}</span>
                  <span className={styles.numberOfChanges}>
                    Số lần đổi {item.numberOfChanges}
                  </span>
                  <Button primary>Đăng ký gói</Button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
export default PriceList;
