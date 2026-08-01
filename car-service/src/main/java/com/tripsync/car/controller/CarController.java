package com.tripsync.car.controller;

import com.tripsync.car.entity.Vehicle;
import com.tripsync.car.service.CarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category) {
        if (city != null || category != null) {
            return ResponseEntity.ok(carService.searchVehicles(city, category));
        }
        return ResponseEntity.ok(carService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return carService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle created = carService.createVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        try {
            return ResponseEntity.ok(carService.updateVehicle(id, vehicleDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        try {
            carService.deleteVehicle(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
