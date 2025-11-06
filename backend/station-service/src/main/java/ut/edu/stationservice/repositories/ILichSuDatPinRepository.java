package ut.edu.stationservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ut.edu.stationservice.models.LichSuDatPin;

import java.util.List;

public interface ILichSuDatPinRepository extends JpaRepository<LichSuDatPin,Long> {
    List<LichSuDatPin> findByMaTaiXe(Long maTaiXe);
}
