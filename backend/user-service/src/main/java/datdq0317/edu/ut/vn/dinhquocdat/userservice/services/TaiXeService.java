package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.TaiXeDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.TaiXe;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.INguoiDungRepository;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.IQuanLyRepository;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.ITaiXeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaiXeService implements ITaiXeService{
    @Autowired
    private ITaiXeRepository taiXeRepository;

    @Autowired
    private INguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Thêm PasswordEncoder

    @Override
    public TaiXe themTaiXe(TaiXeDTO dto) {
        // Kiểm tra email trùng
        nguoiDungRepository.findByEmail(dto.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email đã tồn tại!");
        });

        // Kiểm tra SĐT trùng
        nguoiDungRepository.findBySoDienThoai(dto.getSoDienThoai()).ifPresent(u -> {
            throw new RuntimeException("Số điện thoại đã tồn tại!");
        });

        NguoiDung nd = new NguoiDung();
        nd.setHoTen(dto.getHoTen());
        nd.setEmail(dto.getEmail());
        nd.setSoDienThoai(dto.getSoDienThoai());
        nd.setGioiTinh(dto.getGioiTinh());

        // ENCODE MẬT KHẨU TRƯỚC KHI LƯU
        String encodedPassword = passwordEncoder.encode(dto.getMatKhau());
        nd.setMatKhau(encodedPassword);

        nd.setNgaySinh(dto.getNgaySinh());
        nd.setNgayTao(LocalDate.now());
        nd.setVaiTro("TAIXE");
        nguoiDungRepository.save(nd);

        TaiXe tx = new TaiXe();
        tx.setBangLaiXe(dto.getBangLaiXe());
        tx.setNguoiDung(nd);
        return taiXeRepository.save(tx);
    }

    @Override
    public List<TaiXe> danhSachTaiXe() {
        return taiXeRepository.findAll();
    }

    @Override
    public TaiXe layTaiXeTheoId(Long id) {
        return taiXeRepository.findById(id).orElse(null);
    }

    @Override
    public boolean xoaTaiXe(Long id) {
        try {
            taiXeRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public TaiXe suaTaiXe(Long id, TaiXeDTO dto) {
        return taiXeRepository.findById(id).map(tx -> {
            tx.setBangLaiXe(dto.getBangLaiXe());
            NguoiDung nd = tx.getNguoiDung();

            if (!nd.getEmail().equals(dto.getEmail())) {
                nguoiDungRepository.findByEmail(dto.getEmail()).ifPresent(existing -> {
                    if (!existing.getMaNguoiDung().equals(nd.getMaNguoiDung())) {
                        throw new RuntimeException("Email đã được sử dụng bởi người dùng khác!");
                    }
                });
                nd.setEmail(dto.getEmail());
            }

            if (!nd.getSoDienThoai().equals(dto.getSoDienThoai())) {
                nguoiDungRepository.findBySoDienThoai(dto.getSoDienThoai()).ifPresent(existing -> {
                    if (!existing.getMaNguoiDung().equals(nd.getMaNguoiDung())) {
                        throw new RuntimeException("Số điện thoại đã được sử dụng bởi người dùng khác!");
                    }
                });
                nd.setSoDienThoai(dto.getSoDienThoai());
            }

            // Cập nhật các field khác
            nd.setHoTen(dto.getHoTen());
            nd.setGioiTinh(dto.getGioiTinh());

            // ENCODE MẬT KHẨU KHI SỬA (nếu có thay đổi mật khẩu)
            if (dto.getMatKhau() != null && !dto.getMatKhau().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(dto.getMatKhau());
                nd.setMatKhau(encodedPassword);
            }

            nd.setNgaySinh(dto.getNgaySinh());
            nguoiDungRepository.save(nd);

            return taiXeRepository.save(tx);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy tài xế!"));
    }
}