package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.FcmToken;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.IFcmTokenRepository;

@Service
public class FcmTokenService implements IFcmTokenService {

    @Autowired
    private IFcmTokenRepository tokenRepo;

    @Override
    public void luuToken(Long maNguoiDung, String token) {
        boolean daTonTai = tokenRepo.findByMaNguoiDung(maNguoiDung)
                .stream()
                .anyMatch(t -> t.getToken().equals(token));
        if (!daTonTai) {
            tokenRepo.save(new FcmToken(maNguoiDung, token));
        }
    }

    @Override
    public List<FcmToken> layTokenTheoNguoiDung(Long maNguoiDung) {
        return tokenRepo.findByMaNguoiDung(maNguoiDung);
    }
}
