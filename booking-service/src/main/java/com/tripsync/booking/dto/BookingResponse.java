package com.tripsync.booking.dto;

import com.tripsync.booking.entity.Booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(
        String id,
        String userId,
        String bookingType,
        String referenceId,
        LocalDate startDate,
        LocalDate endDate,
        Integer quantity,
        BigDecimal totalPrice,
        String currency,
        String status,
        String paymentStatus,
        Instant createdAt) {

    public static BookingResponse from(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getUserId(),
                b.getBookingType(),
                b.getReferenceId(),
                b.getStartDate(),
                b.getEndDate(),
                b.getQuantity(),
                b.getTotalPrice(),
                b.getCurrency(),
                b.getStatus(),
                b.getPaymentStatus(),
                b.getCreatedAt());
    }
}
