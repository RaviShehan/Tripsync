package com.tripsync.booking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateBookingRequest(
        @NotBlank String userId,
        @NotBlank String bookingType,
        @NotBlank String referenceId,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull @Min(1) Integer quantity,
        @NotNull @DecimalMin("0.01") BigDecimal totalPrice,
        String currency) {
}
