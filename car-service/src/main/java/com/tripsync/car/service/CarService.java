package com.tripsync.car.service;

import com.tripsync.car.entity.Vehicle;

import java.util.List;
import java.util.Optional;

public interface CarService {
    List<Vehicle> getAllVehicles();
    Optional<Vehicle> getVehicleById(Long id);
    Vehicle createVehicle(Vehicle vehicle);
    Vehicle updateVehicle(Long id, Vehicle vehicleDetails);
    void deleteVehicle(Long id);
    List<Vehicle> searchVehicles(String city, String category);
}
