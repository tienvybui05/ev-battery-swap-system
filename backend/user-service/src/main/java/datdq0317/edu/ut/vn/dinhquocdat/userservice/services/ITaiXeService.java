package datdq0317.edu.ut.vn.dinhquocdat.userservice.services;

import datdq0317.edu.ut.vn.dinhquocdat.userservice.dtos.TaiXeDTO;
import datdq0317.edu.ut.vn.dinhquocdat.userservice.modules.TaiXe;

import java.util.List;

public interface ITaiXeService {
    TaiXe themTaiXe(TaiXeDTO dto);
    List<TaiXe> danhSachTaiXe();
    TaiXe layTaiXeTheoId(Long id);
    boolean xoaTaiXe(Long id);
    TaiXe suaTaiXe(Long id, TaiXeDTO dto);
}
