import 'package:flutter/material.dart';

class DiscountsScreen extends StatelessWidget {
  const DiscountsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Add Discount Code'),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 5,
            itemBuilder: (context, index) {
              return Card(
                child: ListTile(
                  title: Text('CODE${index + 1}'),
                  subtitle: Text('20% discount'),
                  trailing: PopupMenuButton(
                    itemBuilder: (context) => [
                      const PopupMenuItem(child: Text('Edit')),
                      const PopupMenuItem(child: Text('Delete')),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
