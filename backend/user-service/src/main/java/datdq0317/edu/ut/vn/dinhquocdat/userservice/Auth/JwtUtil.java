package datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "datdq0317VeryLongAndSecureSecretKeyForJWTTokenGeneration2024";

    public String generateToken(String soDienThoai, String role) {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);

            String token = createToken(claims, soDienThoai);
            System.out.println("✅ Token generated: " + token.substring(0, 50) + "...");
            return token;

        } catch (Exception e) {
            System.out.println("❌ Lỗi generateToken: " + e.getMessage());
            throw e;
        }
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // ĐỔI TÊN METHOD THÀNH extractSoDienThoai
    public String extractSoDienThoai(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    // Đổi parameter thành soDienThoai
    public boolean isTokenValid(String token, String soDienThoai) {
        return (soDienThoai.equals(extractSoDienThoai(token)) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
}