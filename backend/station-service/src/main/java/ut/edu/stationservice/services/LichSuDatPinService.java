package ut.edu.stationservice.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ut.edu.stationservice.models.LichSuDatPin;
import ut.edu.stationservice.models.Tram;
import ut.edu.stationservice.repositories.ILichSuDatPinRepository;
import ut.edu.stationservice.repositories.ITramRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LichSuDatPinService implements ILichSuDatPinService {
    private ILichSuDatPinRepository lichSuDatPinRepository;
    private ITramRepository tramRepository;

    public LichSuDatPinService(ILichSuDatPinRepository lichSuDatPinRepository, ITramRepository tramRepository) {
        this.lichSuDatPinRepository = lichSuDatPinRepository;
        this.tramRepository = tramRepository;
    }

    // 🟢 Lấy tất cả lịch sử đặt pin
    @Override
    public List<LichSuDatPin> findAll() {
        return lichSuDatPinRepository.findAll();
    }

    // 🟢 Lấy lịch sử theo ID
    @Override
    public LichSuDatPin findById(Long id) {
        return lichSuDatPinRepository.findById(id).orElse(null);
    }

    // 🟢 Lưu lịch sử (nếu cần save trực tiếp)
    @Transactional
    @Override
    public LichSuDatPin save(LichSuDatPin lichSuDatPin) {
        return lichSuDatPinRepository.save(lichSuDatPin);
    }

    // 🟢 Xóa lịch sử
    @Transactional
    @Override
    public boolean deleteById(Long id) {
        if (!lichSuDatPinRepository.existsById(id)) {
            return false;
        }
        lichSuDatPinRepository.deleteById(id);
        return true;
    }

    // 🧩 Nghiệp vụ: Đặt lịch đổi pin
    @Transactional
    @Override
    public LichSuDatPin datLich(Long maTaiXe, Long maTram, Long maXeGiaoDich) {
        List<LichSuDatPin> lichChuaXong = lichSuDatPinRepository.findByMaTaiXe(maTaiXe)
                .stream()
                .filter(ls ->
                        (
                                "Chờ xác nhận".equalsIgnoreCase(ls.getTrangThaiXacNhan()) ||
                                        "Chưa đổi pin".equalsIgnoreCase(ls.getTrangThaiDoiPin())
                        )
                                && ls.getTram().getMaTram().equals(maTram) && ls.getMaXeGiaoDich().equals(maXeGiaoDich)
                ).toList();
        if(!lichChuaXong.isEmpty()){
            throw new RuntimeException("Bạn đang có đơn đổi pin chưa hoàn thành cùng 1 trạm. Hãy hoàn tất trước khi đặt mới.");
        }

        Tram tram = tramRepository.findById(maTram)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm có ID: " + maTram));

        LichSuDatPin lichSu = new LichSuDatPin();
        lichSu.setMaTaiXe(maTaiXe);
        lichSu.setTram(tram);
        lichSu.setNgayDat(LocalDateTime.now());
        lichSu.setTrangThaiXacNhan("Chờ xác nhận");
        lichSu.setTrangThaiDoiPin("Chưa đổi pin");
        lichSu.setMaXeGiaoDich(maXeGiaoDich);
        return lichSuDatPinRepository.save(lichSu);
    }

    // 🧩 Nghiệp vụ: Cập nhật trạng thái lịch sử đặt pin
    @Transactional
    @Override
    public LichSuDatPin capNhatTrangThai(Long id, String trangThaiXacNhan, String trangThaiDoiPin, Long maGiaoDichDoiPin) {
        LichSuDatPin lichSu = lichSuDatPinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử đặt pin với ID: " + id));

        if (trangThaiXacNhan != null) lichSu.setTrangThaiXacNhan(trangThaiXacNhan);
        if (trangThaiDoiPin != null) lichSu.setTrangThaiDoiPin(trangThaiDoiPin);
        if (trangThaiDoiPin != null) lichSu.setMaGiaoDichDoiPin(maGiaoDichDoiPin);

        return lichSuDatPinRepository.save(lichSu);
    }

    // 🧩 Nghiệp vụ: Lấy tất cả lịch sử đặt pin theo mã tài xế
    @Override
    public List<LichSuDatPin> findByMaTaiXe(Long maTaiXe) {
        List<LichSuDatPin> ds = lichSuDatPinRepository.findByMaTaiXe(maTaiXe);

        // Lọc bỏ những đơn đã hoàn thành
        return ds.stream()
                .filter(l -> l.getTrangThaiDoiPin() == null
                        || !l.getTrangThaiDoiPin().equalsIgnoreCase("Hoàn thành"))
                .toList();
    }

    @Override
    public List<LichSuDatPin> findByMaTram(Long maTram) {
        return lichSuDatPinRepository.findByTram_MaTram(maTram);
    }

    @Override
    public List<LichSuDatPin> findByMaTramAndTrangThai(Long maTram, String trangThaiXacNhan) {
        return lichSuDatPinRepository.findActiveQueueByTramAndStatus(maTram, trangThaiXacNhan);
    }

}
