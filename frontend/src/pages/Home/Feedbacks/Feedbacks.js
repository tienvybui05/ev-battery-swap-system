import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useState, useEffect } from "react";
import styles from "./Feedbacks.module.css";

function Feedbacks() {
  const [listFeedback, setListFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách feedback từ API
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback-service/danhgia');
      if (response.ok) {
        const data = await response.json();
        setListFeedback(data);
      } else {
        console.error('Lỗi khi lấy danh sách feedback');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Hàm render số sao
  const renderStars = (soSao) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= soSao ? styles.starFilled : styles.starEmpty}
        >
          {i <= soSao ? '★' : '☆'}
        </span>
      );
    }
    return <div className={styles.starsContainer}>{stars}</div>;
  };

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải đánh giá...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Khách Hàng Nói Gì Về Chúng Tôi</span>
          <p>Tham gia cùng hàng nghìn tài xế EV hài lòng</p>
        </div>
        
        {listFeedback.length === 0 ? (
          <div className={styles.noFeedback}>
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
          </div>
        ) : (
          <div className={styles.swiperWrapper}>
            <Swiper
              modules={[Pagination]}
              spaceBetween={24}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              loop={listFeedback.length > 3}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className={styles.myswiper}
            >
              {listFeedback.map((item) => (
                <SwiperSlide key={item.maDanhGia} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.name}>Khách hàng #{item.maDanhGia}</span>
                    {renderStars(item.soSao)}
                  </div>
                  <p className={styles.contentFeedback}>{item.noiDung}</p>
                  <div className={styles.date}>
                    {formatDate(item.ngayDanhGia)}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedbacks;