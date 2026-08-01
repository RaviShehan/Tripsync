import 'package:flutter/material.dart';

import '../core/constants/app_strings.dart';
import '../models/booking.dart';
import '../widgets/booking_card.dart';

class BookingConfirmationScreen extends StatelessWidget {
  const BookingConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final booking =
        ModalRoute.of(context)!.settings.arguments as Booking;
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Booking Confirmation')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Center(child: Icon(Icons.check_circle, color: Colors.green, size: 96)),
          const SizedBox(height: 16),
          Text(
            'Booking Confirmed!',
            style: theme.textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Your reservation is being processed.',
            style: theme.textTheme.bodyMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          BookingCard(booking: booking),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () {
              Navigator.pushNamedAndRemoveUntil(
                context,
                AppStrings.routeHome,
                (route) => false,
              );
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }
}
