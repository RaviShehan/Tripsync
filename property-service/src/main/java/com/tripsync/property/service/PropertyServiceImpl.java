package com.tripsync.property.service;

import com.tripsync.property.entity.Property;
import com.tripsync.property.event.InventoryEventPublisher;
import com.tripsync.property.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final InventoryEventPublisher inventoryEventPublisher;

    public PropertyServiceImpl(PropertyRepository propertyRepository,
                               InventoryEventPublisher inventoryEventPublisher) {
        this.propertyRepository = propertyRepository;
        this.inventoryEventPublisher = inventoryEventPublisher;
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    @Cacheable(value = "properties", key = "#id")
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    @Override
    public Property createProperty(Property property) {
        Property saved = propertyRepository.save(property);
        inventoryEventPublisher.publishReserved(saved.getId(), saved.getCity(), 1);
        return saved;
    }

    @Override
    @CacheEvict(value = "properties", key = "#id")
    public Property updateProperty(Long id, Property propertyDetails) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));

        property.setName(propertyDetails.getName());
        property.setDescription(propertyDetails.getDescription());
        property.setAddress(propertyDetails.getAddress());
        property.setCity(propertyDetails.getCity());
        property.setCountry(propertyDetails.getCountry());
        property.setType(propertyDetails.getType());
        property.setPricePerNight(propertyDetails.getPricePerNight());
        property.setMaxGuests(propertyDetails.getMaxGuests());
        property.setAmenities(propertyDetails.getAmenities());
        property.setImageUrl(propertyDetails.getImageUrl());
        property.setRating(propertyDetails.getRating());

        return propertyRepository.save(property);
    }

    @Override
    @CacheEvict(value = "properties", key = "#id")
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        propertyRepository.delete(property);
    }

    @Override
    public List<Property> searchProperties(String city, String type, Integer guests) {
        return propertyRepository.search(city, type, guests);
    }
}
