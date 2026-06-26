import 'package:flutter/material.dart';

class DriversScreen extends StatelessWidget {
  const DriversScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Pending'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Active'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 5,
            itemBuilder: (context, index) {
              return Card(
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.person_3)),
                  title: Text('Driver ${index + 1}'),
                  subtitle: Text('Vehicle: Tesla Model 3'),
                  trailing: PopupMenuButton(
                    itemBuilder: (context) => [
                      const PopupMenuItem(child: Text('Approve')),
                      const PopupMenuItem(child: Text('Reject')),
                      const PopupMenuItem(child: Text('Add Credit')),
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
