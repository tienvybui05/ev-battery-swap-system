import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./PriceList.module.css";
import Button from "../../../components/Shares/Button/Button.js";

function PriceList() {
  const [goiDichVu, setGoiDichVu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiperKey, setSwiperKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoi, setSelectedGoi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chỉ lấy danh sách gói dịch vụ
        const resGoi = await fetch("/api/subscription-service/goidichvu");
        if (!resGoi.ok) throw new Error("Không thể tải danh sách gói dịch vụ");
        const dataGoi = await resGoi.json();
        setGoiDichVu(dataGoi);
        
        setTimeout(() => {
          setSwiperKey(prev => prev + 1);
        }, 100);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // HÀM KIỂM TRA TRỰC TIẾP TRONG DATABASE
  const kiemTraGoiConHan = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return false;

    try {
      // KIỂM TRA TRỰC TIẾP TRONG DATABASE
      const resCheck = await fetch(`/api/subscription-service/lichsudangkygoi/taixe/${userId}/kiemtra`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (resCheck.ok) {
        const { coGoiConHan } = await resCheck.json();
        return coGoiConHan;
      }
    } catch (error) {
      console.error("Lỗi kiểm tra:", error);
    }
    
    return false;
  };

  const handleDangKy = async (goi) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      alert("Vui lòng đăng nhập để đăng ký gói dịch vụ!");
      navigate("/login");
      return;
    }
    
    if (userRole !== "TAIXE") {
      alert("Chỉ tài xế mới có thể đăng ký gói dịch vụ!");
      return;
    }

    // KIỂM TRA TRỰC TIẾP TRONG DATABASE - LUÔN MỚI NHẤT
    const coGoiConHan = await kiemTraGoiConHan();
    if (coGoiConHan) {
      alert("Bạn đang có gói dịch vụ còn hạn. Vui lòng đợi hết hạn để đăng ký gói mới!");
      return;
    }

    // NẾU KHÔNG CÓ GÓI CÒN HẠN, HIỆN MODAL
    setSelectedGoi(goi);
    setShowModal(true);
  };

  const handleXacNhanDangKy = async () => {
    setLoading(true);
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      // Gọi API lưu lịch sử đăng ký
      const res = await fetch("/api/subscription-service/lichsudangkygoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          maTaiXe: parseInt(userId),
          maGoi: selectedGoi.maGoi,
          trangThai: "DANG_SU_DUNG"
        }),
      });

      if (!res.ok) {
        throw new Error("Đăng ký thất bại");
      }

      const data = await res.json();
      console.log("Đăng ký thành công:", data);
      
      alert("Đăng ký gói dịch vụ thành công!");
      setShowModal(false);
      setSelectedGoi(null);

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHuyDangKy = () => {
    setShowModal(false);
    setSelectedGoi(null);
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Chúng tôi cung cấp mức giá cao cấp phải chăng.</span>
          <p>Chọn gói phù hợp nhất với nhu cầu lái xe của bạn</p>
        </div>
        
        <div className={styles.swiperWrapper}>
          <Swiper
            key={swiperKey}
            modules={[Pagination]}
            spaceBetween={24}
            slidesPerView={3}
            pagination={{ clickable: true }}
            loop={goiDichVu.length > 1}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className={styles.myswiper}
          >
            {goiDichVu.map((item) => (
              <SwiperSlide key={item.maGoi} className={styles.card}>
                <span className={styles.name}>{item.tenGoi}</span>
                <div className={styles.price}>
                  {item.gia?.toLocaleString('vi-VN')}
                  <span>/vnđ</span>
                </div>
                <span className={styles.describe}>{item.moTa}</span>
                <span className={styles.numberOfChanges}>
                  Số lần đổi: {item.soLanDoi}
                </span>
                <span className={styles.numberOfChanges}>
                  Thời gian: {item.thoiGianDung} ngày
                </span>
                
                {/* NÚT VẪN HIỆN BÌNH THƯỜNG */}
                <Button 
                  primary 
                  onClick={() => handleDangKy(item)}
                >
                  Đăng ký gói
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* MODAL XÁC NHẬN ĐĂNG KÝ */}
      {showModal && selectedGoi && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận đăng ký</h3>
              <button 
                className={styles.closeButton}
                onClick={handleHuyDangKy}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <p>Bạn có chắc muốn đăng ký gói:</p>
              <div className={styles.goiInfo}>
                <h4>{selectedGoi.tenGoi}</h4>
                <div className={styles.modalPrice}>
                  {selectedGoi.gia?.toLocaleString('vi-VN')} VNĐ
                </div>
                <div className={styles.modalDetails}>
                  <span>Thời gian: {selectedGoi.thoiGianDung} ngày</span>
                  <span>Số lần đổi: {selectedGoi.soLanDoi}</span>
                  <span>{selectedGoi.moTa}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button 
                outline 
                onClick={handleHuyDangKy}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button 
                primary 
                onClick={handleXacNhanDangKy}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đăng ký"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceList;