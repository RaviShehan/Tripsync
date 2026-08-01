import 'package:flutter/material.dart';

class ImagePlaceholder extends StatelessWidget {
  final String? imageUrl;
  final String label;
  final double height;
  final double? width;

  const ImagePlaceholder({
    super.key,
    this.imageUrl,
    required this.label,
    this.height = 120,
    this.width,
  });

  static const List<Color> _palette = [
    Color(0xFF00897B),
    Color(0xFF26A69A),
    Color(0xFF00695C),
    Color(0xFF4DB6AC),
    Color(0xFF80CBC4),
  ];

  Color get _color {
    final index = (label.hashCode & 0x7fffffff) % _palette.length;
    return _palette[index];
  }

  @override
  Widget build(BuildContext context) {
    final url = imageUrl;
    if (url != null && url.isNotEmpty) {
      return SizedBox(
        height: height,
        width: width,
        child: Image.network(
          url,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => _placeholder(),
        ),
      );
    }
    return _placeholder();
  }

  Widget _placeholder() {
    final initial =
        label.trim().isEmpty ? '?' : label.trim()[0].toUpperCase();
    return Container(
      height: height,
      width: width,
      color: _color,
      alignment: Alignment.center,
      child: Text(
        initial,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 36,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
