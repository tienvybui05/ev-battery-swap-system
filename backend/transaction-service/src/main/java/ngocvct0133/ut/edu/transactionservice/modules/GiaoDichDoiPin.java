package ngocvct0133.ut.edu.transactionservice.modules;

import jakarta.persistence.*;

import javax.xml.crypto.Data;
import java.time.LocalDate;

@Entity
@Table(name = "giaodichdoipin")
public class GiaoDichDoiPin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maGiaoDichDoiPin;
    private String maPinTra;
    private String maPinNhan;
    private LocalDate ngayGiaoDich;
    private String trangThaiGiaoDich;
    private double thanhtien;
    private String phuongThucThanhToan;

    public GiaoDichDoiPin() {
    }

    public GiaoDichDoiPin(Long maGiaoDichDoiPin, String maPinTra, String maPinNhan, LocalDate ngayGiaoDich, String trangThaiGiaoDich, double thanhtien, String phuongThucThanhToan) {
        this.maGiaoDichDoiPin = maGiaoDichDoiPin;
        this.maPinTra = maPinTra;
        this.maPinNhan = maPinNhan;
        this.ngayGiaoDich = ngayGiaoDich;
        this.trangThaiGiaoDich = trangThaiGiaoDich;
        this.thanhtien = thanhtien;
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public double getThanhtien() {
        return thanhtien;
    }

    public void setThanhtien(double thanhtien) {
        this.thanhtien = thanhtien;
    }

    public String getTrangThaiGiaoDich() {
        return trangThaiGiaoDich;
    }

    public void setTrangThaiGiaoDich(String trangThaiGiaoDich) {
        this.trangThaiGiaoDich = trangThaiGiaoDich;
    }

    public LocalDate getNgayGiaoDich() {
        return ngayGiaoDich;
    }

    public void setNgayGiaoDich(LocalDate ngayGiaoDich) {
        this.ngayGiaoDich = ngayGiaoDich;
    }

    public String getMaPinNhan() {
        return maPinNhan;
    }

    public void setMaPinNhan(String maPinNhan) {
        this.maPinNhan = maPinNhan;
    }

    public String getMaPinTra() {
        return maPinTra;
    }

    public void setMaPinTra(String maPinTra) {
        this.maPinTra = maPinTra;
    }

    public Long getMaGiaoDichDoiPin() {
        return maGiaoDichDoiPin;
    }

    public void setMaGiaoDichDoiPin(Long maGiaoDichDoiPin) {
        this.maGiaoDichDoiPin = maGiaoDichDoiPin;
    }
}
