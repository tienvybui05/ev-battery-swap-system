package datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.dtos.LichSuDangKyGoiDTO;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.modules.LichSuDangKyGoi;

import java.util.List;

public interface ILichSuDangKyGoiService {
    LichSuDangKyGoi themDangKyGoi(LichSuDangKyGoiDTO dto);
    LichSuDangKyGoi suaDangKyGoi(Long id, LichSuDangKyGoiDTO dto);
    boolean xoaDangKyGoi(Long id);
    List<LichSuDangKyGoi> danhSachDangKyGoi();
    LichSuDangKyGoi layDangKyGoiTheoId(Long id);
}
