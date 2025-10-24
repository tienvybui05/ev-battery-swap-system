package datdq0317.edu.ut.vn.dinhquocdat.userservice.controllers;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.TaiXeDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.TaiXe;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.services.ITaiXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-service/taixe")
public class TaiXeController {

    @Autowired
    private ITaiXeService taiXeService;

    @PostMapping
    public ResponseEntity<TaiXe> themTaiXe(@RequestBody TaiXeDTO dto) {
        TaiXe tx = taiXeService.themTaiXe(dto);
        return ResponseEntity.ok(tx);
    }

    @GetMapping
    public ResponseEntity<List<TaiXe>> danhSachTaiXe() {
        return ResponseEntity.ok(taiXeService.danhSachTaiXe());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaiXe> layTaiXeTheoId(@PathVariable Long id) {
        TaiXe tx = taiXeService.layTaiXeTheoId(id);
        if (tx == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(tx);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> suaTaiXe(@PathVariable Long id, @RequestBody TaiXeDTO dto) {
        try {
            TaiXe updated = taiXeService.suaTaiXe(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaTaiXe(@PathVariable Long id) {
        boolean deleted = taiXeService.xoaTaiXe(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.badRequest().build();
    }
}
