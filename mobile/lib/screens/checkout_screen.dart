import 'package:flutter/material.dart';

import '../core/constants/app_strings.dart';
import '../services/booking_service.dart';

typedef CheckoutArguments = ({
  String bookingType,
  String referenceId,
  String title,
  String location,
  DateTime startDate,
  DateTime endDate,
  int quantity,
  num unitPrice,
});

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final BookingService _bookingService = BookingService();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _cardExpiryController = TextEditingController();
  final TextEditingController _cardCvcController = TextEditingController();

  late CheckoutArguments _args;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _args = ModalRoute.of(context)!.settings.arguments as CheckoutArguments;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _cardNumberController.dispose();
    _cardExpiryController.dispose();
    _cardCvcController.dispose();
    super.dispose();
  }

  num get _totalPrice => _args.unitPrice * _args.quantity;

  String get _typeLabel {
    switch (_args.bookingType) {
      case 'PROPERTY':
        return 'Property';
      case 'CAR':
        return 'Car';
      default:
        return 'Tour';
    }
  }

  Future<void> _confirmBooking() async {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }
    setState(() => _submitting = true);
    try {
      final booking = await _bookingService.createBooking(
        userId: 'demo-user',
        bookingType: _args.bookingType,
        referenceId: _args.referenceId,
        startDate: _args.startDate,
        endDate: _args.endDate,
        quantity: _args.quantity,
        unitPrice: _args.unitPrice,
      );
      if (!mounted) return;
      Navigator.pushReplacementNamed(
        context,
        AppStrings.routeBookingConfirmation,
        arguments: booking,
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Booking failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _args.title,
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(_typeLabel, style: theme.textTheme.bodySmall),
                    const SizedBox(height: 4),
                    Text(
                      '${_args.quantity} × \$${_args.unitPrice}',
                      style: theme.textTheme.bodyMedium,
                    ),
                    const Divider(height: 24),
                    Row(
                      children: [
                        Text('Total', style: theme.textTheme.titleMedium),
                        const Spacer(),
                        Text(
                          '\$$_totalPrice',
                          style: theme.textTheme.titleLarge,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text('Guest details', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Full name',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Enter your name'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Enter your email';
                }
                if (!value.contains('@')) {
                  return 'Enter a valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Phone',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 7)
                  ? 'Enter a valid phone number'
                  : null,
            ),
            const SizedBox(height: 16),
            Text('Payment', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            TextFormField(
              controller: _cardNumberController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Card number',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 12)
                  ? 'Enter a valid card number'
                  : null,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _cardExpiryController,
                    decoration: const InputDecoration(
                      labelText: 'MM/YY',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        (value == null || value.trim().length < 4)
                            ? 'Required'
                            : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _cardCvcController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'CVC',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        (value == null || value.trim().length < 3)
                            ? 'Required'
                            : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _submitting ? null : _confirmBooking,
              child: _submitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Confirm Booking'),
            ),
          ],
        ),
      ),
    );
  }
}
