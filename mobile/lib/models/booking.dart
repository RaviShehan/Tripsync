class Booking {
  final String id;
  final String userId;
  final String bookingType;
  final String referenceId;
  final DateTime startDate;
  final DateTime endDate;
  final int quantity;
  final num totalPrice;
  final String currency;
  final String status;
  final String paymentStatus;
  final DateTime createdAt;

  const Booking({
    required this.id,
    required this.userId,
    required this.bookingType,
    required this.referenceId,
    required this.startDate,
    required this.endDate,
    required this.quantity,
    required this.totalPrice,
    required this.currency,
    required this.status,
    required this.paymentStatus,
    required this.createdAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      bookingType: json['bookingType'] as String? ?? '',
      referenceId: json['referenceId'] as String? ?? '',
      startDate: _parseDate(json['startDate']),
      endDate: _parseDate(json['endDate']),
      quantity: json['quantity'] as int? ?? 1,
      totalPrice: json['totalPrice'] as num? ?? 0,
      currency: json['currency'] as String? ?? 'USD',
      status: json['status'] as String? ?? '',
      paymentStatus: json['paymentStatus'] as String? ?? '',
      createdAt: _parseDate(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'bookingType': bookingType,
      'referenceId': referenceId,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'quantity': quantity,
      'totalPrice': totalPrice,
      'currency': currency,
      'status': status,
      'paymentStatus': paymentStatus,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) {
      return DateTime.now();
    }
    return DateTime.tryParse(value.toString()) ?? DateTime.now();
  }
}
