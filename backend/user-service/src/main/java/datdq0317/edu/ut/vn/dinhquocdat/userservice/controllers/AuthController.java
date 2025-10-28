package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth.CustomUserDetailsService;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth.JwtUtil;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.TaiXeDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NguoiDung;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.TaiXe;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.repositories.INguoiDungRepository;


import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.INguoiDungService;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.ITaiXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/user-service/auth")
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
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            System.out.println("🎯 === BẮT ĐẦU LOGIN ===");

            String soDienThoai = body.get("soDienThoai");
            String matKhau = body.get("matKhau");

            System.out.println("📱 Số điện thoại: " + soDienThoai);
            System.out.println("🔐 Mật khẩu: " + matKhau);

            // Tìm user
            System.out.println("🔍 Tìm user với SĐT: " + soDienThoai);
            Optional<NguoiDung> userOpt = nguoiDungService.timTheoSoDienThoai(soDienThoai);

            if (!userOpt.isPresent()) {
                System.out.println("❌ KHÔNG TÌM THẤY USER");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Số điện thoại không tồn tại");
                return ResponseEntity.badRequest().body(error);
            }

            NguoiDung user = userOpt.get(); // 🎯 QUAN TRỌNG: Lấy user từ Optional
            System.out.println("✅ TÌM THẤY USER:");
            System.out.println("   - ID: " + user.getMaNguoiDung());
            System.out.println("   - Tên: " + user.getHoTen());
            System.out.println("   - Vai trò: " + user.getVaiTro());
            System.out.println("   - Mật khẩu DB: " + user.getMatKhau());

            // 🔥 DEBUG CHI TIẾT SO SÁNH MẬT KHẨU
            System.out.println("🔑 === DEBUG PASSWORD MATCHING ===");
            System.out.println("   - Input password: '" + matKhau + "'");
            System.out.println("   - DB password: '" + user.getMatKhau() + "'");
            System.out.println("   - DB password length: " + user.getMatKhau().length());
            System.out.println("   - Is BCrypt: " + user.getMatKhau().startsWith("$2a$"));

            // Test nhiều cách
            boolean match1 = passwordEncoder.matches(matKhau, user.getMatKhau());
            System.out.println("   - passwordEncoder.matches(): " + match1);

            // Test với khoảng trắng
            boolean match2 = passwordEncoder.matches(matKhau.trim(), user.getMatKhau());
            System.out.println("   - With trim(): " + match2);

            // Test manual BCrypt
            try {
                boolean match3 = BCrypt.checkpw(matKhau, user.getMatKhau());
                System.out.println("   - BCrypt.checkpw(): " + match3);
            } catch (Exception e) {
                System.out.println("   - BCrypt.checkpw() error: " + e.getMessage());
            }

            if (!match1) {
                System.out.println("❌ TẤT CẢ SO SÁNH MẬT KHẨU ĐỀU FAIL!");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Số điện thoại hoặc mật khẩu không đúng");
                error.put("debug", "Password mismatch - check input");
                return ResponseEntity.badRequest().body(error);
            }

            System.out.println("✅ MẬT KHẨU KHỚP!");

            // Tiếp tục xử lý login thành công...
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(soDienThoai);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("🎫 Tạo token...");
            // Tạo token với số điện thoại
            String token = jwtUtil.generateToken(user.getSoDienThoai(), user.getVaiTro());
            System.out.println("✅ Token created successfully");

            // Test token ngay
            try {
                String testExtract = jwtUtil.extractSoDienThoai(token);
                String testRole = jwtUtil.extractRole(token);
                boolean testValid = jwtUtil.isTokenValid(token, user.getSoDienThoai());

                System.out.println("🧪 Token test:");
                System.out.println("   - Extract SĐT: " + testExtract);
                System.out.println("   - Extract Role: " + testRole);
                System.out.println("   - Is Valid: " + testValid);
            } catch (Exception e) {
                System.out.println("❌ Token test failed: " + e.getMessage());
                throw e;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getVaiTro());
            response.put("email", user.getEmail());
            response.put("soDienThoai", user.getSoDienThoai());
            response.put("userId", user.getMaNguoiDung());
            response.put("hoTen", user.getHoTen());

            System.out.println("🎉 LOGIN THÀNH CÔNG!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("💥 LỖI LOGIN: " + e.getClass().getSimpleName());
            System.out.println("💥 Message: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Đăng nhập thất bại: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
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