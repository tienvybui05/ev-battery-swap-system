import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBatteryFull,
  faLocationDot,
  faUsers,
  faBrain,
  faLightbulb,
  faBolt,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./AIInsights.module.css";

function AIInsights() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 🔹 Dữ liệu mock cho biểu đồ AI
    setChartData([
      { time: "6AM", predicted: 10, actual: 8 },
      { time: "9AM", predicted: 40, actual: 38 },
      { time: "12PM", predicted: 70, actual: 68 },
      { time: "3PM", predicted: 95, actual: 92 },
      { time: "6PM", predicted: 140, actual: 130 },
      { time: "9PM", predicted: 85, actual: 80 },
    ]);
  }, []);

  const kpiData = [
    {
      title: "Tổng Doanh Thu",
      value: "$267.000",
      sub: "+12.5%",
      color: "#16a34a",
      icon: faDollarSign,
    },
    {
      title: "Tổng Lần Thay Pin",
      value: "12.847",
      sub: "+8.3%",
      color: "#3b82f6",
      icon: faBatteryFull,
    },
    {
      title: "Trạm Hoạt Động",
      value: "24",
      sub: "Tất Cả Trực Tuyến",
      color: "#a855f7",
      icon: faLocationDot,
    },
    {
      title: "Khách Hàng",
      value: "8.547",
      sub: "+156 mới",
      color: "#f97316",
      icon: faUsers,
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* 🔹 KPI */}
      <div className={styles.kpiGrid}>
        {kpiData.map((item, i) => (
          <div key={i} className={styles.kpiCard}>
            <div className={styles.kpiInfo}>
              <p className={styles.kpiTitle}>{item.title}</p>
              <h2 className={styles.kpiValue}>{item.value}</h2>
              <p className={styles.kpiSub}>{item.sub}</p>
            </div>
            <div
              className={styles.kpiIcon}
              style={{ color: item.color, backgroundColor: item.color + "20" }}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Tiêu đề */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FontAwesomeIcon icon={faBrain} /> AI-Powered Insights
        </h2>
        <span className={styles.tag}>AI Powered</span>
      </div>

      {/* 🔹 2 khối chính */}
      <div className={styles.insightsGrid}>
        {/* Dự báo nhu cầu */}
        <div className={styles.card}>
          <h3>Dự Báo Nhu Cầu</h3>
          <p>Dự đoán của AI so với sử dụng thực tế</p>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>

          <p className={styles.chartAccuracy}>
            Độ chính xác trung bình: <span>91.2%</span>
          </p>
        </div>

        {/* Gợi ý AI */}
        <div className={styles.card}>
          <h3>Gợi Ý Từ AI</h3>
          <p>Đề xuất tối ưu hóa dựa trên dữ liệu</p>

          <div className={styles.recommendList}>
            <div className={`${styles.recommendItem} ${styles.recommendBlue}`}>
              <FontAwesomeIcon icon={faBolt} />{" "}
              <strong>Tối Ưu Giờ Cao Điểm</strong>
              <p>Thêm 3 pin vào Downtown Hub 17h–19h để giảm 40% thời gian chờ.</p>
            </div>

            <div className={`${styles.recommendItem} ${styles.recommendGreen}`}>
              <FontAwesomeIcon icon={faLightbulb} />{" "}
              <strong>Cơ Hội Doanh Thu</strong>
              <p>Khu Đại học có thể tăng 23% doanh thu nếu triển khai gói sinh viên.</p>
            </div>

            <div className={`${styles.recommendItem} ${styles.recommendOrange}`}>
              <FontAwesomeIcon icon={faWrench} />{" "}
              <strong>Dự Đoán Bảo Trì</strong>
              <p>Pin BAT-2024-156 có nguy cơ hỏng trong 2 tuần tới.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Phân tích dự báo */}
      <div className={styles.analyticsSection}>
        <h3 className={styles.analyticsTitle}>Phân Tích Dự Báo (Predictive Analytics)</h3>
        <p className={styles.analyticsSub}>Dự đoán trong 30 / 60 / 90 ngày tới</p>

        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsBlock}>
            <h4>30 Ngày</h4>
            <p>Doanh thu: <strong>$89.500</strong></p>
            <p>Lần thay pin: 3.580</p>
            <p className={styles.growth}>+15.2%</p>
          </div>

          <div className={styles.analyticsBlock}>
            <h4>60 Ngày</h4>
            <p>Doanh thu: <strong>$186.200</strong></p>
            <p>Lần thay pin: 7.448</p>
            <p className={styles.growth}>+18.7%</p>
          </div>

          <div className={styles.analyticsBlock}>
            <h4>90 Ngày</h4>
            <p>Doanh thu: <strong>$294.700</strong></p>
            <p>Lần thay pin: 11.788</p>
            <p className={styles.growth}>+22.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;
