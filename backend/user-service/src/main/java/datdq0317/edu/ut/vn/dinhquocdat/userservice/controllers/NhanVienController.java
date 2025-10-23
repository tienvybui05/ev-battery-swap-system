package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.NhanVienDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.NhanVien;
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
    public ResponseEntity<NhanVien> themNhanVien(@RequestBody NhanVienDTO dto) {
        try {
            NhanVien nv = nhanVienService.themNhanVien(dto);
            return ResponseEntity.ok(nv);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<NhanVien>> danhSachNhanVien() {
        return ResponseEntity.ok(nhanVienService.danhSachNhanVien());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> layNhanVienTheoId(@PathVariable Long id) {
        NhanVien nv = nhanVienService.layNhanVienTheoId(id);
        if (nv == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(nv);
    }

    // ✅ API cập nhật nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<NhanVien> suaNhanVien(@PathVariable Long id, @RequestBody NhanVienDTO dto) {
        try {
            NhanVien updated = nhanVienService.suaNhanVien(id, dto);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaNhanVien(@PathVariable Long id) {
        boolean deleted = nhanVienService.xoaNhanVien(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.badRequest().build();
    }
}