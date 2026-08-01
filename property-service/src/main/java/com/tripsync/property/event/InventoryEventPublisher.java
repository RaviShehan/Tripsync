package com.tripsync.property.event;

import tools.jackson.databind.ObjectMapper;
import com.tripsync.property.config.KafkaTopicConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class InventoryEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public InventoryEventPublisher(KafkaTemplate<String, String> kafkaTemplate,
                                   ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishReserved(Long propertyId, String city, int quantity) {
        try {
            Map<String, Object> event = Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", "INVENTORY_RESERVED",
                    "resourceType", "PROPERTY",
                    "resourceId", propertyId,
                    "city", city == null ? "" : city,
                    "quantity", quantity,
                    "timestamp", System.currentTimeMillis()
            );
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaTopicConfig.INVENTORY_EVENTS, "PROPERTY-" + propertyId, payload);
            log.info("Published INVENTORY_RESERVED for property {}", propertyId);
        } catch (Exception e) {
            log.error("Failed to publish inventory event", e);
        }
    }
}
