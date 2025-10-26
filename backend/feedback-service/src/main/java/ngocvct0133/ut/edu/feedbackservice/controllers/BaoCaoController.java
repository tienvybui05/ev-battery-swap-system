package ngocvct0133.ut.edu.feedbackservice.controllers;

import ngocvct0133.ut.edu.feedbackservice.modules.BaoCao;
import ngocvct0133.ut.edu.feedbackservice.services.IBaoCaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback-service/baocao")
public class BaoCaoController {
    private final IBaoCaoService baoCaoService;

    public BaoCaoController(IBaoCaoService baoCaoService) {
        this.baoCaoService = baoCaoService;
    }

    @GetMapping
    public ResponseEntity<List<BaoCao>> layTatCaBaoCao() {
        return ResponseEntity.ok(this.baoCaoService.layTatCaBaoCao());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaoCao> layBaoCao(@PathVariable Long id) {
        return  ResponseEntity.ok(this.baoCaoService.layBaoCao(id));
    }

    @PostMapping
    public ResponseEntity<BaoCao> themBaoCao(@RequestBody BaoCao baoCao){
        BaoCao saved = baoCaoService.themBaoCao(baoCao);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaoCao> suaBaoCao(@PathVariable Long id, @RequestBody BaoCao baoCao) {
        return ResponseEntity.ok(this.baoCaoService.suaBaoCao(id, baoCao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaBaoCao(@PathVariable Long id) {
        boolean deleted = this.baoCaoService.xoaBaoCao(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }


}
