import 'package:flutter/material.dart';

import '../models/car.dart';
import 'image_placeholder.dart';

class CarCard extends StatelessWidget {
  final Car car;
  final VoidCallback? onTap;
  final double imageHeight;

  const CarCard({
    super.key,
    required this.car,
    this.onTap,
    this.imageHeight = 140,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      elevation: 2,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ImagePlaceholder(
              imageUrl: car.imageUrl,
              label: '${car.brand} ${car.model}',
              height: imageHeight,
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${car.brand} ${car.model}',
                    style: theme.textTheme.titleMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${car.year} · ${car.category} · ${car.city}',
                    style: theme.textTheme.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        car.available
                            ? Icons.check_circle
                            : Icons.cancel,
                        size: 16,
                        color: car.available ? Colors.green : Colors.red,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        car.available ? 'Available' : 'Unavailable',
                        style: theme.textTheme.bodySmall,
                      ),
                      const Spacer(),
                      Text(
                        '\$${car.pricePerDay}',
                        style: theme.textTheme.titleMedium,
                      ),
                      Text('/day', style: theme.textTheme.bodySmall),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
