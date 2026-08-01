package com.tripsync.booking.event;

import tools.jackson.databind.ObjectMapper;
import com.tripsync.booking.config.KafkaTopicConfig;
import com.tripsync.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishBookingEvent(String eventType, Booking booking) {
        try {
            Map<String, Object> event = Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", eventType,
                    "bookingId", booking.getId(),
                    "userId", booking.getUserId(),
                    "bookingType", booking.getBookingType(),
                    "referenceId", booking.getReferenceId(),
                    "status", booking.getStatus(),
                    "timestamp", System.currentTimeMillis()
            );
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaTopicConfig.BOOKING_EVENTS, booking.getId(), payload);
            log.info("Published booking event {} for booking {}", eventType, booking.getId());
        } catch (Exception e) {
            log.error("Failed to publish booking event {}", eventType, e);
        }
    }

    public void publishPaymentEvent(String eventType, Booking booking) {
        try {
            Map<String, Object> event = Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", eventType,
                    "bookingId", booking.getId(),
                    "amount", booking.getTotalPrice(),
                    "currency", booking.getCurrency(),
                    "timestamp", System.currentTimeMillis()
            );
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaTopicConfig.PAYMENT_EVENTS, booking.getId(), payload);
            log.info("Published payment event {} for booking {}", eventType, booking.getId());
        } catch (Exception e) {
            log.error("Failed to publish payment event {}", eventType, e);
        }
    }
}
