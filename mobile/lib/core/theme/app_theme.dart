import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(seedColor: const Color(0xFF00897B));
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
