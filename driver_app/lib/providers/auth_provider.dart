import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  Map<String, dynamic>? _driver;
  bool _isLoading = false;
  String? _error;
  String? _driverStatus;

  final String _baseUrl = 'http://localhost:5000/api';

  bool get isLoggedIn => _token != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Map<String, dynamic>? get driver => _driver;
  String? get token => _token;
  String? get driverStatus => _driverStatus;

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('driver_token');
    if (_token != null) {
      notifyListeners();
    }
  }

  Future<bool> register(String name, String phone, String password, String vehicleType, String vehicleModel) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/drivers/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'phone': phone,
          'password': password,
          'vehicleType': vehicleType,
          'vehicleModel': vehicleModel,
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        _driver = data['driver'];
        _driverStatus = 'pending';

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Registration failed';
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

  Future<bool> login(String phone, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/drivers/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['token'];
        _driver = data['driver'];
        _driverStatus = _driver?['status'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('driver_token', _token!);

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = jsonDecode(response.body)['message'];
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

  Future<void> logout() async {
    _token = null;
    _driver = null;
    _driverStatus = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('driver_token');
    notifyListeners();
  }
}
