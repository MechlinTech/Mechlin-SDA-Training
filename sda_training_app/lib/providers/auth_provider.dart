import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _loading = false;

  User? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isLoading => _loading;

  Future<void> loadSession() async {
    final prefs = await SharedPreferences.getInstance();

    final email = prefs.getString('email');
    final name = prefs.getString('name');

    if (email != null && name != null) {
      _user = User(
        id: '1',
        name: name,
        email: email,
      );
    }

    notifyListeners();
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _loading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 2));

    _user = User(
      id: '1',
      name: 'Prateek',
      email: email,
    );

    final prefs = await SharedPreferences.getInstance();

    await prefs.setString('email', email);
    await prefs.setString('name', 'Prateek');

    _loading = false;
    notifyListeners();

    return true;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.clear();

    _user = null;

    notifyListeners();
  }
}