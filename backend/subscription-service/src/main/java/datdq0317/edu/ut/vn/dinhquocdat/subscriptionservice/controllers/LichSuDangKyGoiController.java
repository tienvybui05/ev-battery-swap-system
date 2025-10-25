package datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.controllers;

import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.dtos.LichSuDangKyGoiDTO;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.modules.LichSuDangKyGoi;
import datdq0317.edu.ut.vn.dinhquocdat.subscriptionservice.services.ILichSuDangKyGoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-service/lichsudangkygoi")
public class LichSuDangKyGoiController {

    @Autowired
    private ILichSuDangKyGoiService lichSuDangKyGoiService;

    @PostMapping
    public ResponseEntity<LichSuDangKyGoi> them(@RequestBody LichSuDangKyGoiDTO dto) {
        // kiểm tra đầu vào tối giản
        if (dto.getMaTaiXe() == null || dto.getMaGoi() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            LichSuDangKyGoi lichSu = lichSuDangKyGoiService.themDangKyGoi(dto);
            return ResponseEntity.ok(lichSu);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichSuDangKyGoi> sua(@PathVariable Long id, @RequestBody LichSuDangKyGoiDTO dto) {
        return ResponseEntity.ok(lichSuDangKyGoiService.suaDangKyGoi(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<LichSuDangKyGoi>> danhSach() {
        return ResponseEntity.ok(lichSuDangKyGoiService.danhSachDangKyGoi());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichSuDangKyGoi> layTheoId(@PathVariable Long id) {
        LichSuDangKyGoi lichSu = lichSuDangKyGoiService.layDangKyGoiTheoId(id);
        if (lichSu == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(lichSu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoa(@PathVariable Long id) {
        boolean deleted = lichSuDangKyGoiService.xoaDangKyGoi(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
    }
}