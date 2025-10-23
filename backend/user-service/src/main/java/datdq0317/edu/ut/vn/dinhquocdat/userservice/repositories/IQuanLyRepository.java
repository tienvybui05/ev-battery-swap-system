package datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IQuanLyRepository extends JpaRepository<NguoiDung, Long> {
    List<NguoiDung> findByEmail(String email);
}
