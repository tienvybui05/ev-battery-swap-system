package ut.edu.stationservice.models;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lich_su_dat_pin")
public class LichSuDatPin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lich_su_dat")
    private Long maLichSuDat;

    @Column(name = "trang_thai_xac_nhan", length = 50)
    private String trangThaiXacNhan; // Ví dụ: "Đã xác nhận", "Chờ xác nhận", "Từ chối"

    @Column(name = "trang_thai_doi_pin", length = 50)
    private String trangThaiDoiPin; // Ví dụ: "Đang đổi", "Hoàn thành", "Chưa đổi"

    @Column(name = "ngay_dat")
    private LocalDateTime ngayDat; // Thời gian đặt lịch đổi pin

    // ===== Quan hệ tới Tài xế và Trạm =====
    @Column(name = "ma_tai_xe")
    private Long maTaiXe;

    @ManyToOne
    @JoinColumn(name = "ma_tram", referencedColumnName = "ma_tram")
    private Tram tram;

    // ===== Constructors =====
    public LichSuDatPin() {}

    public LichSuDatPin(String trangThaiXacNhan, String trangThaiDoiPin,
                        LocalDateTime ngayDat, Long maTaiXe) {
        this.trangThaiXacNhan = trangThaiXacNhan;
        this.trangThaiDoiPin = trangThaiDoiPin;
        this.ngayDat = ngayDat;
        this.maTaiXe = maTaiXe;
    }

    // ===== Getters & Setters =====
    public Long getMaLichSuDat() {
        return maLichSuDat;
    }

    public void setMaLichSuDat(Long maLichSuDat) {
        this.maLichSuDat = maLichSuDat;
    }

    public String getTrangThaiXacNhan() {
        return trangThaiXacNhan;
    }

    public void setTrangThaiXacNhan(String trangThaiXacNhan) {
        this.trangThaiXacNhan = trangThaiXacNhan;
    }

    public String getTrangThaiDoiPin() {
        return trangThaiDoiPin;
    }

    public void setTrangThaiDoiPin(String trangThaiDoiPin) {
        this.trangThaiDoiPin = trangThaiDoiPin;
    }

    public LocalDateTime getNgayDat() {
        return ngayDat;
    }

    public void setNgayDat(LocalDateTime ngayDat) {
        this.ngayDat = ngayDat;
    }

    public Long getMaTaiXe() {
        return maTaiXe;
    }

    public void setMaTaiXe(Long maTaiXe) {
        this.maTaiXe = maTaiXe;
    }

    public Tram getTram() {
        return tram;
    }

    public void setTram(Tram tram) {
        this.tram = tram;
    }
}
