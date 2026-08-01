package com.tripsync.property.service;

import com.tripsync.property.entity.Property;
import com.tripsync.property.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    @Override
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(Long id, Property propertyDetails) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));

        property.setName(propertyDetails.getName());
        property.setDescription(propertyDetails.getDescription());
        property.setAddress(propertyDetails.getAddress());
        property.setCity(propertyDetails.getCity());
        property.setCountry(propertyDetails.getCountry());
        property.setPricePerNight(propertyDetails.getPricePerNight());
        property.setMaxGuests(propertyDetails.getMaxGuests());

        return propertyRepository.save(property);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        propertyRepository.delete(property);
    }
}
