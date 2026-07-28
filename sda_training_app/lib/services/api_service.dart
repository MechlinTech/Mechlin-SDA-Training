import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();

  factory ApiService() => _instance;

  late final Dio _dio;

  ApiService._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: 'https://jsonplaceholder.typicode.com',
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 20),
        sendTimeout: const Duration(seconds: 20),
        responseType: ResponseType.json,
        contentType: Headers.jsonContentType,
      ),
    );

    _initializeInterceptors();
  }

  Dio get dio => _dio;

  void _initializeInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();

          final token = prefs.getString("auth_token");

          if (token != null && token.isNotEmpty) {
            options.headers["Authorization"] = "Bearer $token";
          }

          debugPrint(
              "➡️ ${options.method} ${options.baseUrl}${options.path}");

          handler.next(options);
        },

        onResponse: (response, handler) {
          debugPrint(
              "✅ ${response.statusCode} ${response.requestOptions.path}");

          handler.next(response);
        },

        onError: (error, handler) async {
          debugPrint("❌ ${error.message}");

          if (error.response?.statusCode == 401) {
            await _handleUnauthorized();
          }

          handler.next(error);
        },
      ),
    );

    if (kDebugMode) {
        _dio.interceptors.add(
          LogInterceptor(
            requestBody: true,
            responseBody: true,
          ),
        );
      }
  }

  Future<void> _handleUnauthorized() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove("auth_token");
  }

  Future<bool> hasInternet() async {
    final results = await Connectivity().checkConnectivity();

    return !results.contains(ConnectivityResult.none);
  }

  Future<T> get<T>(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    await _checkConnection();

    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );

      return response.data as T;
    } on DioException catch (e) {
      throw Exception("API Error: ${_handleError(e)}");
    }
  }

  Future<T> post<T>(
    String endpoint,
    dynamic data,
  ) async {
    await _checkConnection();

    try {
      final response = await _dio.post(
        endpoint,
        data: data,
      );

      return response.data as T;
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<T> put<T>(
    String endpoint,
    dynamic data,
  ) async {
    await _checkConnection();

    try {
      final response = await _dio.put(
        endpoint,
        data: data,
      );

      return response.data as T;
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<T> patch<T>(
    String endpoint,
    dynamic data,
  ) async {
    await _checkConnection();

    try {
      final response = await _dio.patch(
        endpoint,
        data: data,
      );

      return response.data as T;
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<T> delete<T>(
    String endpoint,
  ) async {
    await _checkConnection();

    try {
      final response = await _dio.delete(endpoint);

      return response.data as T;
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<List<dynamic>> fetchUsers() async {
    final response = await get("/users");

    return response as List<dynamic>;
  }

  Future<Map<String, dynamic>> fetchUser(
    int id,
  ) async {
    final response = await get("/users/$id");

    return response;
  }

  Future<dynamic> createPost(
    Map<String, dynamic> body,
  ) async {
    return await post("/posts", body);
  }

  Future<dynamic> updatePost(
    int id,
    Map<String, dynamic> body,
  ) async {
    return await put("/posts/$id", body);
  }

  Future<dynamic> deletePost(
    int id,
  ) async {
    return await delete<dynamic>("/posts/$id");
  }

  Future<dynamic> uploadFile(
    String endpoint,
    String filePath,
  ) async {
    await _checkConnection();

    final formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(filePath),
    });

    try {
      final response = await _dio.post(
        endpoint,
        data: formData,
      );

      return response.data;
    } on DioException catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      "auth_token",
      token,
    );
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getString(
      "auth_token",
    );
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(
      "auth_token",
    );
  }

  Future<void> _checkConnection() async {
    if (!await hasInternet()) {
      throw Exception("No Internet Connection");
    }
  }

  String _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        return "Connection Timeout";

      case DioExceptionType.receiveTimeout:
        return "Receive Timeout";

      case DioExceptionType.sendTimeout:
        return "Send Timeout";

      case DioExceptionType.badResponse:
        return "Server Error : ${e.response?.statusCode}";

      case DioExceptionType.connectionError:
        return "No Internet Connection";

      case DioExceptionType.cancel:
        return "Request Cancelled";

      default:
        return e.message ?? "Unknown Error";
    }
  }
}