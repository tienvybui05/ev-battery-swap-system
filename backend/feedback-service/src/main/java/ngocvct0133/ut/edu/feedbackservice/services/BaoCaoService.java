package ngocvct0133.ut.edu.feedbackservice.services;

import ngocvct0133.ut.edu.feedbackservice.modules.BaoCao;
import ngocvct0133.ut.edu.feedbackservice.repositories.IBaoCaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaoCaoService implements IBaoCaoService {
    private final  IBaoCaoRepository baoCaoRepository;

    public BaoCaoService(IBaoCaoRepository baoCaoRepository) {
        this.baoCaoRepository = baoCaoRepository;
    }

    @Override
    public BaoCao themBaoCao(BaoCao baoCao) {
        return this.baoCaoRepository.save(baoCao);
    }

    @Override
    public boolean xoaBaoCao(Long id) {
        if (!this.baoCaoRepository.existsById(id)) {
            return false;
        }
        this.baoCaoRepository.deleteById(id);
        return true;
    }

    @Override
    public BaoCao suaBaoCao(Long id, BaoCao baoCao) {
        BaoCao suaBaoCao = this.baoCaoRepository.findById(id) .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));
        suaBaoCao.setLoaiBaoCao(baoCao.getLoaiBaoCao());
        suaBaoCao.setNoiDung(baoCao.getNoiDung());
        suaBaoCao.setTieuDe(baoCao.getTieuDe());
        suaBaoCao.setTrangThaiXuLy(baoCao.getTrangThaiXuLy());
        suaBaoCao.setPhanHoi(baoCao.getPhanHoi());
        return this.baoCaoRepository.save(suaBaoCao);
    }

    @Override
    public BaoCao layBaoCao(Long id) {
        return this.baoCaoRepository.findById(id) .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));
    }

    @Override
    public List<BaoCao> layTatCaBaoCao() {
        return this.baoCaoRepository.findAll();
    }
}
