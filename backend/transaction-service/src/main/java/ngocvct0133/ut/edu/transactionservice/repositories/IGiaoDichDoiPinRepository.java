package ngocvct0133.ut.edu.transactionservice.repositories;

import ngocvct0133.ut.edu.transactionservice.modules.GiaoDichDoiPin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGiaoDichDoiPinRepository extends JpaRepository<GiaoDichDoiPin, Long> {
}
