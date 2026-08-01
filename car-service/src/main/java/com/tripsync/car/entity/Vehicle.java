package com.tripsync.car.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private Integer year;

    @Column(name = "category")
    private String category;

    private String city;
    private Double pricePerDay;
    private Integer seats;

    @Column(name = "transmission")
    private String transmission;

    @Column(name = "fuel_type")
    private String fuelType;

    private String imageUrl;
    private Boolean available;
}
