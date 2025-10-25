package datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.dtos;

import java.time.LocalDate;

public class LichSuDangKyGoiDTO {

    private Long maTaiXe;   // bắt buộc: ID tài xế (user-service)
    private Long maGoi;     // bắt buộc: ID gói (subscription-service)
    private String trangThai; // tuỳ chọn, nếu null service sẽ set mặc định

    public LichSuDangKyGoiDTO() {}

    public Long getMaTaiXe() { return maTaiXe; }
    public void setMaTaiXe(Long maTaiXe) { this.maTaiXe = maTaiXe; }

    public Long getMaGoi() { return maGoi; }
    public void setMaGoi(Long maGoi) { this.maGoi = maGoi; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}