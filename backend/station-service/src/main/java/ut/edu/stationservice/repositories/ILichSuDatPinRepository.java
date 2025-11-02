package ut.edu.stationservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ut.edu.stationservice.models.LichSuDatPin;

public interface ILichSuDatPinRepository extends JpaRepository<LichSuDatPin,Long> {
}
