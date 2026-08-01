package com.tripsync.car.repository;

import com.tripsync.car.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByCityIgnoreCase(String city);

    List<Vehicle> findByCategoryIgnoreCase(String category);

    @Query("SELECT v FROM Vehicle v WHERE "
            + "(:city IS NULL OR LOWER(v.city) = LOWER(:city)) AND "
            + "(:category IS NULL OR LOWER(v.category) = LOWER(:category))")
    List<Vehicle> search(@Param("city") String city,
                         @Param("category") String category);
}
