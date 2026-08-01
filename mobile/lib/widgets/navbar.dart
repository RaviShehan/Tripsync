import 'package:flutter/material.dart';

class Navbar extends StatelessWidget {
  final String title;
  final Widget body;
  final int selectedIndex;
  final ValueChanged<int> onTabSelected;

  const Navbar({
    super.key,
    required this.title,
    required this.body,
    required this.selectedIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: body,
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        onDestinationSelected: onTabSelected,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: 'Discover',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Search',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmarks_outlined),
            selectedIcon: Icon(Icons.bookmarks),
            label: 'Bookings',
          ),
        ],
      ),
    );
  }
}
