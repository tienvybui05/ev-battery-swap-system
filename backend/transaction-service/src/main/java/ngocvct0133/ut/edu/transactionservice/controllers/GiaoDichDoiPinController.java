package ngocvct0133.ut.edu.transactionservice.controllers;

import ngocvct0133.ut.edu.transactionservice.modules.GiaoDichDoiPin;
import ngocvct0133.ut.edu.transactionservice.services.GiaoDichDoiPinService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/giaodichdoipin")
public class GiaoDichDoiPinController {
    private final GiaoDichDoiPinService giaoDichDoiPinService;

    public GiaoDichDoiPinController(GiaoDichDoiPinService giaoDichDoiPinService) {
        this.giaoDichDoiPinService = giaoDichDoiPinService;
    }

    @GetMapping
    public List<GiaoDichDoiPin> laydanhSachGiaoDichDoiPin() {
        return giaoDichDoiPinService.danhSachGiaoDichDoiPin();
    }

    @PostMapping
    public GiaoDichDoiPin themGiaoDichDoiPin(@RequestBody GiaoDichDoiPin doiPin) {
        return giaoDichDoiPinService.themGiaoDichDoiPin(doiPin);
    }

    @DeleteMapping("/{id}")
    public boolean xoaGiaoDichDoiPin(@PathVariable long id){
        boolean deleted = giaoDichDoiPinService.xoaGiaoDichDoiPinTheoId(id);
        if(deleted){
            return true;
        }
        return false;
    }
}
