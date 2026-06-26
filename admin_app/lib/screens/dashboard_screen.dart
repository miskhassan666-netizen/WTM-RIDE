import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'riders_screen.dart';
import 'drivers_screen.dart';
import 'rides_screen.dart';
import 'pricing_screen.dart';
import 'discounts_screen.dart';
import 'wallet_screen.dart';
import 'recharge_requests_screen.dart';
import 'notifications_screen.dart';
import 'support_screen.dart';
import 'charity_screen.dart';
import 'ratings_screen.dart';
import 'settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final List<Widget> _screens = [
    const DashboardHomeScreen(),
    const RidersScreen(),
    const DriversScreen(),
    const RidesScreen(),
    const PricingScreen(),
    const DiscountsScreen(),
    const WalletScreen(),
    const RechargeRequestsScreen(),
    const NotificationsScreen(),
    const SupportScreen(),
    const CharityScreen(),
    const RatingsScreen(),
    const SettingsScreen(),
  ];

  final List<String> _titles = [
    'Dashboard',
    'Riders',
    'Drivers',
    'Rides',
    'Pricing',
    'Discounts',
    'Wallet',
    'Recharge Requests',
    'Notifications',
    'Support',
    'Charity Box',
    'Ratings',
    'Settings',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text(_titles[_selectedIndex]),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
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
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue.shade400),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Icon(Icons.admin_panel_settings, size: 50, color: Colors.white),
                  SizedBox(height: 8),
                  Text('WTM RIDE Admin', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            ..._buildDrawerItems(),
          ],
        ),
      ),
      body: _screens[_selectedIndex],
    );
  }

  List<Widget> _buildDrawerItems() {
    return [
      _drawerItem('Dashboard', 0, Icons.dashboard),
      _drawerItem('Riders', 1, Icons.person),
      _drawerItem('Drivers', 2, Icons.car_rental),
      _drawerItem('Rides', 3, Icons.directions_car),
      _drawerItem('Pricing', 4, Icons.price_change),
      _drawerItem('Discounts', 5, Icons.local_offer),
      _drawerItem('Wallet', 6, Icons.wallet),
      _drawerItem('Recharge Requests', 7, Icons.request_page),
      _drawerItem('Notifications', 8, Icons.notifications),
      _drawerItem('Support', 9, Icons.support_agent),
      _drawerItem('Charity Box', 10, Icons.favorite),
      _drawerItem('Ratings', 11, Icons.star),
      _drawerItem('Settings', 12, Icons.settings),
    ];
  }

  Widget _drawerItem(String title, int index, IconData icon) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      selected: _selectedIndex == index,
      onTap: () {
        setState(() => _selectedIndex = index);
        Navigator.pop(context);
      },
    );
  }
}

class DashboardHomeScreen extends StatelessWidget {
  const DashboardHomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Welcome to WTM RIDE Admin', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            children: [
              _StatCard('Total Riders', '0', Colors.blue),
              _StatCard('Total Drivers', '0', Colors.green),
              _StatCard('Total Rides', '0', Colors.orange),
              _StatCard('Revenue', '0 JOD', Colors.purple),
            ],
          ),
        ],
      ),
    );
  }

  Widget _StatCard(String title, String value, Color color) {
    return Card(
      elevation: 4,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: color.withOpacity(0.1),
          border: Border.all(color: color, width: 2),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }
}
