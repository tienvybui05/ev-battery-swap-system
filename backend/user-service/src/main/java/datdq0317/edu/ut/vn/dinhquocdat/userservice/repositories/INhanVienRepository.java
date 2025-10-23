package datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INhanVienRepository extends JpaRepository<NhanVien, Long> {
}
