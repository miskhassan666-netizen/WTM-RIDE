import 'package:flutter/material.dart';

class RidersScreen extends StatelessWidget {
  const RidersScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Search riders...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 5,
            itemBuilder: (context, index) {
              return Card(
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.person)),
                  title: Text('Rider ${index + 1}'),
                  subtitle: Text('0790000${index}00'),
                  trailing: const Icon(Icons.arrow_forward),
                  onTap: () {},
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
