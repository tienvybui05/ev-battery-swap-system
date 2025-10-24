package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.NhanVienDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NhanVien;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.INhanVienRepository;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.IQuanLyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NhanVienService implements INhanVienService {
    @Autowired
    private INhanVienRepository nhanVienRepository;

    @Autowired
    private IQuanLyRepository nguoiDungRepository;


    @Transactional
    public NhanVien themNhanVien(NhanVienDTO dto) {

        nguoiDungRepository.findByEmail(dto.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email đã tồn tại!");
        });
        nguoiDungRepository.findBySoDienThoai(dto.getSoDienThoai()).ifPresent(u -> {
            throw new RuntimeException("Số điện thoại đã tồn tại!");
        });


        NguoiDung nguoiDung = new NguoiDung();
        nguoiDung.setHoTen(dto.getHoTen());
        nguoiDung.setEmail(dto.getEmail());
        nguoiDung.setSoDienThoai(dto.getSoDienThoai());
        nguoiDung.setGioiTinh(dto.getGioiTinh());
        nguoiDung.setMatKhau(dto.getMatKhau());
        nguoiDung.setNgaySinh(dto.getNgaySinh());
        nguoiDung.setNgayTao(LocalDate.now());
        nguoiDung.setVaiTro("NHANVIEN");
        nguoiDung = nguoiDungRepository.save(nguoiDung);


        NhanVien nv = new NhanVien();
        nv.setBangCap(dto.getBangCap());
        nv.setKinhNghiem(dto.getKinhNghiem());
        nv.setNguoiDung(nguoiDung);

        return nhanVienRepository.save(nv);
    }

    public List<NhanVien> danhSachNhanVien() {
        return nhanVienRepository.findAll();
    }

    public NhanVien layNhanVienTheoId(Long id) {
        return nhanVienRepository.findById(id).orElse(null);
    }

    public boolean xoaNhanVien(Long id) {
        try {
            nhanVienRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    @Override
    public NhanVien suaNhanVien(Long id, NhanVienDTO dto) {
        return nhanVienRepository.findById(id).map(nv -> {
            nv.setBangCap(dto.getBangCap());
            nv.setKinhNghiem(dto.getKinhNghiem());

            NguoiDung nd = nv.getNguoiDung();

            if (!nd.getEmail().equals(dto.getEmail())) {
                nguoiDungRepository.findByEmail(dto.getEmail()).ifPresent(existing -> {
                    if (!existing.getMaNguoiDung().equals(nd.getMaNguoiDung())) {
                        throw new RuntimeException("Email đã được sử dụng bởi người khác!");
                    }
                });
                nd.setEmail(dto.getEmail());
            }

            if (!nd.getSoDienThoai().equals(dto.getSoDienThoai())) {
                nguoiDungRepository.findBySoDienThoai(dto.getSoDienThoai()).ifPresent(existing -> {
                    if (!existing.getMaNguoiDung().equals(nd.getMaNguoiDung())) {
                        throw new RuntimeException("Số điện thoại đã được sử dụng bởi người khác!");
                    }
                });
                nd.setSoDienThoai(dto.getSoDienThoai());
            }

            nd.setHoTen(dto.getHoTen());
            nd.setGioiTinh(dto.getGioiTinh());
            nd.setMatKhau(dto.getMatKhau());
            nd.setNgaySinh(dto.getNgaySinh());

            nguoiDungRepository.save(nd);
            return nhanVienRepository.save(nv);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên!"));
    }
}
