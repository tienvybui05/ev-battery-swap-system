package ut.edu.batteryservice.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Pin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_pin")
    private Long maPin;

    @Column(name = "loai_pin", nullable = false, length = 100)
    private String loaiPin;

    @Column(name = "dung_luong")
    private Double dungLuong; // đơn vị có thể là kWh hoặc Ah

    @Column(name = "tinh_trang", length = 50)
    private String tinhTrang; // ví dụ: "Đang sạc", "Sẵn sàng", "Hỏng", ...

    @Column(name = "suc_khoe")
    private Double sucKhoe; // % sức khỏe pin, ví dụ: 95.0

    @Column(name = "ngay_bao_duong_gan_nhat")
    private LocalDate ngayBaoDuongGanNhat;

    @Column(name = "ngay_nhap_kho")
    private LocalDate ngayNhapKho;

    // --- Constructors ---
    public Pin() {}

    public Pin(String loaiPin, Double dungLuong, String tinhTrang, Double sucKhoe,
               LocalDate ngayBaoDuongGanNhat, LocalDate ngayNhapKho) {
        this.loaiPin = loaiPin;
        this.dungLuong = dungLuong;
        this.tinhTrang = tinhTrang;
        this.sucKhoe = sucKhoe;
        this.ngayBaoDuongGanNhat = ngayBaoDuongGanNhat;
        this.ngayNhapKho = ngayNhapKho;
    }

    // --- Getters & Setters ---
    public Long getMaPin() {
        return maPin;
    }

    public void setMaPin(Long maPin) {
        this.maPin = maPin;
    }

    public String getLoaiPin() {
        return loaiPin;
    }

    public void setLoaiPin(String loaiPin) {
        this.loaiPin = loaiPin;
    }

    public Double getDungLuong() {
        return dungLuong;
    }

    public void setDungLuong(Double dungLuong) {
        this.dungLuong = dungLuong;
    }

    public String getTinhTrang() {
        return tinhTrang;
    }

    public void setTinhTrang(String tinhTrang) {
        this.tinhTrang = tinhTrang;
    }

    public Double getSucKhoe() {
        return sucKhoe;
    }

    public void setSucKhoe(Double sucKhoe) {
        this.sucKhoe = sucKhoe;
    }

    public LocalDate getNgayBaoDuongGanNhat() {
        return ngayBaoDuongGanNhat;
    }

    public void setNgayBaoDuongGanNhat(LocalDate ngayBaoDuongGanNhat) {
        this.ngayBaoDuongGanNhat = ngayBaoDuongGanNhat;
    }

    public LocalDate getNgayNhapKho() {
        return ngayNhapKho;
    }

    public void setNgayNhapKho(LocalDate ngayNhapKho) {
        this.ngayNhapKho = ngayNhapKho;
    }
}