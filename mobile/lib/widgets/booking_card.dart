import 'package:flutter/material.dart';

import '../models/booking.dart';

class BookingCard extends StatelessWidget {
  final Booking booking;

  const BookingCard({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Chip(label: Text(booking.bookingType)),
                const Spacer(),
                Text(
                  '${booking.currency} ${booking.totalPrice}',
                  style: theme.textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16),
                const SizedBox(width: 8),
                Text(
                  '${_formatDate(booking.startDate)} → ${_formatDate(booking.endDate)}',
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.confirmation_number, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text('Booking #${booking.id}'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.info_outline, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${booking.status} · ${booking.paymentStatus}',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  static String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}
