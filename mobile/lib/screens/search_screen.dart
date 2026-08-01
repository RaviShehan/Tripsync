import 'package:flutter/material.dart' hide SearchBar;

import '../core/constants/app_strings.dart';
import '../models/car.dart';
import '../models/property.dart';
import '../models/tour.dart';
import '../services/api_client.dart';
import '../widgets/car_card.dart';
import '../widgets/property_card.dart';
import '../widgets/search_bar.dart';
import '../widgets/tour_card.dart';

class SearchScreen extends StatefulWidget {
  final String? query;

  const SearchScreen({super.key, this.query});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final ApiClient _apiClient = ApiClient();
  late String _query;
  List<Property> _properties = [];
  List<Tour> _tours = [];
  List<Car> _cars = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    final args = ModalRoute.of(context)?.settings.arguments as String?;
    _query = widget.query ?? args ?? '';
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait<Object>([
        _apiClient.getProperties(city: _query),
        _apiClient.getTours(),
        _apiClient.getCars(city: _query),
      ]);
      if (!mounted) return;
      setState(() {
        _properties = results[0] as List<Property>;
        _tours = results[1] as List<Tour>;
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

  void _submitSearch(String query) {
    _query = query;
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: SearchBar(
              hintText: 'Search by city',
              onSearch: _submitSearch,
            ),
          ),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  Widget _buildBody() {
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
                'Could not load results: $_error',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: _load, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }
    return DefaultTabController(
      length: 3,
      child: Column(
        children: [
          const TabBar(
            tabs: [
              Tab(text: 'Properties'),
              Tab(text: 'Tours'),
              Tab(text: 'Cars'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                _propertyList(),
                _tourList(),
                _carList(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _propertyList() {
    if (_properties.isEmpty) {
      return const Center(child: Text('No properties found.'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _properties.length,
      itemBuilder: (context, index) {
        final property = _properties[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: PropertyCard(
            property: property,
            imageHeight: 160,
            onTap: () => _openListing('PROPERTY', property),
          ),
        );
      },
    );
  }

  Widget _tourList() {
    if (_tours.isEmpty) {
      return const Center(child: Text('No tours found.'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _tours.length,
      itemBuilder: (context, index) {
        final tour = _tours[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: TourCard(
            tour: tour,
            imageHeight: 160,
            onTap: () => _openListing('TOUR', tour),
          ),
        );
      },
    );
  }

  Widget _carList() {
    if (_cars.isEmpty) {
      return const Center(child: Text('No cars found.'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _cars.length,
      itemBuilder: (context, index) {
        final car = _cars[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: CarCard(
            car: car,
            imageHeight: 160,
            onTap: () => _openListing('CAR', car),
          ),
        );
      },
    );
  }
}
