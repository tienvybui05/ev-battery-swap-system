package ut.edu.stationservice.services;

import ut.edu.stationservice.models.Tram;

import java.util.List;

public interface ITramService {
    List<Tram> findByTramId(Long tramId);
    Tram findById(Long id);
    Tram save(Tram pin);
    boolean deleteById(Long id);
    Tram addPin(Tram pin);
    Tram updatePin(Tram pin);
}
