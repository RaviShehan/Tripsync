package com.tripsync.booking.controller;

import com.tripsync.booking.dto.BookingResponse;
import com.tripsync.booking.dto.CreateBookingRequest;
import com.tripsync.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
