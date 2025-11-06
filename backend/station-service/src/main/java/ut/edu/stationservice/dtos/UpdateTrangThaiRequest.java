package ut.edu.stationservice.dtos;

public class UpdateTrangThaiRequest {
    private String trangThaiXacNhan;
    private String trangThaiDoiPin;

    public String getTrangThaiXacNhan() { return trangThaiXacNhan; }
    public void setTrangThaiXacNhan(String trangThaiXacNhan) { this.trangThaiXacNhan = trangThaiXacNhan; }

    public String getTrangThaiDoiPin() { return trangThaiDoiPin; }
    public void setTrangThaiDoiPin(String trangThaiDoiPin) { this.trangThaiDoiPin = trangThaiDoiPin; }
}