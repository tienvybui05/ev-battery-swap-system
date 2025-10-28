package datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.INguoiDungRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private INguoiDungRepository nguoiDungRepository;

    @Override
    public UserDetails loadUserByUsername(String soDienThoai) throws UsernameNotFoundException {
        // Tìm bằng số điện thoại
        NguoiDung user = nguoiDungRepository.findBySoDienThoai(soDienThoai)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với SĐT: " + soDienThoai));
        return new CustomUserDetails(user);
    }
}