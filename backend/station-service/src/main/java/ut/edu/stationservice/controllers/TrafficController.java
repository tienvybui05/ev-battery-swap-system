package ut.edu.stationservice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ut.edu.stationservice.services.ITrafficService;

@RestController
@RequestMapping("/api/station-service")
public class TrafficController {

    @Autowired
    private ITrafficService trafficService;

    @GetMapping("/realtime")
    public Object getAllRealtime(
            @RequestParam double originLat,
            @RequestParam double originLng
    ) {
        return trafficService.getTravelTimesForAllStations(originLat, originLng);
    }
}