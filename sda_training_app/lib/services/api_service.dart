import 'package:dio/dio.dart';

class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: 'https://jsonplaceholder.typicode.com',
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        responseType: ResponseType.json,
      ),
    );
  }

  Future<List<dynamic>> fetchUsers() async {
    try {
      final response = await _dio.get('/users');

      if (response.statusCode == 200 && response.data is List) {
        return response.data as List<dynamic>;
      }

      throw Exception('Unexpected response from server');
    } on DioException catch (e) {
      throw Exception(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      throw Exception('Something went wrong: $e');
    }
  }
}