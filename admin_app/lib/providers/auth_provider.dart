import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  Map<String, dynamic>? _admin;
  bool _isLoading = false;
  String? _error;

  final String _baseUrl = 'http://localhost:5000/api';

  bool get isLoggedIn => _token != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Map<String, dynamic>? get admin => _admin;
  String? get token => _token;

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('admin_token');
    if (_token != null) {
      notifyListeners();
    }
  }

  Future<bool> login(String phone, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['token'];
        _admin = data['admin'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('admin_token', _token!);

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Invalid credentials';
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
    _admin = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('admin_token');
    notifyListeners();
  }
}
