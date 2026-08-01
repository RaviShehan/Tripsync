class Tour {
  final String id;
  final String name;
  final String description;
  final num price;
  final String location;
  final num durationHours;
  final String category;
  final String imageUrl;
  final num rating;
  final int availableSlots;

  const Tour({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.location,
    required this.durationHours,
    required this.category,
    required this.imageUrl,
    required this.rating,
    required this.availableSlots,
  });

  factory Tour.fromJson(Map<String, dynamic> json) {
    return Tour(
      id: json['id'] as String,
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      price: json['price'] as num? ?? 0,
      location: json['location'] as String? ?? '',
      durationHours: json['durationHours'] as num? ?? 0,
      category: json['category'] as String? ?? '',
      imageUrl: json['imageUrl'] as String? ?? '',
      rating: json['rating'] as num? ?? 0,
      availableSlots: json['availableSlots'] as int? ?? 0,
    );
  }
}
