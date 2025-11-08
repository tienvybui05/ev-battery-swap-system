package datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.FcmToken;

public interface IFcmTokenRepository extends JpaRepository<FcmToken, Long> {
    List<FcmToken> findByMaNguoiDung(Long maNguoiDung);
}
