package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.NhanVienDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.models.NhanVien;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.INhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-service/nhanvien")
public class NhanVienController {

    @Autowired
    private INhanVienService nhanVienService;

    @PostMapping
    public ResponseEntity<?> themNhanVien(@RequestBody NhanVienDTO dto) {
        try {
            NhanVien nv = nhanVienService.themNhanVien(dto);
            return ResponseEntity.ok(nv);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<NhanVien>> danhSachNhanVien() {
        try {
            List<NhanVien> nhanViens = nhanVienService.danhSachNhanVien();
            return ResponseEntity.ok(nhanViens);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> layNhanVienTheoId(@PathVariable Long id) {
        try {
            NhanVien nv = nhanVienService.layNhanVienTheoId(id);
            if (nv == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(nv);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> suaNhanVien(@PathVariable Long id, @RequestBody NhanVienDTO dto) {
        try {
            NhanVien updated = nhanVienService.suaNhanVien(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaNhanVien(@PathVariable Long id) {
        try {
            boolean deleted = nhanVienService.xoaNhanVien(id);
            if (deleted) return ResponseEntity.ok().body("Xóa nhân viên thành công");
            return ResponseEntity.badRequest().body("Không tìm thấy nhân viên để xóa");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }
}