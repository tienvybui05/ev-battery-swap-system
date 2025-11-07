package ut.edu.batteryservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.batteryservice.dtos.BatteryStatusDTO;
import ut.edu.batteryservice.models.Pin;
import ut.edu.batteryservice.repositories.IPinRepository;

@Service
public class BatteryStatusService implements IBatteryStatusService {

    @Autowired
    private IPinRepository pinRepository;

    @Override
    public BatteryStatusDTO getBatteryStatusSummary() {
        long total = pinRepository.count();
        long day = pinRepository.countByTinhTrang(Pin.TinhTrang.DAY);
        long dangSac = pinRepository.countByTinhTrang(Pin.TinhTrang.DANG_SAC);
        long baoTri = pinRepository.countByTinhTrang(Pin.TinhTrang.BAO_TRI);

        // Có thể thêm thống kê trạng thái sở hữu nếu muốn
        long sanSang = pinRepository.countByTrangThaiSoHuu(Pin.TrangThaiSoHuu.SAN_SANG);
        long dangVanChuyen = pinRepository.countByTrangThaiSoHuu(Pin.TrangThaiSoHuu.DANG_VAN_CHUYEN);
        long duocGiuCho = pinRepository.countByTrangThaiSoHuu(Pin.TrangThaiSoHuu.DUOC_GIU_CHO);
        long dangSuDung = pinRepository.countByTrangThaiSoHuu(Pin.TrangThaiSoHuu.DANG_SU_DUNG);

        return new BatteryStatusDTO(total, day, dangSac, baoTri);
    }
}
