import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/location_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Provider.of<LocationProvider>(context, listen: false).startLocationTracking();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WTM RIDE - Driver'),
      ),
      body: Consumer<LocationProvider>(
        builder: (context, locationProvider, _) {
          return Stack(
            children: [
              // Map placeholder
              Container(
                color: Colors.blue.shade100,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.location_on, size: 60, color: Colors.blue),
                      const SizedBox(height: 16),
                      Text(
                        'Location: ${locationProvider.currentPosition?.latitude.toString() ?? "Loading..."}',
                        style: const TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
              // Bottom sheet with controls
              DraggableScrollableSheet(
                initialChildSize: 0.25,
                minChildSize: 0.15,
                maxChildSize: 0.5,
                builder: (context, scrollController) {
                  return Card(
                    elevation: 8,
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                    ),
                    child: ListView(
                      controller: scrollController,
                      children: [
                        const SizedBox(height: 8),
                        Center(
                          child: Container(
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  ElevatedButton.icon(
                                    onPressed: () => locationProvider.updateLocation(),
                                    icon: const Icon(Icons.my_location),
                                    label: const Text('Update Location'),
                                  ),
                                  SizedBox(
                                    width: 100,
                                    child: ElevatedButton(
                                      onPressed: () => locationProvider.toggleOnlineStatus(),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: locationProvider.isOnline ? Colors.green : Colors.grey,
                                      ),
                                      child: Text(locationProvider.isOnline ? 'Online' : 'Offline'),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.support_agent),
                                label: const Text('Support'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}
