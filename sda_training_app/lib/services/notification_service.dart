import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  NotificationService._();

  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  static const AndroidNotificationChannel _channel =
      AndroidNotificationChannel(
    'analytics_channel',
    'Analytics Notifications',
    description: 'Notifications for analytics updates',
    importance: Importance.high,
  );

  bool _initialized = false;

  bool get isInitialized => _initialized;

  Future<void> initialize() async {
    if (_initialized) return;

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings settings =
        InitializationSettings(
      android: androidSettings,
    );

    await _notifications.initialize(
      settings,
      onDidReceiveNotificationResponse:
          _onNotificationTapped,
    );

    final androidImplementation =
        _notifications
            .resolvePlatformSpecificImplementation<
                AndroidFlutterLocalNotificationsPlugin>();

    await androidImplementation?.createNotificationChannel(
      _channel,
    );

    await androidImplementation
        ?.requestNotificationsPermission();

    _initialized = true;

    debugPrint('NotificationService initialized');
  }

  void _onNotificationTapped(
    NotificationResponse response,
  ) {
    debugPrint(
      'Notification tapped: ${response.payload}',
    );
  }
    NotificationDetails _notificationDetails({
    Importance importance = Importance.high,
    Priority priority = Priority.high,
  }) {
    return NotificationDetails(
      android: AndroidNotificationDetails(
        _channel.id,
        _channel.name,
        channelDescription: _channel.description,
        importance: importance,
        priority: priority,
      ),
    );
  }

  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    await initialize();

    await _notifications.show(
      id,
      title,
      body,
      _notificationDetails(),
      payload: payload,
    );
  }

  Future<void> showAnalyticsNotification(
    int totalUsers,
  ) async {
    await showNotification(
      id: 0,
      title: 'Analytics Updated',
      body: 'Total Users: $totalUsers',
      payload: 'analytics',
    );
  }

  Future<void> showSuccess(
    String title,
    String message,
  ) async {
    await showNotification(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: '✅ $title',
      body: message,
      payload: 'success',
    );
  }

  Future<void> showError(
    String title,
    String message,
  ) async {
    await showNotification(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: '❌ $title',
      body: message,
      payload: 'error',
    );
  }

  Future<void> showInfo(
    String title,
    String message,
  ) async {
    await showNotification(
      id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title: 'ℹ️ $title',
      body: message,
      payload: 'info',
    );
  }
    Future<void> cancelNotification(int id) async {
    await _notifications.cancel(id);
  }

  Future<void> cancelAllNotifications() async {
    await _notifications.cancelAll();
  }

  Future<List<PendingNotificationRequest>>
      pendingNotifications() async {
    return await _notifications.pendingNotificationRequests();
  }

  Future<void> showProgressNotification({
    required int id,
    required String title,
    required String body,
    required int progress,
    int maxProgress = 100,
  }) async {
    await initialize();

    final details = NotificationDetails(
      android: AndroidNotificationDetails(
        _channel.id,
        _channel.name,
        channelDescription: _channel.description,
        importance: Importance.low,
        priority: Priority.low,
        showProgress: true,
        maxProgress: maxProgress,
        progress: progress,
        onlyAlertOnce: true,
      ),
    );

    await _notifications.show(
      id,
      title,
      body,
      details,
    );
  }

  Future<void> completeProgressNotification({
    required int id,
    required String title,
    required String body,
  }) async {
    await showNotification(
      id: id,
      title: title,
      body: body,
      payload: 'completed',
    );
  }

  Future<void> testNotification() async {
    await showNotification(
      id: 999,
      title: 'Day 21',
      body: 'Notification Service Working Successfully',
      payload: 'test',
    );
  }

  Future<void> dispose() async {
    await cancelAllNotifications();

    debugPrint('NotificationService disposed');
  }
}