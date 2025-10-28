package ut.edu.stationservice.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.stationservice.models.LichSuDatPin;
import ut.edu.stationservice.models.Tram;
import ut.edu.stationservice.repositories.ILichSuDatPinRepository;

import java.util.List;

@Service
public class LichSuDatPinService implements ILichSuDatPinService {

    @Autowired
    private ILichSuDatPinRepository lichSuDatPinRepository;

    @Override
    public List<Tram> findAllByPin(Tram pin) {
        // 🔹 Hiện chưa có quan hệ giữa Tram và LichSuDatPin, nên để tạm
        return List.of();
    }

    @Override
    public LichSuDatPin findById(Long id) {
        return lichSuDatPinRepository.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public LichSuDatPin save(LichSuDatPin lichSuDatPin) {
        return lichSuDatPinRepository.save(lichSuDatPin);
    }

    @Transactional
    @Override
    public boolean deleteById(Long id) {
        if (!lichSuDatPinRepository.existsById(id)) {
            return false;
        }
        lichSuDatPinRepository.deleteById(id);
        return true;
    }

    @Transactional
    @Override
    public LichSuDatPin addLichSuDatPin(LichSuDatPin lichSu) {
        // 🔹 Nếu cần kiểm tra trùng dữ liệu, có thể thêm logic tại đây
        return lichSuDatPinRepository.save(lichSu);
    }

    @Transactional
    @Override
    public LichSuDatPin updateLichSuDatPin(LichSuDatPin lichSu) {
        return lichSuDatPinRepository.findById(lichSu.getMaLichSuDat())
                .map(existing -> {
                    existing.setTrangThaiXacNhan(lichSu.getTrangThaiXacNhan());
                    existing.setTrangThaiDoiPin(lichSu.getTrangThaiDoiPin());
                    existing.setNgayDat(lichSu.getNgayDat());
                    existing.setMaTaiXe(lichSu.getMaTaiXe());
                    existing.setMaTram(lichSu.getMaTram());
                    return lichSuDatPinRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử đặt pin với ID: " + lichSu.getMaLichSuDat()));
    }
}
