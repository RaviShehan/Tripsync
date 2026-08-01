package com.tripsync.booking.service;

import com.tripsync.booking.dto.BookingResponse;
import com.tripsync.booking.dto.CreateBookingRequest;
import com.tripsync.booking.entity.Booking;
import com.tripsync.booking.entity.BookingStatus;
import com.tripsync.booking.event.BookingEventPublisher;
import com.tripsync.booking.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingEventPublisher bookingEventPublisher;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              BookingEventPublisher bookingEventPublisher) {
        this.bookingRepository = bookingRepository;
        this.bookingEventPublisher = bookingEventPublisher;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        Booking booking = Booking.builder()
                .id(UUID.randomUUID().toString())
                .userId(request.userId())
                .bookingType(request.bookingType())
                .referenceId(request.referenceId())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .quantity(request.quantity())
                .totalPrice(request.totalPrice())
                .currency(request.currency() == null ? "USD" : request.currency())
                .status(BookingStatus.STATUS_PENDING)
                .paymentStatus(BookingStatus.PAYMENT_UNPAID)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        validateDates(booking);

        Booking saved = bookingRepository.save(booking);
        bookingEventPublisher.publishBookingEvent("BOOKING_CREATED", saved);
        bookingEventPublisher.publishPaymentEvent("PAYMENT_PROCESSING", saved);

        log.info("Booking {} created for user {} ({} #{})",
                saved.getId(), saved.getUserId(), saved.getBookingType(), saved.getReferenceId());
        return BookingResponse.from(saved);
    }

    @Override
    @Cacheable(value = "bookings", key = "#id")
    public BookingResponse getBookingById(String id) {
        Booking booking = findOrThrow(id);
        return BookingResponse.from(booking);
    }

    @Override
    public List<BookingResponse> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingResponse::from)
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "bookings", key = "#id")
    public BookingResponse cancelBooking(String id) {
        Booking booking = findOrThrow(id);
        validateState(booking.getStatus(), BookingStatus.STATUS_CANCELLED);

        booking.setStatus(BookingStatus.STATUS_CANCELLED);
        if (BookingStatus.PAYMENT_PAID.equals(booking.getPaymentStatus())) {
            booking.setPaymentStatus(BookingStatus.PAYMENT_REFUNDED);
        }
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        bookingEventPublisher.publishBookingEvent("BOOKING_CANCELLED", saved);
        bookingEventPublisher.publishPaymentEvent("PAYMENT_REFUNDED", saved);

        log.info("Booking {} cancelled", id);
        return BookingResponse.from(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "bookings", key = "#id")
    public BookingResponse confirmBooking(String id) {
        Booking booking = findOrThrow(id);
        validateState(booking.getStatus(), BookingStatus.STATUS_CONFIRMED);

        booking.setStatus(BookingStatus.STATUS_CONFIRMED);
        booking.setPaymentStatus(BookingStatus.PAYMENT_PAID);
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        bookingEventPublisher.publishBookingEvent("BOOKING_CONFIRMED", saved);

        log.info("Booking {} confirmed", id);
        return BookingResponse.from(saved);
    }

    private Booking findOrThrow(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
    }

    private void validateState(String current, String target) {
        boolean valid = switch (current) {
            case BookingStatus.STATUS_PENDING ->
                    target.equals(BookingStatus.STATUS_CONFIRMED) || target.equals(BookingStatus.STATUS_CANCELLED);
            case BookingStatus.STATUS_CONFIRMED ->
                    target.equals(BookingStatus.STATUS_CANCELLED) || target.equals(BookingStatus.STATUS_COMPLETED);
            case BookingStatus.STATUS_CANCELLED, BookingStatus.STATUS_COMPLETED -> false;
            default -> false;
        };
        if (!valid) {
            throw new IllegalStateException("Illegal state transition from " + current + " to " + target);
        }
    }

    private void validateDates(Booking booking) {
        if (booking.getEndDate() != null && booking.getEndDate().isBefore(booking.getStartDate())) {
            throw new IllegalArgumentException("endDate must not be before startDate");
        }
        if (booking.getTotalPrice() == null || booking.getTotalPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("totalPrice must be positive");
        }
    }
}
