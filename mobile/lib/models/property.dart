class Property {
  final String id;
  final String name;
  final String description;
  final String address;
  final String city;
  final String country;
  final String type;
  final num pricePerNight;
  final int maxGuests;
  final List<String> amenities;
  final String imageUrl;
  final num rating;

  const Property({
    required this.id,
    required this.name,
    required this.description,
    required this.address,
    required this.city,
    required this.country,
    required this.type,
    required this.pricePerNight,
    required this.maxGuests,
    required this.amenities,
    required this.imageUrl,
    required this.rating,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as String,
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      address: json['address'] as String? ?? '',
      city: json['city'] as String? ?? '',
      country: json['country'] as String? ?? '',
      type: json['type'] as String? ?? '',
      pricePerNight: json['pricePerNight'] as num? ?? 0,
      maxGuests: json['maxGuests'] as int? ?? 1,
      amenities: (json['amenities'] as List<dynamic>? ?? const [])
          .map((item) => item.toString())
          .toList(),
      imageUrl: json['imageUrl'] as String? ?? '',
      rating: json['rating'] as num? ?? 0,
    );
  }
}
