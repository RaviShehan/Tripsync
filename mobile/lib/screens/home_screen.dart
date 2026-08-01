import 'package:flutter/material.dart' hide SearchBar;

import '../core/constants/app_strings.dart';
import '../models/car.dart';
import '../models/property.dart';
import '../models/tour.dart';
import '../services/api_client.dart';
import '../widgets/car_card.dart';
import '../widgets/navbar.dart';
import '../widgets/property_card.dart';
import '../widgets/search_bar.dart';
import '../widgets/tour_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tabIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Navbar(
      title: AppStrings.appTitle,
      selectedIndex: _tabIndex,
      onTabSelected: (index) => setState(() => _tabIndex = index),
      body: IndexedStack(
        index: _tabIndex,
        children: const [
          _DiscoverTab(),
          _SearchTab(),
          _BookingsTab(),
        ],
      ),
    );
  }
}

class _DiscoverTab extends StatefulWidget {
  const _DiscoverTab();

  @override
  State<_DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends State<_DiscoverTab> {
  final ApiClient _apiClient = ApiClient();
  List<Tour>? _tours;
  List<Property>? _properties;
  List<Car>? _cars;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait<Object>([
        _apiClient.getTours(),
        _apiClient.getProperties(),
        _apiClient.getCars(),
      ]);
      if (!mounted) return;
      setState(() {
        _tours = results[0] as List<Tour>;
        _properties = results[1] as List<Property>;
        _cars = results[2] as List<Car>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _openListing(String type, Object item) {
    Navigator.pushNamed(
      context,
      AppStrings.routeListingDetail,
      arguments: (type: type, item: item),
    );
  }

  void _openSearch(String query) {
    Navigator.pushNamed(
      context,
      AppStrings.routeSearch,
      arguments: query,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48),
              const SizedBox(height: 12),
              Text(
                'Could not load listings: $_error',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: _load, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Hello, traveler!', style: theme.textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text('Find your next trip', style: theme.textTheme.bodyMedium),
        const SizedBox(height: 16),
        SearchBar(hintText: 'Search by city', onSearch: _openSearch),
        _section(
          title: 'Featured Tours',
          count: _tours?.length ?? 0,
          itemBuilder: (context, index) {
            final tour = _tours![index];
            return SizedBox(
              width: 230,
              child: TourCard(
                tour: tour,
                onTap: () => _openListing('TOUR', tour),
              ),
            );
          },
        ),
        _section(
          title: 'Featured Properties',
          count: _properties?.length ?? 0,
          itemBuilder: (context, index) {
            final property = _properties![index];
            return SizedBox(
              width: 230,
              child: PropertyCard(
                property: property,
                imageHeight: 120,
                onTap: () => _openListing('PROPERTY', property),
              ),
            );
          },
        ),
        _section(
          title: 'Featured Cars',
          count: _cars?.length ?? 0,
          itemBuilder: (context, index) {
            final car = _cars![index];
            return SizedBox(
              width: 230,
              child: CarCard(
                car: car,
                imageHeight: 120,
                onTap: () => _openListing('CAR', car),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _section({
    required String title,
    required int count,
    required Widget Function(BuildContext, int) itemBuilder,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        if (count == 0)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text('Nothing to show yet.'),
          )
        else
          SizedBox(
            height: 240,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: count,
              separatorBuilder: (context, index) =>
                  const SizedBox(width: 12),
              itemBuilder: itemBuilder,
            ),
          ),
      ],
    );
  }
}

class _SearchTab extends StatelessWidget {
  const _SearchTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Search', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        SearchBar(
          hintText: 'Search by city',
          onSearch: (query) => Navigator.pushNamed(
            context,
            AppStrings.routeSearch,
            arguments: query,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Enter a city to browse properties, cars and tours.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }
}

class _BookingsTab extends StatelessWidget {
  const _BookingsTab();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.bookmarks_outlined, size: 64),
          const SizedBox(height: 12),
          Text('My Bookings', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Text(
            'Your bookings will appear here.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}
