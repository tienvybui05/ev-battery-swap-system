package datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.dtos.LichSuDangKyGoiDTO;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.modules.GoiDichVu;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.modules.LichSuDangKyGoi;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.repositories.IGoiDichVuRepository;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.repositories.ILichSuDangKyGoiRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LichSuDangKyGoiService implements ILichSuDangKyGoiService {

    @Autowired
    private ILichSuDangKyGoiRepository lichSuDangKyGoiRepository;

    @Autowired
    private IGoiDichVuRepository goiDichVuRepository;

    @Override
    @Transactional
    public LichSuDangKyGoi themDangKyGoi(LichSuDangKyGoiDTO dto) {
        GoiDichVu goi = goiDichVuRepository.findById(dto.getMaGoi())
                .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));

        LichSuDangKyGoi lichSu = new LichSuDangKyGoi();
        lichSu.setMaTaiXe(dto.getMaTaiXe());
        lichSu.setGoiDichVu(goi);

        // Tính toán các trường hệ thống
        LocalDate ngayBatDau = LocalDate.now();
        LocalDate ngayKetThuc = ngayBatDau.plusDays(goi.getThoiGianDung());
        Integer soLanConLai = goi.getSoLanDoi();

        lichSu.setNgayBatDau(ngayBatDau);
        lichSu.setNgayKetThuc(ngayKetThuc);
        lichSu.setSoLanConLai(soLanConLai);

        // Tự động xác định trạng thái
        lichSu.setTrangThai(xacDinhTrangThai(ngayKetThuc, soLanConLai));

        return lichSuDangKyGoiRepository.save(lichSu);
    }

    @Override
    @Transactional
    public LichSuDangKyGoi suaDangKyGoi(Long id, LichSuDangKyGoiDTO dto) {
        return lichSuDangKyGoiRepository.findById(id).map(ls -> {
            if (dto.getMaGoi() != null) {
                GoiDichVu goi = goiDichVuRepository.findById(dto.getMaGoi())
                        .orElseThrow(() -> new RuntimeException("Gói dịch vụ không tồn tại"));
                ls.setGoiDichVu(goi);
                ls.setNgayKetThuc(ls.getNgayBatDau().plusDays(goi.getThoiGianDung()));
                ls.setSoLanConLai(goi.getSoLanDoi());
            }

            if (dto.getMaTaiXe() != null)
                ls.setMaTaiXe(dto.getMaTaiXe());

            // Cập nhật trạng thái dựa trên điều kiện thực tế
            ls.setTrangThai(xacDinhTrangThai(ls.getNgayKetThuc(), ls.getSoLanConLai()));

            return lichSuDangKyGoiRepository.save(ls);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử đăng ký gói"));
    }

    @Override
    public List<LichSuDangKyGoi> danhSachDangKyGoi() {
        List<LichSuDangKyGoi> list = lichSuDangKyGoiRepository.findAll();
        // Cập nhật trạng thái tự động khi lấy danh sách
        list.forEach(ls -> {
            String trangThaiMoi = xacDinhTrangThai(ls.getNgayKetThuc(), ls.getSoLanConLai());
            if (!trangThaiMoi.equals(ls.getTrangThai())) {
                ls.setTrangThai(trangThaiMoi);
                lichSuDangKyGoiRepository.save(ls);
            }
        });
        return list;
    }

    @Override
    public LichSuDangKyGoi layDangKyGoiTheoId(Long id) {
        return lichSuDangKyGoiRepository.findById(id).map(ls -> {
            String trangThaiMoi = xacDinhTrangThai(ls.getNgayKetThuc(), ls.getSoLanConLai());
            if (!trangThaiMoi.equals(ls.getTrangThai())) {
                ls.setTrangThai(trangThaiMoi);
                lichSuDangKyGoiRepository.save(ls);
            }
            return ls;
        }).orElse(null);
    }

    @Override
    public boolean xoaDangKyGoi(Long id) {
        try {
            lichSuDangKyGoiRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Hàm xác định trạng thái dựa vào hạn và số lần còn lại
     */
    private String xacDinhTrangThai(LocalDate ngayKetThuc, Integer soLanConLai) {
        if (ngayKetThuc == null || soLanConLai == null)
            return "KHONG_XAC_DINH";

        if (LocalDate.now().isAfter(ngayKetThuc) || soLanConLai <= 0)
            return "HET_HAN";

        return "CON_HAN";
    }
}