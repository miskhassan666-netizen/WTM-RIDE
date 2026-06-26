import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class LocationProvider extends ChangeNotifier {
  Position? _currentPosition;
  bool _isOnline = false;

  Position? get currentPosition => _currentPosition;
  bool get isOnline => _isOnline;

  Future<void> startLocationTracking() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    if (permission == LocationPermission.whileInUse || permission == LocationPermission.always) {
      _currentPosition = await Geolocator.getCurrentPosition();
      notifyListeners();
    }
  }

  Future<void> updateLocation() async {
    try {
      _currentPosition = await Geolocator.getCurrentPosition();
      notifyListeners();
    } catch (e) {
      // Handle error
    }
  }

  void toggleOnlineStatus() {
    _isOnline = !_isOnline;
    notifyListeners();
  }
}
