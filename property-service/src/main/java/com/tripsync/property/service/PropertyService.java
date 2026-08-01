package com.tripsync.property.service;

import com.tripsync.property.entity.Property;

import java.util.List;
import java.util.Optional;

public interface PropertyService {
    List<Property> getAllProperties();
    Optional<Property> getPropertyById(Long id);
    Property createProperty(Property property);
    Property updateProperty(Long id, Property propertyDetails);
    void deleteProperty(Long id);
    List<Property> searchProperties(String city, String type, Integer guests);
}
