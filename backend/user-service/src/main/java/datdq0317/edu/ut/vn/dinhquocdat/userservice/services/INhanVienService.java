package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.NhanVienDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NhanVien;

import java.util.List;

public interface INhanVienService {
    NhanVien themNhanVien(NhanVienDTO dto);
    List<NhanVien> danhSachNhanVien();
    NhanVien layNhanVienTheoId(Long id);
    boolean xoaNhanVien(Long id);
    NhanVien suaNhanVien(Long id, NhanVienDTO dto);
}
