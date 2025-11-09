import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import axios from 'axios';

function Header({ onClickSidebar, onLogout }) {  // Nhận prop onLogout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Gọi API logout backend
      await axios.post('/api/user-service/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // 🚨 QUAN TRỌNG: CLEAR MỌI THỨ
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      
      // Gọi hàm logout từ component cha
      if (onLogout) {
        onLogout();
      }
      
      // Force reload để clear mọi cache
      window.location.href = '/login';
    }
  };

  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <FontAwesomeIcon icon={faBars} onClick={onClickSidebar} />
        <span className={styles.title}>Trang cá nhân</span>
      </div>
      <div className={styles.right}>
        <button 
          className={styles.logoutBtn} 
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;