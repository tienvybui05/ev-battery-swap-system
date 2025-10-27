package ut.edu.batteryservice.services;

import ut.edu.batteryservice.models.LichSuPinTram;

import java.util.List;

public interface ILichSuPinTramService {
    List<LichSuPinTram> findAll();
    LichSuPinTram findById(Long id);
    LichSuPinTram save(LichSuPinTram lichSuPinTram);
    boolean deleteById(Long id);
    LichSuPinTram addLichSuPinTram(LichSuPinTram lichSuPinTram);
}
