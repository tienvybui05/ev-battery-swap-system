package datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.TaiXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITaiXeRepository extends JpaRepository<TaiXe, Long> {

}
