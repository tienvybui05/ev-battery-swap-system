package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.IFcmTokenService;

@RestController
@RequestMapping("/api/fcm")
public class FcmTokenController {

    @Autowired
    private IFcmTokenService tokenService;

    // 🔹 Lưu hoặc cập nhật token
    @PostMapping("/update")
    public String capNhatToken(@RequestBody Map<String, String> body) {
        Long maNguoiDung = Long.valueOf(body.get("maNguoiDung"));
        String token = body.get("token");

        tokenService.luuToken(maNguoiDung, token);
        return "✅ Đã lưu FCM token cho người dùng " + maNguoiDung;
    }

    // 🔹 Lấy tất cả token của 1 người dùng
    @GetMapping("/{id}")
    public Object layTokenTheoNguoiDung(@PathVariable("id") Long id) {
        return tokenService.layTokenTheoNguoiDung(id);
    }
}
