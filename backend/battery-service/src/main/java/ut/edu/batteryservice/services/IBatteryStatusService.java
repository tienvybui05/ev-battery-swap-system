package ut.edu.batteryservice.services;

import ut.edu.batteryservice.dtos.BatteryStatusDTO;

public interface IBatteryStatusService {
    BatteryStatusDTO getBatteryStatusSummary();
}
