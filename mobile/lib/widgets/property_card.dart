import 'package:flutter/material.dart';

import '../models/property.dart';
import 'image_placeholder.dart';

class PropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback? onTap;
  final double imageHeight;

  const PropertyCard({
    super.key,
    required this.property,
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
              imageUrl: property.imageUrl,
              label: property.name,
              height: imageHeight,
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    property.name,
                    style: theme.textTheme.titleMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${property.city}, ${property.country}',
                    style: theme.textTheme.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 16),
                      const SizedBox(width: 4),
                      Text('${property.rating}'),
                      const SizedBox(width: 8),
                      Text(
                        '${property.maxGuests} guests',
                        style: theme.textTheme.bodySmall,
                      ),
                      const Spacer(),
                      Text(
                        '\$${property.pricePerNight}',
                        style: theme.textTheme.titleMedium,
                      ),
                      Text('/night', style: theme.textTheme.bodySmall),
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
