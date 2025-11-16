import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faLocationDot,
  faBrain,
  faLightbulb,
  faBolt,
  faChartLine,
  faClock,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import styles from "./AIInsights.module.css";

function AIInsights() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/report-service/predictions');
      if (!response.ok) throw new Error('Failed to fetch predictions');
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TÍNH TOÁN TỪ DATA THỰC - KHÔNG GÁN CỨNG

  // 1. Tổng quan từ predictions
  const totalStations = predictions.length;
  const totalPredictedDemand = predictions.reduce((sum, pred) => sum + pred.predicted_demand, 0);
  const avgConfidence = predictions.length > 0 
    ? (predictions.reduce((sum, pred) => sum + pred.confidence_score, 0) / predictions.length * 100).toFixed(1)
    : 0;

  // 2. Trạm có nhu cầu cao nhất
  const topStation = predictions.length > 0 
    ? predictions.reduce((max, pred) => pred.predicted_demand > max.predicted_demand ? pred : max)
    : null;

  // 3. Dữ liệu biểu đồ cột - TOP 5 trạm thực tế
  const topStationsData = predictions
    .sort((a, b) => b.predicted_demand - a.predicted_demand) // Sắp xếp giảm dần
    .slice(0, 5) // Lấy 5 trạm đầu
    .map(pred => ({
      name: `Trạm ${pred.ma_tram}`,
      demand: pred.predicted_demand,
      confidence: pred.confidence_score
    }));

  // 4. Dữ liệu biểu đồ tròn - phân bổ thực tế
  const demandDistribution = predictions.map(pred => ({
    name: `Trạm ${pred.ma_tram}`,
    value: pred.predicted_demand,
    stationId: pred.ma_tram
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const kpiData = [
    {
      title: "Tổng Lượt Đổi Pin",
      value: totalPredictedDemand.toString(),
      sub: "Dự báo ngày mai",
      color: "#3b82f6",
      icon: faBatteryFull,
    },
    {
      title: "Số Trạm",
      value: totalStations.toString(),
      sub: "Được dự báo",
      color: "#10b981",
      icon: faLocationDot,
    },
    {
      title: "Độ Tin Cậy",
      value: `${avgConfidence}%`,
      sub: "Trung bình",
      color: "#f59e0b",
      icon: faBrain,
    },
    {
      title: "Trạm Cao Nhất",
      value: topStation ? `Trạm ${topStation.ma_tram}` : "N/A",
      sub: topStation ? `${topStation.predicted_demand} lượt` : "Không có data",
      color: "#ef4444",
      icon: faChartLine,
    },
  ];

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <FontAwesomeIcon icon={faBrain} spin />
          <p>Đang tải dự báo AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>
          <p>Lỗi khi tải dữ liệu: {error}</p>
          <button onClick={fetchPredictions} className={styles.retryButton}>
            <FontAwesomeIcon icon={faSync} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* KPI Cards - HIỂN THỊ DATA THỰC */}
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

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FontAwesomeIcon icon={faBrain} /> Dự Báo AI - Dữ Liệu Thực
        </h2>
        <div className={styles.headerInfo}>
          <span className={styles.lastUpdated}>
            Cập nhật: {new Date().toLocaleTimeString()}
          </span>
          <button onClick={fetchPredictions} className={styles.refreshButton}>
            <FontAwesomeIcon icon={faSync} /> Cập nhật
          </button>
        </div>
      </div>

      {/* Charts - DÙNG DATA THỰC TỪ API */}
      <div className={styles.insightsGrid}>
        {/* Biểu đồ cột - Top 5 trạm thực tế */}
        <div className={styles.card}>
          <h3>Top 5 Trạm Có Nhu Cầu Cao Nhất</h3>
          <p>Dựa trên dự báo AI thực tế</p>
          
          {topStationsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topStationsData}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} lượt`, 'Dự báo']}
                  labelFormatter={(label) => `Trạm: ${label}`}
                />
                <Bar 
                  dataKey="demand" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Số lượt dự báo"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>
              <p>Không có dữ liệu để hiển thị</p>
            </div>
          )}
        </div>

        {/* Biểu đồ tròn - Phân bổ thực tế */}
        <div className={styles.card}>
          <h3>Phân Bổ Nhu Cầu Giữa Các Trạm</h3>
          <p>Tỷ lệ % dựa trên dự báo thực</p>
          
          {demandDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={demandDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {demandDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} lượt (${((value / totalPredictedDemand) * 100).toFixed(1)}%)`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>
              <p>Không có dữ liệu để hiển thị</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations - ĐỀ XUẤT THỰC TỪ AI */}
      <div className={styles.recommendationsSection}>
        <h3 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faLightbulb} /> Đề Xuất Phân Bổ Pin Từ AI
        </h3>
        {predictions.length > 0 ? (
          <div className={styles.recommendationsGrid}>
            {predictions.map((pred) => (
              <div key={pred.ma_tram} className={styles.recommendationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stationInfo}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <h4>Trạm {pred.ma_tram}</h4>
                  </div>
                  <span 
                    className={styles.confidence}
                    style={{
                      backgroundColor: pred.confidence_score > 0.8 ? '#10b98120' : 
                                     pred.confidence_score > 0.6 ? '#f59e0b20' : '#ef444420',
                      color: pred.confidence_score > 0.8 ? '#10b981' : 
                           pred.confidence_score > 0.6 ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {Math.round(pred.confidence_score * 100)}% tin cậy
                  </span>
                </div>
                
                <div className={styles.prediction}>
                  <div className={styles.demand}>
                    <strong>{pred.predicted_demand}</strong>
                    <span>lượt dự báo</span>
                  </div>
                  <p className={styles.analysis}>{pred.analysis_summary}</p>
                </div>

                <div className={styles.recommendation}>
                  <FontAwesomeIcon icon={faBolt} className={styles.faBolt} />
                  <p>{pred.recommendation}</p>
                </div>

                <div className={styles.predictionDate}>
            
                  <span>Dự báo cho: {pred.predict_date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noData}>
            <p>Không có đề xuất nào từ AI</p>
          </div>
        )}
      </div>

      {/* Thống kê tổng quan */}
      
    </div>
  );
}

export default AIInsights;