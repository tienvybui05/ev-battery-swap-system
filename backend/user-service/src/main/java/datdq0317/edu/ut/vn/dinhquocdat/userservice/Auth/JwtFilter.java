package datdq0317.edu.ut.vn.dinhquocdat.userservice.Auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String token = null;
        String soDienThoai = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            soDienThoai = jwtUtil.extractSoDienThoai(token);
            
            // THÊM VERIFICATION: So sánh role trong token vs database
            if (soDienThoai != null) {
                try {
                    // Load user details và CAST về CustomUserDetails
                    CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(soDienThoai);
                    
                    // Extract role từ token
                    String tokenRole = jwtUtil.extractRole(token);
                    // Lấy role từ database (từ CustomUserDetails)
                    String dbRole = userDetails.getVaiTro();
                    
                    // So sánh role từ token vs database
                    if (!tokenRole.equals(dbRole)) {
                        // Token bị sửa đổi - từ chối request
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token invalid");
                        return;
                    }
                    
                    // Tiếp tục xác thực nếu token valid
                    if (jwtUtil.isTokenValid(token, soDienThoai)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                    
                } catch (Exception e) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token verification failed");
                    return;
                }
            }
        }
        chain.doFilter(request, response);
    }
}