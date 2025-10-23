package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.IQuanLyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public class QuanLyService implements IQuanLyService {
    @Autowired
    private IQuanLyRepository quanLyRepository;

    @Override
    public NguoiDung themQuanLy(NguoiDung nguoiDung) {
        if (!quanLyRepository.findByEmail(nguoiDung.getEmail()).isEmpty()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        nguoiDung.setNgayTao(LocalDate.now());
        nguoiDung.setVaiTro("ADMIN");
        return quanLyRepository.save(nguoiDung);
    }

    @Override
    public List<NguoiDung> danhSachQuanLy() {
        return quanLyRepository.findAll();
    }

    @Override
    public boolean xoaQuanLy(Long id) {
        try{
            quanLyRepository.deleteById(id);
            return true;
        }
        catch(Exception e){
            return false;
        }

    }

    @Override
    public NguoiDung suaThongTinQuanLy(Long id,NguoiDung nguoiDung) {
        return quanLyRepository.findById(id).map(nd -> {
            nd.setHoTen(nguoiDung.getHoTen());
            nd.setEmail(nguoiDung.getEmail());
            nd.setSoDienThoai(nguoiDung.getSoDienThoai());
            nd.setGioiTinh(nguoiDung.getGioiTinh());
            nd.setMatKhau(nguoiDung.getMatKhau());
            nd.setNgaySinh(nguoiDung.getNgaySinh());
            nd.setVaiTro(nguoiDung.getVaiTro());
            return quanLyRepository.save(nd);
        }).orElse(null);
    }

    @Override
    public NguoiDung layQuanLyBangId(Long id) {
        return quanLyRepository.findById(id).orElse(null);
    }
}
