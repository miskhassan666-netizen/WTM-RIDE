import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/ride_provider.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _pickupController = TextEditingController();
  final _dropController = TextEditingController();
  final _discountController = TextEditingController();
  String _selectedCity = 'Amman';
  String _selectedServiceType = 'Economy';
  String _selectedPaymentMethod = 'wallet';
  double _estimatedFare = 0;
  bool _showRideDetails = false;

  @override
  void dispose() {
    _pickupController.dispose();
    _dropController.dispose();
    _discountController.dispose();
    super.dispose();
  }

  void _requestRide() async {
    final rideProvider = Provider.of<RideProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    final success = await rideProvider.requestRide(
      token: authProvider.token!,
      pickupLat: 31.9454,
      pickupLng: 35.9284,
      dropLat: 31.8457,
      dropLng: 35.9027,
      pickupAddress: _pickupController.text,
      dropAddress: _dropController.text,
      city: _selectedCity,
      serviceType: _selectedServiceType,
      discountCode: _discountController.text.isNotEmpty ? _discountController.text : null,
      paymentMethod: _selectedPaymentMethod,
    );

    if (success && mounted) {
      setState(() => _showRideDetails = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ride requested! Waiting for driver...')),
      );
    }
  }

  void _cancelRide() async {
    final rideProvider = Provider.of<RideProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    await rideProvider.cancelRide(
      authProvider.token!,
      rideProvider.currentRideId!,
      'Rider requested cancellation',
    );

    if (mounted) {
      setState(() => _showRideDetails = false);
      rideProvider.clearRide();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WTM RIDE - Rider'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.of(context).pushReplacementNamed('/login');
            },
          ),
        ],
      ),
      body: _showRideDetails ? _buildRideDetailsSheet() : _buildBookingSheet(),
    );
  }

  Widget _buildBookingSheet() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const SizedBox(height: 16),
          const Text('Book a Ride', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          TextField(
            controller: _pickupController,
            decoration: InputDecoration(
              labelText: 'Pickup Location',
              prefixIcon: const Icon(Icons.location_on),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _dropController,
            decoration: InputDecoration(
              labelText: 'Drop Location',
              prefixIcon: const Icon(Icons.location_on),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 16),
          DropdownButton<String>(
            isExpanded: true,
            value: _selectedCity,
            onChanged: (value) => setState(() => _selectedCity = value!),
            items: ['Amman', 'Zarqa', 'Irbid']
                .map((city) => DropdownMenuItem(value: city, child: Text(city)))
                .toList(),
          ),
          const SizedBox(height: 12),
          DropdownButton<String>(
            isExpanded: true,
            value: _selectedServiceType,
            onChanged: (value) => setState(() => _selectedServiceType = value!),
            items: ['Economy', 'Premium', 'Luxury']
                .map((type) => DropdownMenuItem(value: type, child: Text(type)))
                .toList(),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _discountController,
            decoration: InputDecoration(
              labelText: 'Discount Code (Optional)',
              prefixIcon: const Icon(Icons.local_offer),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Payment Method:', style: TextStyle(fontWeight: FontWeight.bold)),
          Row(
            children: [
              Expanded(
                child: RadioListTile<String>(
                  title: const Text('Cash'),
                  value: 'cash',
                  groupValue: _selectedPaymentMethod,
                  onChanged: (value) => setState(() => _selectedPaymentMethod = value!),
                ),
              ),
              Expanded(
                child: RadioListTile<String>(
                  title: const Text('Wallet'),
                  value: 'wallet',
                  groupValue: _selectedPaymentMethod,
                  onChanged: (value) => setState(() => _selectedPaymentMethod = value!),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _requestRide,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Request Ride'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRideDetailsSheet() {
    return Consumer<RideProvider>(
      builder: (context, rideProvider, _) {
        final ride = rideProvider.currentRide;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const SizedBox(height: 16),
              const Text('Ride Details', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Driver Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 12),
                      const Text('Waiting for driver acceptance...', style: TextStyle(color: Colors.orange)),
                      const SizedBox(height: 16),
                      const Divider(),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Estimated Fare:'),
                          Text('${ride?['estimatedFare'] ?? 0} JOD', style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Distance:'),
                          Text('${ride?['estimatedDistance'] ?? 0} KM'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _cancelRide,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                  child: const Text('Cancel Ride'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
