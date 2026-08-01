package com.tripsync.booking.service;

import com.tripsync.booking.dto.BookingResponse;
import com.tripsync.booking.dto.CreateBookingRequest;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request);
    BookingResponse getBookingById(String id);
    List<BookingResponse> getBookingsByUserId(String userId);
    BookingResponse cancelBooking(String id);
    BookingResponse confirmBooking(String id);
}
