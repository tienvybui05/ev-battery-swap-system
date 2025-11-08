package ngocvct0133.ut.edu.feedbackservice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ngocvct0133.ut.edu.feedbackservice.modules.BaoCao;
import ngocvct0133.ut.edu.feedbackservice.repositories.IBaoCaoRepository;

@Service
public class BaoCaoService implements IBaoCaoService {

    private final IBaoCaoRepository baoCaoRepository;

    @Autowired
    private FirebaseNotificationService firebaseService;

    public BaoCaoService(IBaoCaoRepository baoCaoRepository) {
        this.baoCaoRepository = baoCaoRepository;
    }

    @Override
    public BaoCao themBaoCao(BaoCao baoCao) {
        BaoCao saved = baoCaoRepository.save(baoCao);

        // 🔔 Gửi thông báo cho admin khi có báo cáo mới
        String title = "📢 Báo cáo mới từ tài xế #" + baoCao.getMaTaiXe();
        String body = baoCao.getTieuDe();

        // ⚙️ Gửi đến token admin (tạm thời hardcode, sau này lấy từ DB)
        firebaseNotificationService.sendNotification("FCM_TOKEN_ADMIN", title, body);

        return saved;
    }

    @Override
    public boolean xoaBaoCao(Long id) {
        if (!baoCaoRepository.existsById(id)) return false;
        baoCaoRepository.deleteById(id);
        return true;
    }

    @Override
    public BaoCao suaBaoCao(Long id, BaoCao baoCao) {
        BaoCao suaBaoCao = baoCaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));

        suaBaoCao.setLoaiBaoCao(baoCao.getLoaiBaoCao());
        suaBaoCao.setNoiDung(baoCao.getNoiDung());
        suaBaoCao.setTieuDe(baoCao.getTieuDe());
        suaBaoCao.setTrangThaiXuLy(baoCao.getTrangThaiXuLy());
        suaBaoCao.setPhanHoi(baoCao.getPhanHoi());

        return baoCaoRepository.save(suaBaoCao);
    }

    @Override
    public BaoCao layBaoCao(Long id) {
        return baoCaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));
    }

    @Override
    public List<BaoCao> layTatCaBaoCao() {
        return baoCaoRepository.findAll();
    }

    @Override
    public BaoCao phanHoiBaoCao(Long id, String phanHoi) {
        BaoCao bc = baoCaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo"));
        bc.setPhanHoi(phanHoi);
        bc.setTrangThaiXuLy("Đã phản hồi");
        BaoCao updated = baoCaoRepository.save(bc);

        // 🔔 Gửi thông báo realtime cho tài xế
        firebaseService.sendToDriver(
            bc.getMaTaiXe(),
            "📩 Phản hồi từ Admin",
            "Báo cáo \"" + bc.getTieuDe() + "\" đã được phản hồi."
        );

        return updated;
    }
    @Autowired
private FirebaseNotificationService firebaseNotificationService;


    
}
