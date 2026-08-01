package com.tripsync.booking.event;

import tools.jackson.databind.ObjectMapper;
import com.tripsync.booking.config.KafkaTopicConfig;
import com.tripsync.booking.entity.Booking;
import com.tripsync.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final ObjectMapper objectMapper;
    private final BookingService bookingService;

    @KafkaListener(topics = KafkaTopicConfig.PAYMENT_EVENTS, groupId = "booking-service")
    public void onPaymentEvent(String message) {
        try {
            Map<?, ?> event = objectMapper.readValue(message, Map.class);
            String bookingId = String.valueOf(event.get("bookingId"));
            String eventType = String.valueOf(event.get("eventType"));
            log.info("BookingService received payment event: type={}, bookingId={}", eventType, bookingId);

            if ("PAYMENT_SUCCEEDED".equals(eventType)) {
                bookingService.confirmBooking(bookingId);
            }
        } catch (Exception e) {
            log.error("Failed to process payment event", e);
        }
    }

    @KafkaListener(topics = KafkaTopicConfig.INVENTORY_EVENTS, groupId = "booking-service")
    public void onInventoryEvent(String message) {
        try {
            Map<?, ?> event = objectMapper.readValue(message, Map.class);
            log.info("BookingService received inventory event: type={}, resource={}",
                    event.get("eventType"), event.get("resourceId"));
        } catch (Exception e) {
            log.error("Failed to process inventory event", e);
        }
    }
}
