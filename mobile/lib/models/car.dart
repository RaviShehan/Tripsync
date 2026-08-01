class Car {
  final String id;
  final String brand;
  final String model;
  final int year;
  final String category;
  final String city;
  final num pricePerDay;
  final int seats;
  final String transmission;
  final String fuelType;
  final String imageUrl;
  final bool available;

  const Car({
    required this.id,
    required this.brand,
    required this.model,
    required this.year,
    required this.category,
    required this.city,
    required this.pricePerDay,
    required this.seats,
    required this.transmission,
    required this.fuelType,
    required this.imageUrl,
    required this.available,
  });

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      id: json['id'] as String,
      brand: json['brand'] as String? ?? '',
      model: json['model'] as String? ?? '',
      year: json['year'] as int? ?? 0,
      category: json['category'] as String? ?? '',
      city: json['city'] as String? ?? '',
      pricePerDay: json['pricePerDay'] as num? ?? 0,
      seats: json['seats'] as int? ?? 0,
      transmission: json['transmission'] as String? ?? '',
      fuelType: json['fuelType'] as String? ?? '',
      imageUrl: json['imageUrl'] as String? ?? '',
      available: json['available'] as bool? ?? false,
    );
  }
}
