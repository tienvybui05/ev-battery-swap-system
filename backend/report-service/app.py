from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import mysql.connector
from flask_cors import CORS
import os
from dotenv import load_dotenv
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# ======================= DATABASE CONFIG =======================
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'mysql_report'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', 'root'),
    'database': os.getenv('MYSQL_DATABASE', 'report_service')
}

DW_CONFIG = {
    'host': os.getenv('DW_HOST', 'mysql-dw'),
    'user': os.getenv('DW_USER', 'root'),
    'password': os.getenv('DW_PASSWORD', 'root'),
    'database': os.getenv('DW_DATABASE', 'ev_dw_analytics')
}

def get_db_connection(config=DB_CONFIG):
    return mysql.connector.connect(**config)

# ======================= ANALYSIS FUNCTIONS =======================

def analyze_station_demand(station_data):
    """Phân tích nhu cầu tổng quan theo trạm"""
    total_demand = sum(record['so_giao_dich'] for record in station_data)
    avg_demand = total_demand / len(station_data) if station_data else 0

    hourly_data = {}
    for record in station_data:
        hour = record['gio_trong_ngay']
        hourly_data.setdefault(hour, []).append(record['so_giao_dich'])

    peak_hours = []
    for hour, demands in hourly_data.items():
        avg_hour_demand = sum(demands) / len(demands)
        if avg_hour_demand >= avg_demand * 1.2:
            peak_hours.append(hour)

    predicted_total = int(total_demand * 1.15)

    return {
        'total_demand': total_demand,
        'predicted_demand': predicted_total,
        'peak_hours': sorted(peak_hours),
        'data_points': len(station_data)
    }

def generate_detailed_recommendation(station_id, analysis_result):
    predicted_total = analysis_result['predicted_demand']
    peak_hours = analysis_result['peak_hours']
    data_points = analysis_result['data_points']

    peak_str = ", ".join([f"{h}h" for h in peak_hours]) if peak_hours else "không có giờ cao điểm rõ rệt"

    templates = [
        f"Trạm {station_id} dự kiến có {predicted_total} lượt đổi pin trong ngày tiếp theo. Phân tích dựa trên {data_points} bản ghi lịch sử cho thấy giờ cao điểm vào các khung {peak_str}. Khuyến nghị chuẩn bị đủ số lượng pin cho toàn bộ ngày hoạt động.",
        f"Dự báo cho Trạm {station_id}: tổng cộng {predicted_total} lượt đổi pin dự kiến. Theo dữ liệu lịch sử, trạm có nhu cầu tăng cao vào các giờ {peak_str}. Đề xuất phân bổ pin hợp lý cho cả ngày.",
        f"Phân tích nhu cầu Trạm {station_id} cho thấy dự kiến {predicted_total} lượt đổi pin. Các khung giờ {peak_str} thường có lượng khách hàng cao hơn mức trung bình. Khuyến nghị chuẩn bị đầy đủ pin cho toàn bộ ca làm việc."
    ]

    return random.choice(templates)

def save_prediction_to_db(prediction_data):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO ai_demand_predictions 
        (ma_tram, predict_date, predict_hour, predicted_demand, confidence_score, recommendation, gemini_insight, analysis_summary)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            prediction_data['ma_tram'],
            prediction_data['predict_date'],
            prediction_data['predict_hour'],
            prediction_data['predicted_demand'],
            prediction_data['confidence_score'],
            prediction_data['recommendation'],
            prediction_data['gemini_insight'],
            prediction_data['analysis_summary']
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving to DB: {e}")
        return False

# ======================= API ENDPOINTS =======================

@app.route('/api/report-service/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'ev-battery-ai-api',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/report-service/summary', methods=['GET'])
def get_summary():
    try:
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(DISTINCT ma_tram) as total_stations FROM dw_ev_data")
        total_stations = cursor.fetchone()['total_stations']

        cursor.execute("SELECT COUNT(*) as today_transactions FROM dw_ev_data WHERE DATE(thoi_gian) = CURDATE()")
        today_transactions = cursor.fetchone()['today_transactions']

        cursor.execute("SELECT COUNT(*) as weekly_transactions FROM dw_ev_data WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)")
        weekly_transactions = cursor.fetchone()['weekly_transactions']

        cursor.execute("""
            SELECT ma_tram, COUNT(*) as transaction_count
            FROM dw_ev_data 
            WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY ma_tram 
            ORDER BY transaction_count DESC 
            LIMIT 1
        """)
        top_station = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'data': {
                'total_stations': total_stations,
                'today_transactions': today_transactions,
                'weekly_transactions': weekly_transactions,
                'top_station': top_station,
                'last_updated': datetime.now().isoformat()
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/report-service/stations', methods=['GET'])
def get_stations():
    try:
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT 
            ma_tram as station_id,
            COUNT(*) as total_transactions,
            AVG(so_giao_dich) as avg_daily_transactions,
            MAX(thoi_gian) as last_activity
        FROM dw_ev_data 
        WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY ma_tram
        ORDER BY total_transactions DESC
        """

        cursor.execute(query)
        stations = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'data': stations,
            'total': len(stations)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/report-service/predictions', methods=['GET', 'POST'])
def get_predictions():
    """Tạo dự đoán + summary đẹp"""
    try:
        if request.method == 'POST':
            data = request.json or []
            save_to_db = True
        else:
            conn = get_db_connection(DW_CONFIG)
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT 
                    ma_tram,
                    HOUR(thoi_gian) as gio_trong_ngay,
                    COUNT(*) as so_giao_dich
                FROM dw_ev_data 
                WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY ma_tram, HOUR(thoi_gian)
                ORDER BY ma_tram, gio_trong_ngay
            """)
            data = cursor.fetchall()
            cursor.close()
            conn.close()
            save_to_db = False

        stations_data = {}
        for record in data:
            stations_data.setdefault(record['ma_tram'], []).append(record)

        predictions = []
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        for station_id, station_data in stations_data.items():
            analysis_result = analyze_station_demand(station_data)
            recommendation = generate_detailed_recommendation(station_id, analysis_result)

            if analysis_result['peak_hours']:
                peak_str = ", ".join(f"{h}h" for h in analysis_result['peak_hours'])
                analysis_summary = (
                    f"Dựa trên {analysis_result['data_points']} bản ghi lịch sử, "
                    f"giờ cao điểm thường xuất hiện vào: {peak_str}."
                )
            else:
                analysis_summary = (
                    f"Dựa trên {analysis_result['data_points']} bản ghi lịch sử: "
                    f"Không ghi nhận giờ cao điểm rõ rệt."
                )

            station_prediction = {
                'ma_tram': station_id,
                'predict_date': tomorrow,
                'predict_hour': 0,
                'predicted_demand': analysis_result['predicted_demand'],
                'confidence_score': 0.85,
                'recommendation': recommendation,
                'gemini_insight': "Phân tích tổng quan theo trạm",
                'analysis_summary': analysis_summary
            }

            if save_to_db:
                save_prediction_to_db(station_prediction)

            predictions.append(station_prediction)

        return jsonify(predictions)

    except Exception as e:
        print("ERROR:", e)
        return jsonify([]), 500

# ======================= MAIN =======================

if __name__ == '__main__':
    print("=== EV BATTERY AI API STARTED ===55")
    print("📍 Port: 8089")
    print("🔗 Health: http://localhost:8089/api/report-service/health")
    print("📊 Summary: http://localhost:8089/api/report-service/summary")
    print("🤖 Predictions: http://localhost:8089/api/report-service/predictions")
    app.run(host='0.0.0.0', port=8089, debug=True)
