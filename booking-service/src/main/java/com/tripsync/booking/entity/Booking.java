package com.tripsync.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String userId;

    @Column(name = "booking_type")
    private String bookingType;

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private Integer quantity;

    @Column(name = "total_price", precision = 12, scale = 2)
    private BigDecimal totalPrice;

    private String currency;

    private String status;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
