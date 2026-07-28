import 'dart:convert';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineService {
  OfflineService._();

  static final OfflineService instance = OfflineService._();

  static const String analyticsKey = 'cached_users';
  static const String queueKey = 'offline_queue';

  bool _isOnline = true;

  final List<Map<String, dynamic>> _offlineQueue = [];

  bool get isOnline => _isOnline;

  Future<void> initialize() async {
    await _loadQueue();

    final connectivity =
        await Connectivity().checkConnectivity();

    _isOnline =
        !connectivity.contains(ConnectivityResult.none);

    Connectivity().onConnectivityChanged.listen(
      (results) async {
        final connected =
            !results.contains(ConnectivityResult.none);

        if (connected && !_isOnline) {
          _isOnline = true;

          await syncQueue();
        } else {
          _isOnline = connected;
        }
      },
    );
  }

  Future<void> saveUsers(
    List<dynamic> users,
  ) async {
    final prefs =
        await SharedPreferences.getInstance();

    await prefs.setString(
      analyticsKey,
      jsonEncode(users),
    );
  }

  Future<List<dynamic>> loadUsers() async {
    final prefs =
        await SharedPreferences.getInstance();

    final data =
        prefs.getString(analyticsKey);

    if (data == null) {
      return [];
    }

    return jsonDecode(data);
  }
  Future<void> queueRequest({
    required String method,
    required String endpoint,
    Map<String, dynamic>? data,
  }) async {
    _offlineQueue.add({
      'method': method,
      'endpoint': endpoint,
      'data': data,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'retry': 0,
    });

    await _saveQueue();

    debugPrint('Offline request queued');
  }

  Future<void> _saveQueue() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      queueKey,
      jsonEncode(_offlineQueue),
    );
  }

  Future<void> _loadQueue() async {
    final prefs = await SharedPreferences.getInstance();

    final data = prefs.getString(queueKey);

    if (data == null) return;

    final List decoded = jsonDecode(data);

    _offlineQueue
      ..clear()
      ..addAll(decoded.cast<Map<String, dynamic>>());
  }

  List<Map<String, dynamic>> getOfflineQueue() {
    return List.unmodifiable(_offlineQueue);
  }

  Future<void> clearQueue() async {
    _offlineQueue.clear();

    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(queueKey);
  }

  Future<void> syncQueue() async {
    if (!_isOnline) return;

    if (_offlineQueue.isEmpty) return;

    debugPrint(
      'Syncing ${_offlineQueue.length} offline requests...',
    );

    final pending =
        List<Map<String, dynamic>>.from(_offlineQueue);

    _offlineQueue.clear();

    for (final request in pending) {
      try {
        debugPrint(
          'Syncing ${request['method']} ${request['endpoint']}',
        );

        // TODO:
        // Call ApiService here once it is fully integrated.
        //
        // Example:
        // await ApiService.instance.request(...);

      } catch (e) {
        final retry = (request['retry'] ?? 0) + 1;

        if (retry <= 3) {
          request['retry'] = retry;
          _offlineQueue.add(request);
        }

        debugPrint(
          'Failed to sync request: $e',
        );
      }
    }

    await _saveQueue();
  }
  // ==========================
  // Generic Cache Methods
  // ==========================

  Future<void> saveCache(
    String key,
    dynamic value,
  ) async {
    final prefs = await SharedPreferences.getInstance();

    final cache = {
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'data': value,
    };

    await prefs.setString(
      key,
      jsonEncode(cache),
    );
  }

  Future<dynamic> loadCache(
    String key, {
    Duration? expiry,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    final value = prefs.getString(key);

    if (value == null) {
      return null;
    }

    try {
      final decoded =
          jsonDecode(value) as Map<String, dynamic>;

      if (expiry != null) {
        final timestamp = decoded['timestamp'] as int;

        final cacheTime = DateTime.fromMillisecondsSinceEpoch(
          timestamp,
        );

        if (DateTime.now().difference(cacheTime) > expiry) {
          await prefs.remove(key);

          return null;
        }
      }

      return decoded['data'];
    } catch (e) {
      debugPrint('Cache Error: $e');

      return null;
    }
  }

  Future<void> removeCache(
    String key,
  ) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(key);
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(queueKey);
    await prefs.remove(analyticsKey);

    _offlineQueue.clear();

    debugPrint('Offline data cleared');
  }

  Future<void> clearExpiredCache(
    List<String> keys,
    Duration expiry,
  ) async {
    for (final key in keys) {
      await loadCache(
        key,
        expiry: expiry,
      );
    }
  }

  int get queueLength => _offlineQueue.length;

  bool get hasPendingRequests =>
      _offlineQueue.isNotEmpty;

  Map<String, dynamic> getStatus() {
    return {
      'online': _isOnline,
      'queueLength': queueLength,
      'hasPendingRequests': hasPendingRequests,
    };
  }
}