package ngocvct0133.ut.edu.feedbackservice.services;

import ngocvct0133.ut.edu.feedbackservice.modules.BaoCao;

import java.util.List;

public interface IBaoCaoService {
    BaoCao themBaoCao(BaoCao baoCao);
    boolean xoaBaoCao(Long id);
    BaoCao suaBaoCao(Long id ,BaoCao baoCao);
    BaoCao layBaoCao(Long id);
    List<BaoCao> layTatCaBaoCao();
}
