import 'package:flutter/material.dart';

import '../models/tour.dart';
import 'image_placeholder.dart';

class TourCard extends StatelessWidget {
  final Tour tour;
  final VoidCallback? onTap;
  final double imageHeight;

  const TourCard({
    super.key,
    required this.tour,
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
              imageUrl: tour.imageUrl,
              label: tour.name,
              height: imageHeight,
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tour.name,
                    style: theme.textTheme.titleMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${tour.location} · ${tour.durationHours}h',
                    style: theme.textTheme.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 16),
                      const SizedBox(width: 4),
                      Text('${tour.rating}'),
                      const Spacer(),
                      Text(
                        '\$${tour.price}',
                        style: theme.textTheme.titleMedium,
                      ),
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
