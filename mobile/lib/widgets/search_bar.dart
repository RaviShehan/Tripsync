import 'package:flutter/material.dart';

class SearchBar extends StatefulWidget {
  final String hintText;
  final ValueChanged<String> onSearch;

  const SearchBar({
    super.key,
    this.hintText = 'Search',
    required this.onSearch,
  });

  @override
  State<SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final query = _controller.text.trim();
    if (query.isEmpty) {
      return;
    }
    widget.onSearch(query);
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _controller,
            textInputAction: TextInputAction.search,
            onSubmitted: (_) => _submit(),
            decoration: InputDecoration(
              hintText: widget.hintText,
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: Theme.of(context).colorScheme.surfaceContainerHighest,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(28),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconButton.filled(
          onPressed: _submit,
          icon: const Icon(Icons.arrow_forward),
          tooltip: 'Search',
        ),
      ],
    );
  }
}
