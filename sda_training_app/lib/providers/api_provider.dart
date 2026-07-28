import 'package:flutter/foundation.dart';

import '../services/api_service.dart';
import '../services/offline_service.dart';
import '../services/realtime_service.dart';
import '../services/notification_service.dart';

class ApiProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final OfflineService _offlineService = OfflineService.instance;
  final RealtimeService _realtimeService = RealtimeService.instance;
  final NotificationService _notificationService =
      NotificationService.instance;

  bool _loading = false;
  bool _isOffline = false;

  String? _error;

  List<dynamic> _users = [];

  Map<String, dynamic>? _analytics;

  bool get loading => _loading;

  bool get isOffline => _isOffline;

  String? get error => _error;

  List<dynamic> get users => _users;

  Map<String, dynamic>? get analytics => _analytics;

  Future<void> initialize() async {
    _loading = true;
    notifyListeners();

    await _offlineService.initialize();

    await _notificationService.initialize();

    _realtimeService.connect();

    _realtimeService.subscribe(
      _handleRealtimeMessage,
    );

    _loading = false;
    notifyListeners();
  }

  void _handleRealtimeMessage(
    Map<String, dynamic> message,
  ) {
    debugPrint('Realtime Update: $message');
  }
    Future<void> fetchUsers() async {
    try {
      _loading = true;
      _error = null;
      notifyListeners();

      final response = await _apiService.get<List<dynamic>>('/users');

      _users = response;

      await _offlineService.saveUsers(_users);

      _isOffline = false;
    } catch (e) {
      _error = e.toString();

      _users = await _offlineService.loadUsers();

      _isOffline = true;

      await _notificationService.showError(
        'Offline Mode',
        'Showing cached users',
      );
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAnalytics() async {
  try {
    _loading = true;
    _error = null;
    notifyListeners();

    // Fetch users instead of a non-existent /analytics endpoint
    await fetchUsers();

    _analytics = {
      "totalUsers": _users.length,
      "onlineUsers": _users.length,
      "offlineUsers": 0,
    };

    await _offlineService.saveCache(
      'analytics_cache',
      _analytics!,
    );

    await _notificationService.showAnalyticsNotification(
      _users.length,
    );
  } catch (e) {
    _analytics = await _offlineService.loadCache(
      'analytics_cache',
      expiry: const Duration(hours: 1),
    );

    _error = e.toString();
  } finally {
    _loading = false;
    notifyListeners();
  }
}

  Future<void> refresh() async {
    await fetchUsers();
    await fetchAnalytics();
  }
    void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<void> reconnectRealtime() async {
    await _realtimeService.reconnect();
  }

  Future<void> disconnectRealtime() async {
    await _realtimeService.disconnect();
  }

  Future<void> sendRealtimeMessage(
    Map<String, dynamic> data,
  ) async {
    _realtimeService.send(data);
  }

  Map<String, dynamic> get status {
    return {
      'loading': _loading,
      'offline': _isOffline,
      'users': _users.length,
      'analyticsLoaded': _analytics != null,
      'error': _error,
    };
  }

  @override
  void dispose() {
    _realtimeService.dispose();

    super.dispose();
  }
}