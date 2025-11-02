package ut.edu.stationservice.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.stationservice.models.Tram;
import ut.edu.stationservice.services.ITramService;

import java.util.List;

@RestController
@RequestMapping("/api/station-service/tram")
public class TramController {

    private final ITramService tramService;

    public TramController(ITramService tramService) {
        this.tramService = tramService;
    }

    @GetMapping
    public ResponseEntity<List<Tram>> layDanhSachTram() {
        List<Tram> trams = tramService.findByTramId(null);
        return ResponseEntity.ok(trams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tram> layTramTheoId(@PathVariable Long id) {
        Tram tram = tramService.findById(id);
        if (tram == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tram);
    }

    @PostMapping
    public ResponseEntity<?> themTram(@RequestBody Tram tram) {
        try {
            Tram newTram = tramService.addPin(tram);
            return ResponseEntity.ok(newTram);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> suaTram(@PathVariable Long id, @RequestBody Tram tram) {
        try {
            tram.setMaTram(id);
            Tram updated = tramService.updatePin(tram);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaTram(@PathVariable Long id) {
        boolean deleted = tramService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok("Xóa trạm thành công!");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy trạm cần xóa!");
        }
    }
}
