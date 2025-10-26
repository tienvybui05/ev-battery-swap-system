package ngocvct0133.ut.edu.feedbackservice.modules;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BaoCao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maBaoCao;
    private String phanHoi;
    private String loaiBaoCao;
    private String noiDung;
    private String tieuDe;
    private String trangThaiXuLy;

    private Long maTaiXe;
    private Long maTram;

    public BaoCao() {
    }

    public BaoCao(Long maBaoCao, String phanHoi, String loaiBaoCao, String noiDung, String tieuDe, String trangThaiXuLy, Long maTaiXe, Long maTram) {
        this.maBaoCao = maBaoCao;
        this.phanHoi = phanHoi;
        this.loaiBaoCao = loaiBaoCao;
        this.noiDung = noiDung;
        this.tieuDe = tieuDe;
        this.trangThaiXuLy = trangThaiXuLy;
        this.maTaiXe = maTaiXe;
        this.maTram = maTram;
    }

    public Long getMaBaoCao() {
        return maBaoCao;
    }

    public void setMaBaoCao(Long maBaoCao) {
        this.maBaoCao = maBaoCao;
    }

    public String getPhanHoi() {
        return phanHoi;
    }

    public void setPhanHoi(String phanHoi) {
        this.phanHoi = phanHoi;
    }

    public String getLoaiBaoCao() {
        return loaiBaoCao;
    }

    public void setLoaiBaoCao(String loaiBaoCao) {
        this.loaiBaoCao = loaiBaoCao;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public String getTrangThaiXuLy() {
        return trangThaiXuLy;
    }

    public void setTrangThaiXuLy(String trangThaiXuLy) {
        this.trangThaiXuLy = trangThaiXuLy;
    }

    public Long getMaTaiXe() {
        return maTaiXe;
    }

    public void setMaTaiXe(Long maTaiXe) {
        this.maTaiXe = maTaiXe;
    }

    public Long getMaTram() {
        return maTram;
    }

    public void setMaTram(Long maTram) {
        this.maTram = maTram;
    }
}
