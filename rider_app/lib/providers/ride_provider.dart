import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RideProvider extends ChangeNotifier {
  String? _currentRideId;
  Map<String, dynamic>? _currentRide;
  bool _isLoading = false;
  String? _error;

  final String _baseUrl = 'http://localhost:5000/api';

  String? get currentRideId => _currentRideId;
  Map<String, dynamic>? get currentRide => _currentRide;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<bool> requestRide({
    required String token,
    required double pickupLat,
    required double pickupLng,
    required double dropLat,
    required double dropLng,
    required String pickupAddress,
    required String dropAddress,
    required String city,
    required String serviceType,
    String? discountCode,
    required String paymentMethod,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/rides/request'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'pickupLat': pickupLat,
          'pickupLng': pickupLng,
          'dropLat': dropLat,
          'dropLng': dropLng,
          'pickupAddress': pickupAddress,
          'dropAddress': dropAddress,
          'city': city,
          'serviceType': serviceType,
          'discountCode': discountCode,
          'paymentMethod': paymentMethod,
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        _currentRideId = data['ride']['_id'];
        _currentRide = data['ride'];
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to request ride';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> cancelRide(String token, String rideId, String reason) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/rides/$rideId/cancel'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'reason': reason}),
      );

      if (response.statusCode == 200) {
        _currentRideId = null;
        _currentRide = null;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to cancel ride';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void clearRide() {
    _currentRideId = null;
    _currentRide = null;
    notifyListeners();
  }
}
