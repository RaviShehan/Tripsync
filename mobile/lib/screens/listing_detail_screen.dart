import 'package:flutter/material.dart';

import '../core/constants/app_strings.dart';
import '../models/car.dart';
import '../models/property.dart';
import '../models/tour.dart';
import '../widgets/image_placeholder.dart';

typedef ListingArguments = ({String type, Object item});

class ListingDetailScreen extends StatefulWidget {
  const ListingDetailScreen({super.key});

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  late String _bookingType;
  late String _referenceId;
  late String _title;
  late String _description;
  late String _location;
  late num _unitPrice;
  late num _rating;
  late DateTime _startDate;
  late DateTime _endDate;
  late int _quantity;
  late int _maxQuantity;

  bool get _isRangeBooking =>
      _bookingType == 'PROPERTY' || _bookingType == 'CAR';

  int get _durationUnits {
    if (_bookingType == 'PROPERTY' || _bookingType == 'CAR') {
      final units = _endDate.difference(_startDate).inDays;
      return units < 1 ? 1 : units;
    }
    return 1;
  }

  num get _reservationPrice => _unitPrice * _durationUnits;

  num get _totalPrice => _reservationPrice * _quantity;

  String get _priceLabel {
    switch (_bookingType) {
      case 'PROPERTY':
        return '/ night';
      case 'CAR':
        return '/ day';
      default:
        return 'per person';
    }
  }

  String get _quantityLabel {
    switch (_bookingType) {
      case 'PROPERTY':
        return 'Guests';
      case 'CAR':
        return 'Vehicles';
      default:
        return 'Travelers';
    }
  }

  @override
  void initState() {
    super.initState();
    final args = ModalRoute.of(context)!.settings.arguments as ListingArguments;
    final now = DateTime.now();
    _startDate = now;
    _endDate = now;
    _quantity = 1;
    switch (args.type) {
      case 'PROPERTY':
        final property = args.item as Property;
        _bookingType = 'PROPERTY';
        _referenceId = property.id;
        _title = property.name;
        _description = property.description;
        _location = '${property.city}, ${property.country}';
        _unitPrice = property.pricePerNight;
        _rating = property.rating;
        _maxQuantity = property.maxGuests;
        _endDate = now.add(const Duration(days: 2));
        break;
      case 'CAR':
        final car = args.item as Car;
        _bookingType = 'CAR';
        _referenceId = car.id;
        _title = '${car.brand} ${car.model}';
        _description =
            '${car.year} · ${car.category} · ${car.seats} seats · ${car.transmission} · ${car.fuelType}';
        _location = car.city;
        _unitPrice = car.pricePerDay;
        _rating = 0;
        _maxQuantity = 5;
        _endDate = now.add(const Duration(days: 1));
        break;
      case 'TOUR':
        final tour = args.item as Tour;
        _bookingType = 'TOUR';
        _referenceId = tour.id;
        _title = tour.name;
        _description = tour.description;
        _location = tour.location;
        _unitPrice = tour.price;
        _rating = tour.rating;
        _maxQuantity = tour.availableSlots > 0 ? tour.availableSlots : 10;
        break;
      default:
        _bookingType = 'TOUR';
        _referenceId = '';
        _title = 'Listing';
        _description = '';
        _location = '';
        _unitPrice = 0;
        _rating = 0;
        _maxQuantity = 10;
    }
  }

  Future<void> _pickDateRange() async {
    final range = await showDateRangePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: DateTimeRange(start: _startDate, end: _endDate),
    );
    if (range != null) {
      setState(() {
        _startDate = range.start;
        _endDate = range.end;
      });
    }
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() {
        _startDate = date;
        _endDate = date;
      });
    }
  }

  void _reserve() {
    Navigator.pushNamed(
      context,
      AppStrings.routeCheckout,
      arguments: (
        bookingType: _bookingType,
        referenceId: _referenceId,
        title: _title,
        location: _location,
        startDate: _startDate,
        endDate: _endDate,
        quantity: _quantity,
        unitPrice: _reservationPrice,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Listing Details')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ImagePlaceholder(label: _title, height: 200),
          const SizedBox(height: 16),
          Text(_title, style: theme.textTheme.headlineSmall),
          const SizedBox(height: 8),
          if (_rating > 0)
            Row(
              children: [
                const Icon(Icons.star, color: Colors.amber, size: 18),
                const SizedBox(width: 4),
                Text(_rating.toStringAsFixed(1)),
                const SizedBox(width: 12),
                const Icon(Icons.place_outlined, size: 18),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    _location,
                    style: theme.textTheme.bodyMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            )
          else
            Row(
              children: [
                const Icon(Icons.place_outlined, size: 18),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    _location,
                    style: theme.textTheme.bodyMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          const SizedBox(height: 12),
          Text(_description, style: theme.textTheme.bodyMedium),
          const SizedBox(height: 16),
          Text(
            '\$$_unitPrice$_priceLabel',
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 16),
          Text(
            _isRangeBooking ? 'Dates' : 'Date',
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          if (_isRangeBooking)
            OutlinedButton.icon(
              onPressed: _pickDateRange,
              icon: const Icon(Icons.date_range),
              label: Text(
                '${_formatDate(_startDate)} → ${_formatDate(_endDate)}',
              ),
            )
          else
            OutlinedButton.icon(
              onPressed: _pickDate,
              icon: const Icon(Icons.event),
              label: Text(_formatDate(_startDate)),
            ),
          const SizedBox(height: 16),
          Row(
            children: [
              Text(_quantityLabel, style: theme.textTheme.titleMedium),
              const Spacer(),
              IconButton(
                onPressed: _quantity > 1
                    ? () => setState(() => _quantity--)
                    : null,
                icon: const Icon(Icons.remove_circle_outline),
              ),
              Text('$_quantity', style: theme.textTheme.titleMedium),
              IconButton(
                onPressed: _quantity < _maxQuantity
                    ? () => setState(() => _quantity++)
                    : null,
                icon: const Icon(Icons.add_circle_outline),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Text('Total', style: theme.textTheme.titleLarge),
              const Spacer(),
              Text('\$$_totalPrice', style: theme.textTheme.titleLarge),
            ],
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _reserve,
            child: const Text('Reserve'),
          ),
        ],
      ),
    );
  }

  static String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}
