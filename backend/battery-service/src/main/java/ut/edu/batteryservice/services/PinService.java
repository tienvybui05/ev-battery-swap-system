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
        return pinRepository.findAll();
    }

    @Override
    public Pin getPinTypeById(Long id) {
        return pinRepository.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public Pin createPinType(Pin pin) {
        validatePinState(pin, null);
        return pinRepository.save(pin);
    }

    @Transactional
    @Override
    public Pin updatePinType(Long id, Pin pin) {
        return pinRepository.findById(id).map(existing -> {
            validatePinState(pin, existing);
            existing.setLoaiPin(pin.getLoaiPin());
            existing.setDungLuong(pin.getDungLuong());
            existing.setTinhTrang(pin.getTinhTrang());
            existing.setTrangThaiSoHuu(pin.getTrangThaiSoHuu());
            existing.setSucKhoe(pin.getSucKhoe());
            existing.setNgayBaoDuongGanNhat(pin.getNgayBaoDuongGanNhat());
            existing.setNgayNhapKho(pin.getNgayNhapKho());
            return pinRepository.save(existing);
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
        return createPinType(pin);
    }

    /**
     * 🔒 Validate quy tắc chuyển trạng thái sở hữu.
     */
    private void validatePinState(Pin newPin, Pin oldPin) {
        var tinhTrang = newPin.getTinhTrang();
        var trangThai = newPin.getTrangThaiSoHuu();

        // 1️⃣ "Sẵn sàng" chỉ khi tinh_trang = Đầy
        if (trangThai == Pin.TrangThaiSoHuu.SAN_SANG && tinhTrang != Pin.TinhTrang.DAY) {
            throw new RuntimeException("Pin chỉ có thể ở trạng thái 'Sẵn sàng' khi tinh_trang = 'Đầy'.");
        }

        // 2️⃣ "Được giữ chỗ" chỉ chuyển từ "Sẵn sàng"
        if (oldPin != null && trangThai == Pin.TrangThaiSoHuu.DUOC_GIU_CHO &&
                oldPin.getTrangThaiSoHuu() != Pin.TrangThaiSoHuu.SAN_SANG) {
            throw new RuntimeException("Chỉ có thể giữ chỗ pin đang ở trạng thái 'Sẵn sàng'.");
        }

        // 3️⃣ "Đang sử dụng" chỉ chuyển từ "Sẵn sàng" hoặc "Được giữ chỗ"
        if (oldPin != null && trangThai == Pin.TrangThaiSoHuu.DANG_SU_DUNG &&
                !(oldPin.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.SAN_SANG ||
                        oldPin.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.DUOC_GIU_CHO)) {
            throw new RuntimeException("Chỉ có thể chuyển sang 'Đang sử dụng' từ 'Sẵn sàng' hoặc 'Được giữ chỗ'.");
        }

        // 4️⃣ Không được chuyển sang 'Đang vận chuyển' nếu đang sử dụng hoặc được giữ chỗ
        if (oldPin != null && trangThai == Pin.TrangThaiSoHuu.DANG_VAN_CHUYEN &&
                (oldPin.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.DANG_SU_DUNG ||
                        oldPin.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.DUOC_GIU_CHO)) {
            throw new RuntimeException("Không thể chuyển sang 'Đang vận chuyển' khi pin đang được sử dụng hoặc được giữ chỗ.");
        }
    }
}
