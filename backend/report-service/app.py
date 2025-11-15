from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import mysql.connector
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Config - Kết nối đến mysql_report
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'mysql_report'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', 'root'),
    'database': os.getenv('MYSQL_DATABASE', 'report_service')
}

# Database Config cho data warehouse
DW_CONFIG = {
    'host': os.getenv('DW_HOST', 'mysql-dw'),
    'user': os.getenv('DW_USER', 'root'),
    'password': os.getenv('DW_PASSWORD', 'root'),
    'database': os.getenv('DW_DATABASE', 'ev_dw_analytics')
}

def get_db_connection(config=DB_CONFIG):
    """Kết nối database"""
    return mysql.connector.connect(**config)

def analyze_station_demand(station_data):
    """Phân tích nhu cầu tổng quan theo trạm"""
    total_demand = sum(record['so_giao_dich'] for record in station_data)
    avg_demand = total_demand / len(station_data) if station_data else 0
    
    hourly_data = {}
    for record in station_data:
        hour = record['gio_trong_ngay']
        if hour not in hourly_data:
            hourly_data[hour] = []
        hourly_data[hour].append(record['so_giao_dich'])
    
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
    """Tạo recommendation dạng đoạn văn chi tiết"""
    predicted_total = analysis_result['predicted_demand']
    peak_hours = analysis_result['peak_hours']
    data_points = analysis_result['data_points']
    
    peak_str = ", ".join([f"{h}h" for h in peak_hours]) if peak_hours else "không có giờ cao điểm rõ rệt"
    
    templates = [
        f"""Trạm {station_id} dự kiến có {predicted_total} lượt đổi pin trong ngày tiếp theo. Phân tích dựa trên {data_points} bản ghi lịch sử cho thấy giờ cao điểm vào các khung {peak_str}. Khuyến nghị chuẩn bị đủ số lượng pin cho toàn bộ ngày hoạt động.""",
        f"""Dự báo cho Trạm {station_id}: tổng cộng {predicted_total} lượt đổi pin dự kiến. Theo dữ liệu lịch sử, trạm có nhu cầu tăng cao vào các giờ {peak_str}. Đề xuất phân bổ pin hợp lý cho cả ngày.""",
        f"""Phân tích nhu cầu Trạm {station_id} cho thấy dự kiến {predicted_total} lượt đổi pin. Các khung giờ {peak_str} thường có lượng khách hàng cao hơn mức trung bình. Khuyến nghị chuẩn bị đầy đủ pin cho toàn bộ ca làm việc."""
    ]
    
    import random
    return random.choice(templates)

def save_prediction_to_db(prediction_data):
    """Lưu prediction vào database"""
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

# ==================== GET APIs VỚI PREFIX /api/report-service ====================

@app.route('/api/report-service/health', methods=['GET'])
def health():
    """Health check API"""
    return jsonify({
        'status': 'healthy',
        'service': 'ev-battery-ai-api',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/report-service/summary', methods=['GET'])
def get_summary():
    """API tổng quan hệ thống"""
    try:
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Tổng số trạm
        cursor.execute("SELECT COUNT(DISTINCT ma_tram) as total_stations FROM dw_ev_data")
        total_stations = cursor.fetchone()['total_stations']
        
        # Số giao dịch hôm nay
        cursor.execute("SELECT COUNT(*) as today_transactions FROM dw_ev_data WHERE DATE(thoi_gian) = CURDATE()")
        today_transactions = cursor.fetchone()['today_transactions']
        
        # Số giao dịch 7 ngày
        cursor.execute("SELECT COUNT(*) as weekly_transactions FROM dw_ev_data WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)")
        weekly_transactions = cursor.fetchone()['weekly_transactions']
        
        # Trạm hoạt động nhiều nhất
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
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/report-service/stations', methods=['GET'])
def get_stations():
    """API danh sách các trạm và thống kê"""
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
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/report-service/historical-data', methods=['GET'])
def get_historical_data():
    """API lấy dữ liệu lịch sử cho charts"""
    try:
        days = request.args.get('days', 7, type=int)
        station_id = request.args.get('station_id', type=int)
        
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        base_query = """
        SELECT 
            ma_tram as station_id,
            HOUR(thoi_gian) as hour,
            DATE(thoi_gian) as date,
            DAYNAME(thoi_gian) as day_name,
            COUNT(*) as transaction_count
        FROM dw_ev_data 
        WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL %s DAY)
        """
        
        params = [days]
        
        if station_id:
            base_query += " AND ma_tram = %s"
            params.append(station_id)
        
        base_query += " GROUP BY ma_tram, HOUR(thoi_gian), DATE(thoi_gian), DAYNAME(thoi_gian) ORDER BY date, hour"
        
        cursor.execute(base_query, params)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': results,
            'days': days,
            'station_id': station_id,
            'total_records': len(results)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/report-service/predictions', methods=['GET', 'POST'])
def get_predictions():
    """API lấy predictions hiện tại - TRẢ VỀ ARRAY TRỰC TIẾP"""
    try:
        # Nếu là POST, lấy data từ request body
        if request.method == 'POST':
            data = request.json
            if not data or len(data) == 0:
                return jsonify([])  # Trả về array rỗng
        else:  # GET - tự lấy data từ database
            conn = get_db_connection(DW_CONFIG)
            cursor = conn.cursor(dictionary=True)
            
            query = """
            SELECT 
                ma_tram,
                HOUR(thoi_gian) as gio_trong_ngay,
                COUNT(*) as so_giao_dich
            FROM dw_ev_data 
            WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY ma_tram, HOUR(thoi_gian)
            ORDER BY ma_tram, gio_trong_ngay
            """
            
            cursor.execute(query)
            data = cursor.fetchall()
            cursor.close()
            conn.close()
        
        # Gom dữ liệu theo trạm
        stations_data = {}
        for record in data:
            station_id = record['ma_tram']
            if station_id not in stations_data:
                stations_data[station_id] = []
            stations_data[station_id].append(record)
        
        # Tạo predictions
        predictions = []
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        for station_id, station_data in stations_data.items():
            analysis_result = analyze_station_demand(station_data)
            recommendation = generate_detailed_recommendation(station_id, analysis_result)
            
            station_prediction = {
                'ma_tram': station_id,
                'predict_date': tomorrow,
                'predict_hour': 0,  # 0 = cả ngày
                'predicted_demand': analysis_result['predicted_demand'],
                'confidence_score': 0.85,
                'recommendation': recommendation,
                'gemini_insight': "Phân tích tổng quan theo trạm",
                'analysis_summary': f"Dựa trên {analysis_result['data_points']} bản ghi lịch sử, giờ cao điểm: {analysis_result['peak_hours']}"
            }
            
            # Lưu vào database
            save_prediction_to_db(station_prediction)
            
            # Format response (giống code cũ)
            predictions.append({
                'analysis_summary': station_prediction['analysis_summary'],
                'confidence_score': station_prediction['confidence_score'],
                'gemini_insight': station_prediction['gemini_insight'],
                'ma_tram': station_prediction['ma_tram'],
                'predict_date': station_prediction['predict_date'],
                'predict_hour': station_prediction['predict_hour'],
                'predicted_demand': station_prediction['predicted_demand'],
                'recommendation': station_prediction['recommendation']
            })
        
        # TRẢ VỀ ARRAY TRỰC TIẾP (giống code cũ)
        return jsonify(predictions)
        
    except Exception as e:
        return jsonify([]), 500

@app.route('/api/report-service/predictions-history', methods=['GET'])
def get_predictions_history():
    """API lấy lịch sử predictions từ database"""
    try:
        limit = request.args.get('limit', 20, type=int)
        station_id = request.args.get('station_id', type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        base_query = """
        SELECT 
            id,
            ma_tram as station_id,
            predict_date,
            predict_hour,
            predicted_demand,
            confidence_score,
            recommendation,
            gemini_insight,
            analysis_summary,
            created_at
        FROM ai_demand_predictions 
        WHERE 1=1
        """
        
        params = []
        
        if station_id:
            base_query += " AND ma_tram = %s"
            params.append(station_id)
        
        base_query += " ORDER BY created_at DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(base_query, params)
        predictions = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': predictions,
            'total': len(predictions)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/report-service/hourly-pattern', methods=['GET'])
def get_hourly_pattern():
    """API lấy pattern sử dụng theo giờ"""
    try:
        station_id = request.args.get('station_id', type=int)
        
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        base_query = """
        SELECT 
            HOUR(thoi_gian) as hour,
            COUNT(*) as transaction_count,
            DAYNAME(thoi_gian) as day_name
        FROM dw_ev_data 
        WHERE thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        """
        
        params = []
        if station_id:
            base_query += " AND ma_tram = %s"
            params.append(station_id)
        
        base_query += " GROUP BY HOUR(thoi_gian), DAYNAME(thoi_gian) ORDER BY hour, day_name"
        
        cursor.execute(base_query, params)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': results,
            'station_id': station_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/report-service/stations/<int:station_id>', methods=['GET'])
def get_station_detail(station_id):
    """API chi tiết một trạm cụ thể"""
    try:
        conn = get_db_connection(DW_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Thông tin cơ bản
        cursor.execute("""
            SELECT 
                ma_tram as station_id,
                COUNT(*) as total_transactions,
                AVG(so_giao_dich) as avg_transactions,
                MIN(thoi_gian) as first_activity,
                MAX(thoi_gian) as last_activity
            FROM dw_ev_data 
            WHERE ma_tram = %s
            GROUP BY ma_tram
        """, (station_id,))
        station_info = cursor.fetchone()
        
        # Pattern theo giờ
        cursor.execute("""
            SELECT 
                HOUR(thoi_gian) as hour,
                COUNT(*) as transaction_count
            FROM dw_ev_data 
            WHERE ma_tram = %s AND thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY HOUR(thoi_gian)
            ORDER BY hour
        """, (station_id,))
        hourly_pattern = cursor.fetchall()
        
        # Pattern theo ngày
        cursor.execute("""
            SELECT 
                DAYNAME(thoi_gian) as day_name,
                COUNT(*) as transaction_count
            FROM dw_ev_data 
            WHERE ma_tram = %s AND thoi_gian >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DAYNAME(thoi_gian)
            ORDER BY FIELD(day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
        """, (station_id,))
        daily_pattern = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'station_info': station_info,
                'hourly_pattern': hourly_pattern,
                'daily_pattern': daily_pattern
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=== EV BATTERY AI API STARTED ===1123")
    print("📍 Port: 8089")
    print("🔗 Health: http://localhost:8089/api/report-service/health")
    print("📊 Summary: http://localhost:8089/api/report-service/summary")
    print("🤖 Predictions: http://localhost:8089/api/report-service/predictions")
    app.run(host='0.0.0.0', port=8089, debug=True)