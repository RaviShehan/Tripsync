package com.tripsync.car.service;

import com.tripsync.car.entity.Vehicle;
import com.tripsync.car.event.InventoryEventPublisher;
import com.tripsync.car.repository.VehicleRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarServiceImpl implements CarService {

    private final VehicleRepository vehicleRepository;
    private final InventoryEventPublisher inventoryEventPublisher;

    public CarServiceImpl(VehicleRepository vehicleRepository,
                          InventoryEventPublisher inventoryEventPublisher) {
        this.vehicleRepository = vehicleRepository;
        this.inventoryEventPublisher = inventoryEventPublisher;
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    @Cacheable(value = "vehicles", key = "#id")
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        Vehicle saved = vehicleRepository.save(vehicle);
        inventoryEventPublisher.publishReserved(saved.getId(), saved.getCity(), 1);
        return saved;
    }

    @Override
    @CacheEvict(value = "vehicles", key = "#id")
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setCategory(vehicleDetails.getCategory());
        vehicle.setCity(vehicleDetails.getCity());
        vehicle.setPricePerDay(vehicleDetails.getPricePerDay());
        vehicle.setSeats(vehicleDetails.getSeats());
        vehicle.setTransmission(vehicleDetails.getTransmission());
        vehicle.setFuelType(vehicleDetails.getFuelType());
        vehicle.setImageUrl(vehicleDetails.getImageUrl());
        vehicle.setAvailable(vehicleDetails.getAvailable());

        return vehicleRepository.save(vehicle);
    }

    @Override
    @CacheEvict(value = "vehicles", key = "#id")
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }

    @Override
    public List<Vehicle> searchVehicles(String city, String category) {
        return vehicleRepository.search(city, category);
    }
}
