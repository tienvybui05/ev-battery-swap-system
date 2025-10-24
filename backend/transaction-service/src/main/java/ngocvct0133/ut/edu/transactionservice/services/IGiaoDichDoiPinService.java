package ngocvct0133.ut.edu.transactionservice.services;

import ngocvct0133.ut.edu.transactionservice.modules.GiaoDichDoiPin;

import java.util.List;

public interface IGiaoDichDoiPinService {
    GiaoDichDoiPin themGiaoDichDoiPin(GiaoDichDoiPin doiPin);
    List<GiaoDichDoiPin> danhSachGiaoDichDoiPin();
    GiaoDichDoiPin layGiaoDichDoiPinTheoId(long id);
    boolean xoaGiaoDichDoiPinTheoId(long id);
    GiaoDichDoiPin suaGiaoDichDoiPinTheoId(long id);
}
