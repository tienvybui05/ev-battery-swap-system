package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth.CustomUserDetails;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth.CustomUserDetailsService;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth.JwtUtil;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.LoginRequest;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.LoginResponse;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.TaiXeDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.TaiXe;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.INguoiDungService;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.ITaiXeService;

@RestController
@RequestMapping("/api/user-service/auth")
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private INguoiDungService nguoiDungService;

    @Autowired
    private ITaiXeService taiXeService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired  // THÊM DÒNG NÀY
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

//    /**
//     * API đăng ký người dùng
//     */
//    @PostMapping("/register")
//    public Map<String, Object> register(@RequestBody NguoiDung nguoiDung) {
//        NguoiDung saved = nguoiDungService.dangKy(nguoiDung);
//        return Map.of(
//                "message", "Đăng ký thành công",
//                "userId", saved.getMaNguoiDung(),
//                "email", saved.getEmail()
//        );
//    }
//
//    /**
//     * API đăng nhập, trả về JWT Token
//     */
//    @PostMapping("/login")
//    public Map<String, Object> login(@RequestBody Map<String, String> body) {
//        String email = body.get("email");
//        String matKhau = body.get("matKhau");
//
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(email, matKhau)
//        );
//
//        NguoiDung user = nguoiDungService.timTheoEmail(email)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
//
//        String token = jwtUtil.generateToken(user.getEmail(), user.getVaiTro());
//
//        return Map.of(
//                "token", token,
//                "role", user.getVaiTro(),
//                "email", user.getEmail()
//        );
//    }
//    @PostMapping("/register-tai-xe")
//    public Map<String, Object> registerTaiXe(@RequestBody TaiXeDTO dto) {
//        System.out.println("Đã vào API /register-tai-xe với DTO: " + dto);
//        TaiXe taiXe = taiXeService.themTaiXe(dto);
//        System.out.println("Tạo tài xế thành công: " + taiXe.getMaTaiXe());
//        return Map.of(
//                "message", "Đăng ký tài xế thành công",
//                "taiXeId", taiXe.getMaTaiXe(),
//                "nguoiDungId", taiXe.getNguoiDung().getMaNguoiDung(),
//                "email", taiXe.getNguoiDung().getEmail()
//        );
//    }
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("soDienThoai", userDetails.getUsername());
        response.put("role", userDetails.getVaiTro());
        response.put("hoTen", userDetails.getHoTen());
        response.put("userId", userDetails.getMaNguoiDung());
        
        return ResponseEntity.ok(response);
    }
    /**
     * API đăng ký người dùng
     */

    @PostMapping("/register-admin")
    public ResponseEntity<?> register(@RequestBody NguoiDung nguoiDung) {
        try {
            // 🚨 XOÁ DÒNG NÀY - KHÔNG ENCODE Ở ĐÂY
            // nguoiDung.setMatKhau(passwordEncoder.encode(nguoiDung.getMatKhau()));

            nguoiDung.setNgayTao(LocalDate.now());

            // Set role mặc định nếu chưa có
            if (nguoiDung.getVaiTro() == null || nguoiDung.getVaiTro().isEmpty()) {
                nguoiDung.setVaiTro("USER");
            }

            NguoiDung saved = nguoiDungService.dangKy(nguoiDung); // Service sẽ encode

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký thành công");
            response.put("userId", saved.getMaNguoiDung());
            response.put("email", saved.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đăng ký thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * API đăng nhập, trả về JWT Token
     */

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            NguoiDung user = nguoiDungService.timTheoSoDienThoai(request.getSoDienThoai())
                    .orElseThrow(() -> new RuntimeException("Sai số điện thoại hoặc mật khẩu nè"));

            if (!passwordEncoder.matches(request.getMatKhau(), user.getMatKhau())) {
                throw new RuntimeException("Sai số điện thoại hoặc mật khẩu nè");
            }

            String token = jwtUtil.generateToken(user.getSoDienThoai(), user.getVaiTro());
            return ResponseEntity.ok(new LoginResponse(token, user));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register-tai-xe")
    public ResponseEntity<?> registerTaiXe(@RequestBody TaiXeDTO dto) {
        try {
            System.out.println("Đã vào API /register-tai-xe với DTO: " + dto);
            TaiXe taiXe = taiXeService.themTaiXe(dto);
            System.out.println("Tạo tài xế thành công: " + taiXe.getMaTaiXe());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký tài xế thành công");
            response.put("taiXeId", taiXe.getMaTaiXe());
            response.put("nguoiDungId", taiXe.getNguoiDung().getMaNguoiDung());
            response.put("email", taiXe.getNguoiDung().getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đăng ký tài xế thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}