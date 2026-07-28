import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class RealtimeService {
  RealtimeService._();

  static final RealtimeService instance = RealtimeService._();

  static const String _baseUrl = 'ws://localhost:3000/ws';

  WebSocketChannel? _channel;

  final StreamController<Map<String, dynamic>> _messageController =
      StreamController<Map<String, dynamic>>.broadcast();

  final StreamController<bool> _connectionController =
      StreamController<bool>.broadcast();

  Timer? _heartbeatTimer;
  Timer? _reconnectTimer;

  bool _isConnected = false;
  bool _isConnecting = false;

  int _reconnectAttempts = 0;

  static const int _maxReconnectAttempts = 5;

  Stream<Map<String, dynamic>> get messages =>
      _messageController.stream;

  Stream<bool> get connectionStatus =>
      _connectionController.stream;

  bool get isConnected => _isConnected;

  Future<void> connect() async {
    if (_isConnecting || _isConnected) return;

    _isConnecting = true;

    try {
      debugPrint('Connecting to WebSocket...');

      _channel = WebSocketChannel.connect(
        Uri.parse(_baseUrl),
      );

      _channel!.stream.listen(
        _onMessage,
        onDone: _onDisconnected,
        onError: _onError,
        cancelOnError: true,
      );

      _isConnected = true;
      _isConnecting = false;
      _reconnectAttempts = 0;

      _connectionController.add(true);

      _startHeartbeat();

      debugPrint('WebSocket Connected');
    } catch (e) {
      _isConnecting = false;

      debugPrint('Connection Error : $e');

      _scheduleReconnect();
    }
  }

  void _onMessage(dynamic event) {
    try {
      final decoded = jsonDecode(event);

      if (decoded is Map<String, dynamic>) {
        _messageController.add(decoded);
      }

      debugPrint('WS Message : $decoded');
    } catch (e) {
      debugPrint('Message Parse Error : $e');
    }
  }

  void send(Map<String, dynamic> data) {
    if (!_isConnected) {
      debugPrint('WebSocket not connected.');
      return;
    }

    try {
      _channel?.sink.add(
        jsonEncode(data),
      );
    } catch (e) {
      debugPrint('Send Error : $e');
    }
  }
    void _onDisconnected() {
    debugPrint('WebSocket disconnected');

    _isConnected = false;
    _connectionController.add(false);

    _heartbeatTimer?.cancel();

    _scheduleReconnect();
  }

  void _onError(Object error) {
    debugPrint('WebSocket Error: $error');

    _isConnected = false;
    _connectionController.add(false);

    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    if (_reconnectAttempts >= _maxReconnectAttempts) {
      debugPrint('Maximum reconnect attempts reached.');
      return;
    }

    _reconnectAttempts++;

    final delay = Duration(
      seconds: _reconnectAttempts * 2,
    );

    debugPrint(
      'Reconnect attempt $_reconnectAttempts in ${delay.inSeconds}s',
    );

    _reconnectTimer?.cancel();

    _reconnectTimer = Timer(delay, () {
      connect();
    });
  }

  void _startHeartbeat() {
    _heartbeatTimer?.cancel();

    _heartbeatTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) {
        if (_isConnected) {
          send({
            'type': 'ping',
            'timestamp': DateTime.now().toIso8601String(),
          });
        }
      },
    );
  }

  void subscribe(
    void Function(Map<String, dynamic>) callback,
  ) {
    messages.listen(callback);
  }

  Future<void> disconnect() async {
    try {
      _heartbeatTimer?.cancel();
      _reconnectTimer?.cancel();

      await _channel?.sink.close();

      _channel = null;

      _isConnected = false;

      _connectionController.add(false);

      debugPrint('WebSocket Closed');
    } catch (e) {
      debugPrint('Disconnect Error: $e');
    }
  }
    /// Send Ping
  void sendPing() {
    send({
      'type': 'ping',
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  /// Send Custom Event
  void sendEvent(
    String type,
    Map<String, dynamic> data,
  ) {
    send({
      'type': type,
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  /// Force Reconnect
  Future<void> reconnect() async {
    await disconnect();

    _reconnectAttempts = 0;

    await connect();
  }

  /// Connection Information
  Map<String, dynamic> getConnectionInfo() {
    return {
      'connected': _isConnected,
      'connecting': _isConnecting,
      'reconnectAttempts': _reconnectAttempts,
      'maxReconnectAttempts': _maxReconnectAttempts,
    };
  }

  /// Dispose
  Future<void> dispose() async {
    await disconnect();

    await _messageController.close();

    await _connectionController.close();

    debugPrint('RealtimeService Disposed');
  }
}