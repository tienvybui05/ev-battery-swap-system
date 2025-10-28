package ut.edu.stationservice.services;

import ut.edu.stationservice.models.LichSuDatPin;
import ut.edu.stationservice.models.Tram;

import java.util.List;

public interface ILichSuDatPinService {
    List<Tram> findAllByPin(Tram pin);
    LichSuDatPin findById(Long id);
    LichSuDatPin save(LichSuDatPin lichSuDatPin);
    boolean deleteById(Long id);
    LichSuDatPin addLichSuDatPin(LichSuDatPin lichSu);
    LichSuDatPin updateLichSuDatPin(LichSuDatPin lichSu);
}
