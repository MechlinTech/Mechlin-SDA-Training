import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

import '../models/analytics.dart';
import '../services/api_service.dart';
import '../services/offline_service.dart';
import '../services/notification_service.dart';

class AnalyticsProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final OfflineService _offlineService = OfflineService();

  Analytics? analytics;

  bool isLoading = false;

  String? error;

  bool isOffline = false;

  Future<void> loadAnalytics() async {
    isLoading = true;
    error = null;

    notifyListeners();

    try {
      final connectivity = await Connectivity().checkConnectivity();

      if (connectivity.contains(ConnectivityResult.none)) {
        isOffline = true;

        final cachedUsers = await _offlineService.loadUsers();

        if (cachedUsers.isNotEmpty) {
          analytics = Analytics(
            totalUsers: cachedUsers.length,
          );

          // Show notification for cached data
          await NotificationService.instance.showAnalyticsNotification(
            analytics!.totalUsers,
          );
        } else {
          error = "No cached data available.";
        }
      } else {
        isOffline = false;

        final users = await _apiService.fetchUsers();

        await _offlineService.saveUsers(users);

        analytics = Analytics(
          totalUsers: users.length,
        );

        // Show notification after successful API call
        await NotificationService.instance.showAnalyticsNotification(
          analytics!.totalUsers,
        );
      }
    } catch (e) {
      analytics = null;
      error = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void clearAnalytics() {
    analytics = null;
    error = null;
    isOffline = false;
    notifyListeners();
  }
}