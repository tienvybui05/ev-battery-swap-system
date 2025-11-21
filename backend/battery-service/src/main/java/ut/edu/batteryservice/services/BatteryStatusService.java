package ut.edu.batteryservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.batteryservice.dtos.BatteryStatusDTO;
import ut.edu.batteryservice.models.LichSuPinTram;
import ut.edu.batteryservice.models.Pin;
import ut.edu.batteryservice.repositories.ILichSuPinTramRepository;
import ut.edu.batteryservice.repositories.IPinRepository;

import java.util.List;

@Service
public class BatteryStatusService implements IBatteryStatusService {

    @Autowired
    private IPinRepository pinRepository;

    @Autowired
    private ILichSuPinTramRepository lichSuPinTramRepository;

    @Override
    public BatteryStatusDTO getBatteryStatusSummary(Long tramId) {

        // ⛔ Không truyền trạm → trả 0 hết
        if (tramId == null) {
            return new BatteryStatusDTO(0, 0, 0, 0);
        }

        List<Pin> allPins = pinRepository.findAll();

        long total = 0;
        long day = 0;
        long dangSac = 0;
        long baoTri = 0;

        for (Pin p : allPins) {

            // ❌ bỏ pin đang sử dụng hoặc vận chuyển
            if (p.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.DANG_SU_DUNG ||
                    p.getTrangThaiSoHuu() == Pin.TrangThaiSoHuu.DANG_VAN_CHUYEN) {
                continue;
            }

            // 🔍 lấy lịch sử mới nhất của pin
            LichSuPinTram latest = lichSuPinTramRepository
                    .findTopByMaPinOrderByNgayThayDoiDesc(p.getMaPin());

            if (latest == null) continue;
            if (!latest.getMaTram().equals(tramId)) continue;

            // ✔ pin thật sự thuộc trạm được yêu cầu
            total++;

            switch (p.getTinhTrang()) {
                case DAY -> day++;
                case DANG_SAC -> dangSac++;
                case BAO_TRI -> baoTri++;
            }
        }

        return new BatteryStatusDTO(total, day, dangSac, baoTri);
    }
}
