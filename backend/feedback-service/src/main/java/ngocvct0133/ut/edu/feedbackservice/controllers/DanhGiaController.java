package ngocvct0133.ut.edu.feedbackservice.controllers;

import ngocvct0133.ut.edu.feedbackservice.modules.DanhGia;
import ngocvct0133.ut.edu.feedbackservice.services.IDanhGiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback-service/danhgia")
public class DanhGiaController {

    private final IDanhGiaService danhGiaService;

    public DanhGiaController(IDanhGiaService danhGiaService) {
        this.danhGiaService = danhGiaService;
    }

    @GetMapping
    public ResponseEntity<List<DanhGia>> layTatCaDanhSach() {
        return ResponseEntity.ok(danhGiaService.layTatCaDanhSach());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DanhGia> layDanhGia(@PathVariable Long id) {
        return ResponseEntity.ok(danhGiaService.layDanhGia(id));
    }

    @PostMapping
    public ResponseEntity<DanhGia> themDanhGia(@RequestBody DanhGia danhGia) {
        DanhGia saved = danhGiaService.themDanhGia(danhGia);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DanhGia> suaDanhGia(@PathVariable Long id, @RequestBody DanhGia danhGia) {
        return ResponseEntity.ok(danhGiaService.suaDanhGia(id, danhGia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaDanhGia(@PathVariable Long id) {
        boolean deleted = danhGiaService.xoaDanhGia(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
