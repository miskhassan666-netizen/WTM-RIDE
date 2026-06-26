import 'package:flutter/material.dart';

class PricingScreen extends StatefulWidget {
  const PricingScreen({Key? key}) : super(key: key);

  @override
  State<PricingScreen> createState() => _PricingScreenState();
}

class _PricingScreenState extends State<PricingScreen> {
  String _selectedCity = 'Amman';
  final _baseController = TextEditingController(text: '1.5');
  final _kmController = TextEditingController(text: '0.5');
  final _minController = TextEditingController(text: '2');

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DropdownButton<String>(
            value: _selectedCity,
            onChanged: (value) => setState(() => _selectedCity = value!),
            items: ['Amman', 'Zarqa', 'Irbid']
                .map((city) => DropdownMenuItem(value: city, child: Text(city)))
                .toList(),
          ),
          const SizedBox(height: 24),
          const Text('Pricing Configuration', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          TextField(
            controller: _baseController,
            decoration: InputDecoration(
              labelText: 'Base Fare (JOD)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _kmController,
            decoration: InputDecoration(
              labelText: 'Per KM Rate (JOD)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _minController,
            decoration: InputDecoration(
              labelText: 'Minimum Fare (JOD)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              child: const Text('Save Pricing'),
            ),
          ),
        ],
      ),
    );
  }
}
