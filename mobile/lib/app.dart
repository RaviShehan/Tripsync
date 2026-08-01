import 'package:flutter/material.dart';

import 'core/constants/app_strings.dart';
import 'core/theme/app_theme.dart';
import 'screens/booking_confirmation_screen.dart';
import 'screens/checkout_screen.dart';
import 'screens/home_screen.dart';
import 'screens/listing_detail_screen.dart';
import 'screens/search_screen.dart';

class TripSyncApp extends StatelessWidget {
  const TripSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppStrings.appTitle,
      theme: AppTheme.light(),
      initialRoute: AppStrings.routeHome,
      routes: {
        AppStrings.routeHome: (context) => const HomeScreen(),
        AppStrings.routeSearch: (context) => const SearchScreen(),
        AppStrings.routeListingDetail: (context) =>
            const ListingDetailScreen(),
        AppStrings.routeCheckout: (context) => const CheckoutScreen(),
        AppStrings.routeBookingConfirmation: (context) =>
            const BookingConfirmationScreen(),
      },
    );
  }
}
