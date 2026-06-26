import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/location_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/approval_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: MaterialApp(
        title: 'WTM RIDE - Driver',
        theme: ThemeData(
          primarySwatch: Colors.green,
          useMaterial3: true,
        ),
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, _) {
            if (!authProvider.isLoggedIn) {
              return const LoginScreen();
            }
            if (authProvider.driverStatus == 'pending') {
              return const ApprovalScreen();
            }
            return const HomeScreen();
          },
        ),
      ),
    );
  }
}
