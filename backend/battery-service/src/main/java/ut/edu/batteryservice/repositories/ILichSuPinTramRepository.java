package ut.edu.batteryservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ut.edu.batteryservice.models.LichSuPinTram;

public interface ILichSuPinTramRepository extends JpaRepository<LichSuPinTram,Long> {
}
