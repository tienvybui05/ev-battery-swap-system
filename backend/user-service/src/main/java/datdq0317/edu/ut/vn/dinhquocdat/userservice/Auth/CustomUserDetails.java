package datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NguoiDung;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

//import java.util.Collection;
//import java.util.List;
//
//public class CustomUserDetails implements UserDetails {
//
//    private final NguoiDung nguoiDung;
//
//    public CustomUserDetails(NguoiDung nguoiDung) {
//        this.nguoiDung = nguoiDung;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority("ROLE_" + nguoiDung.getVaiTro()));
//    }
//
//    @Override
//    public String getPassword() {
//        return nguoiDung.getMatKhau();
//    }
//
//    @Override
//    public String getUsername() {
//        return nguoiDung.getEmail();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() { return true; }
//
//    @Override
//    public boolean isAccountNonLocked() { return true; }
//
//    @Override
//    public boolean isCredentialsNonExpired() { return true; }
//
//    @Override
//    public boolean isEnabled() { return true; }
//}
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final NguoiDung nguoiDung;

    public CustomUserDetails(NguoiDung nguoiDung) {
        this.nguoiDung = nguoiDung;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Kiểm tra nếu vai trò đã có ROLE_ chưa
        String role = nguoiDung.getVaiTro();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return nguoiDung.getMatKhau();
    }

    @Override
    public String getUsername() {
        return nguoiDung.getSoDienThoai();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    // Thêm method để lấy thông tin user
    public Long getMaNguoiDung() {
        return nguoiDung.getMaNguoiDung();
    }

    public String getHoTen() {
        return nguoiDung.getHoTen();
    }

    public String getVaiTro() {
        return nguoiDung.getVaiTro();
    }
}