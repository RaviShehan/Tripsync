import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/booking.dart';
import '../models/car.dart';
import '../models/property.dart';
import '../models/tour.dart';

class ApiException implements Exception {
  final String message;

  const ApiException(this.message);

  @override
  String toString() => message;
}

class ApiClient {
  final http.Client _client;
  final String baseUrl;

  ApiClient({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        baseUrl = baseUrl ?? ApiConfig.baseUrl;

  Future<List<Tour>> getTours() async {
    final data = await _get('/api/v1/tours');
    return (data as List<dynamic>)
        .map((item) => Tour.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<Property>> getProperties({String? city, int? guests}) async {
    final query = <String, String>{
      if (city != null && city.trim().isNotEmpty) 'city': city,
      if (guests != null) 'guests': '$guests',
    };
    final data = await _get('/api/v1/properties', query);
    return (data as List<dynamic>)
        .map((item) => Property.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<Car>> getCars({String? city}) async {
    final query = <String, String>{
      if (city != null && city.trim().isNotEmpty) 'city': city,
    };
    final data = await _get('/api/v1/cars', query);
    return (data as List<dynamic>)
        .map((item) => Car.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Booking> createBooking({
    required String userId,
    required String bookingType,
    required String referenceId,
    required DateTime startDate,
    required DateTime endDate,
    required int quantity,
    required num totalPrice,
    required String currency,
  }) async {
    final uri = Uri.parse('$baseUrl/api/v1/bookings');
    final http.Response response;
    try {
      response = await _client
          .post(
            uri,
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode({
              'userId': userId,
              'bookingType': bookingType,
              'referenceId': referenceId,
              'startDate': startDate.toIso8601String(),
              'endDate': endDate.toIso8601String(),
              'quantity': quantity,
              'totalPrice': totalPrice,
              'currency': currency,
            }),
          )
          .timeout(const Duration(seconds: 10));
    } on TimeoutException {
      throw const ApiException('Request timed out');
    } catch (e) {
      throw ApiException('Network error: $e');
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return Booking.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    }
    throw ApiException('Booking failed with status ${response.statusCode}');
  }

  Future<dynamic> _get(String path, [Map<String, String>? query]) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: query);
    try {
      final response =
          await _client.get(uri).timeout(const Duration(seconds: 10));
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      }
      throw ApiException('Request failed with status ${response.statusCode}');
    } on TimeoutException {
      throw const ApiException('Request timed out');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Network error: $e');
    }
  }
}
