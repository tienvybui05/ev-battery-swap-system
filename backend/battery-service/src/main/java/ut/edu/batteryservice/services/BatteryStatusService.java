package ut.edu.batteryservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.batteryservice.dtos.BatteryStatusDTO;
import ut.edu.batteryservice.repositories.IPinRepository;

@Service
public class BatteryStatusService implements IBatteryStatusService {

    @Autowired
    private IPinRepository pinRepository;

    @Override
    public BatteryStatusDTO getBatteryStatusSummary() {
        long total = pinRepository.count();
        long sanSang = pinRepository.countByTinhTrangIgnoreCase("Sẵn sàng");
        long dangSac = pinRepository.countByTinhTrangIgnoreCase("Đang sạc");
        long dangSuDung = pinRepository.countByTinhTrangIgnoreCase("Đang được sử dụng");
        long baoTri = pinRepository.countByTinhTrangIgnoreCase("Bảo trì");

        return new BatteryStatusDTO(total, sanSang, dangSac, dangSuDung, baoTri);
    }
}
