import 'package:flutter/material.dart';

class RidesScreen extends StatelessWidget {
  const RidesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'From Date',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    suffixIcon: const Icon(Icons.calendar_today),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'To Date',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    suffixIcon: const Icon(Icons.calendar_today),
                  ),
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
                  title: Text('RIDE-${DateTime.now().millisecondsSinceEpoch}-${index + 1}'),
                  subtitle: Text('5 KM - 2.5 JOD'),
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
