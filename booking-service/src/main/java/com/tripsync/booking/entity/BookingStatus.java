package com.tripsync.booking.entity;

public final class BookingStatus {

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_CANCELLED = "CANCELLED";
    public static final String STATUS_COMPLETED = "COMPLETED";

    public static final String PAYMENT_UNPAID = "UNPAID";
    public static final String PAYMENT_PAID = "PAID";
    public static final String PAYMENT_REFUNDED = "REFUNDED";

    private BookingStatus() {
    }
}
