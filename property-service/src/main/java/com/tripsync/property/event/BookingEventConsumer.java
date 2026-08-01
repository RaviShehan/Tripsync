package com.tripsync.property.event;

import tools.jackson.databind.ObjectMapper;
import com.tripsync.property.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventConsumer {

    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopicConfig.BOOKING_EVENTS, groupId = "property-service")
    public void onBookingEvent(String message) {
        try {
            Map<?, ?> event = objectMapper.readValue(message, Map.class);
            log.info("PropertyService received booking event: type={}, bookingId={}",
                    event.get("eventType"), event.get("bookingId"));

            String eventType = String.valueOf(event.get("eventType"));
            if ("BOOKING_CONFIRMED".equals(eventType) || "BOOKING_CREATED".equals(eventType)) {
                log.info("Inventory reserved for property resourceId={}", event.get("referenceId"));
            } else if ("BOOKING_CANCELLED".equals(eventType)) {
                log.info("Inventory released for property resourceId={}", event.get("referenceId"));
            }
        } catch (Exception e) {
            log.error("Failed to process booking event", e);
        }
    }
}
