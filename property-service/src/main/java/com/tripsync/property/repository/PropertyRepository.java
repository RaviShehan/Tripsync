package com.tripsync.property.repository;

import com.tripsync.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCityIgnoreCase(String city);

    List<Property> findByTypeIgnoreCase(String type);

    @Query("SELECT p FROM Property p WHERE "
            + "(:city IS NULL OR LOWER(p.city) = LOWER(:city)) AND "
            + "(:type IS NULL OR LOWER(p.type) = LOWER(:type)) AND "
            + "(:guests IS NULL OR p.maxGuests >= :guests)")
    List<Property> search(@Param("city") String city,
                          @Param("type") String type,
                          @Param("guests") Integer guests);
}
