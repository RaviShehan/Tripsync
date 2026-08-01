import '../models/booking.dart';
import 'api_client.dart';

class BookingService {
  final ApiClient _apiClient;

  BookingService({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  num computeTotal({required num unitPrice, required int quantity}) {
    return unitPrice * quantity;
  }

  Future<Booking> createBooking({
    required String userId,
    required String bookingType,
    required String referenceId,
    required DateTime startDate,
    required DateTime endDate,
    required int quantity,
    required num unitPrice,
    String currency = 'USD',
  }) async {
    final totalPrice = computeTotal(unitPrice: unitPrice, quantity: quantity);
    return _apiClient.createBooking(
      userId: userId,
      bookingType: bookingType,
      referenceId: referenceId,
      startDate: startDate,
      endDate: endDate,
      quantity: quantity,
      totalPrice: totalPrice,
      currency: currency,
    );
  }
}
