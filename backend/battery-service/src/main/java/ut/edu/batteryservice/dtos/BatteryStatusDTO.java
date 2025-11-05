package ut.edu.batteryservice.dtos;

public class BatteryStatusDTO {
    private long tongSoPin;
    private long sanSang;
    private long dangSac;
    private long dangSuDung;
    private long baoTri;

    public BatteryStatusDTO() {}

    public BatteryStatusDTO(long tongSoPin, long sanSang, long dangSac, long dangSuDung, long baoTri) {
        this.tongSoPin = tongSoPin;
        this.sanSang = sanSang;
        this.dangSac = dangSac;
        this.dangSuDung = dangSuDung;
        this.baoTri = baoTri;
    }

    public long getTongSoPin() {
        return tongSoPin;
    }

    public void setTongSoPin(long tongSoPin) {
        this.tongSoPin = tongSoPin;
    }

    public long getSanSang() {
        return sanSang;
    }

    public void setSanSang(long sanSang) {
        this.sanSang = sanSang;
    }

    public long getDangSac() {
        return dangSac;
    }

    public void setDangSac(long dangSac) {
        this.dangSac = dangSac;
    }

    public long getDangSuDung() {
        return dangSuDung;
    }

    public void setDangSuDung(long dangSuDung) {
        this.dangSuDung = dangSuDung;
    }

    public long getBaoTri() {
        return baoTri;
    }

    public void setBaoTri(long baoTri) {
        this.baoTri = baoTri;
    }
}
