package datdq0317.edu.ut.vn.dinhquocdat.userservice.modules;

import jakarta.persistence.*;

@Entity
@Table(name = "nhanvien")
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maNhanVien;

    private String bangCap;
    private String kinhNghiem;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNguoiDung", referencedColumnName = "maNguoiDung", nullable = false)
    private NguoiDung nguoiDung;

    public NhanVien() {
    }

    public NhanVien(Long maNhanVien, String bangCap, String kinhNghiem, NguoiDung nguoiDung) {
        this.maNhanVien = maNhanVien;
        this.bangCap = bangCap;
        this.kinhNghiem = kinhNghiem;
        this.nguoiDung = nguoiDung;
    }

    public Long getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Long maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public String getBangCap() {
        return bangCap;
    }

    public void setBangCap(String bangCap) {
        this.bangCap = bangCap;
    }

    public String getKinhNghiem() {
        return kinhNghiem;
    }

    public void setKinhNghiem(String kinhNghiem) {
        this.kinhNghiem = kinhNghiem;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public void setNguoiDung(NguoiDung nguoiDung) {
        this.nguoiDung = nguoiDung;
    }
}


