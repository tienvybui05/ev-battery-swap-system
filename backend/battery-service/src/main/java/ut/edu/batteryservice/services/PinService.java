package ut.edu.batteryservice.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.batteryservice.models.Pin;
import ut.edu.batteryservice.repositories.IPinRepository;

import java.util.List;

@Service
public class PinService implements IPinService {

    @Autowired
    private IPinRepository pinRepository;

    @Override
    public List<Pin> getAllPinTypes() {
        // Lấy toàn bộ danh sách pin
        return pinRepository.findAll();
    }

    @Override
    public Pin getPinTypeById(Long id) {
        // Tìm pin theo ID, không có thì trả null
        return pinRepository.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public Pin createPinType(Pin pin) {
        // Có thể thêm kiểm tra trùng ở đây nếu muốn
        return pinRepository.save(pin);
    }

    @Transactional
    @Override
    public Pin updatePinType(Long id, Pin pin) {
        // Tìm pin theo ID và cập nhật thông tin
        return pinRepository.findById(id).map(p -> {
            p.setLoaiPin(pin.getLoaiPin());
            p.setDungLuong(pin.getDungLuong());
            p.setTinhTrang(pin.getTinhTrang());
            p.setSucKhoe(pin.getSucKhoe());
            p.setNgayBaoDuongGanNhat(pin.getNgayBaoDuongGanNhat());
            p.setNgayNhapKho(pin.getNgayNhapKho());
            return pinRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy Pin cần cập nhật!"));
    }

    @Transactional
    @Override
    public boolean deletePinType(Long id) {
        if (!pinRepository.existsById(id)) {
            return false;
        }
        pinRepository.deleteById(id);
        return true;
    }

    @Transactional
    @Override
    public Pin addPin(Pin pin) {
        // Alias cho createPinType
        return createPinType(pin);
    }
}
