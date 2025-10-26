package ngocvct0133.ut.edu.feedbackservice.services;

import jakarta.transaction.Transactional;
import ngocvct0133.ut.edu.feedbackservice.modules.DanhGia;
import ngocvct0133.ut.edu.feedbackservice.repositories.IDanhGiaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DanhGiaService implements IDanhGiaService {
    private final IDanhGiaRepository danhGiaRepository;

    public DanhGiaService(IDanhGiaRepository danhGiaRepository) {
        this.danhGiaRepository = danhGiaRepository;
    }

    @Transactional
    @Override
    public DanhGia themDanhGia(DanhGia danhGia) {
        return this.danhGiaRepository.save(danhGia);
    }

    @Transactional
    @Override
    public boolean xoaDanhGia(Long id) {
        if (!this.danhGiaRepository.existsById(id)) {
            return false;
        }
        this.danhGiaRepository.deleteById(id);
        return true;
    }

    @Override
    public DanhGia suaDanhGia(Long id, DanhGia danhGia) {
        DanhGia existing = danhGiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));
        existing.setNoiDung(danhGia.getNoiDung());
        existing.setSoSao(danhGia.getSoSao());
        existing.setNgayDanhGia(danhGia.getNgayDanhGia());
        return this.danhGiaRepository.save(existing);
    }

    @Override
    public DanhGia layDanhGia(Long id) {
        return this.danhGiaRepository.findById(id) .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));
    }

    @Override
    public List<DanhGia> layTatCaDanhSach() {
        return this.danhGiaRepository.findAll();
    }
}
