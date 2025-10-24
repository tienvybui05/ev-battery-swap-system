package ngocvct0133.ut.edu.transactionservice.services;

import ngocvct0133.ut.edu.transactionservice.modules.GiaoDichDoiPin;
import ngocvct0133.ut.edu.transactionservice.repositories.IGiaoDichDoiPinRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiaoDichDoiPinService implements IGiaoDichDoiPinService {
    private final IGiaoDichDoiPinRepository giaoDichDoiPinRepository;

    public GiaoDichDoiPinService(IGiaoDichDoiPinRepository giaoDichDoiPinRepository) {
        this.giaoDichDoiPinRepository = giaoDichDoiPinRepository;
    }

    @Override
    public GiaoDichDoiPin themGiaoDichDoiPin(GiaoDichDoiPin doiPin) {
        return this.giaoDichDoiPinRepository.save(doiPin);
    }

    @Override
    public List<GiaoDichDoiPin> danhSachGiaoDichDoiPin() {
        return this.giaoDichDoiPinRepository.findAll();
    }

    @Override
    public GiaoDichDoiPin layGiaoDichDoiPinTheoId(long id) {
        return this.giaoDichDoiPinRepository.findById(id).orElse(null);
    }

    @Override
    public boolean xoaGiaoDichDoiPinTheoId(long id) {
        if (giaoDichDoiPinRepository.existsById(id)) {
            giaoDichDoiPinRepository.deleteById(id);
            return true;
        }
        return false;
    }


    @Override
    public GiaoDichDoiPin suaGiaoDichDoiPinTheoId(long id) {
        return null;
    }
}
