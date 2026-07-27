import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class OfflineService {
  static const String analyticsKey = 'cached_users';

  Future<void> saveUsers(List<dynamic> users) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      analyticsKey,
      jsonEncode(users),
    );
  }

  Future<List<dynamic>> loadUsers() async {
    final prefs = await SharedPreferences.getInstance();

    final data = prefs.getString(analyticsKey);

    if (data == null) {
      return [];
    }

    return jsonDecode(data);
  }
}