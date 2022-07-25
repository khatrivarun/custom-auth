import 'package:dio/dio.dart';
import 'package:mobile/constants/logger.constant.dart';
import 'package:mobile/db/token.db.dart';
import 'package:mobile/exceptions/retry.exception.dart';
import 'package:mobile/models/token/token.model.dart';

class AuthService {
  final TokenDb tokenDb = TokenDb();
  final Dio publicApi = Dio(
    BaseOptions(
      baseUrl: "http://10.0.2.2:5000/",
      connectTimeout: 5000,
      receiveTimeout: 5000,
    ),
  );
  final Dio securedApi = Dio(
    BaseOptions(
      baseUrl: "http://10.0.2.2:5000/",
      connectTimeout: 5000,
      receiveTimeout: 5000,
    ),
  );

  AuthService() {
    securedApi.interceptors.add(
      InterceptorsWrapper(onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          log.i('Access Token Expired');
          _regenerateAccessToken()
              .then((_) => _retry(error.requestOptions))
              .then((response) => handler.resolve(response))
              .catchError(
            (error, stackTrace) {
              log.e(
                "Dio Interceptor Error",
                error,
                stackTrace,
              );
              handler.next(error);
            },
          );
        } else {
          handler.next(error);
        }
      }, onRequest: (options, handler) {
        Token token = tokenDb.fetchActivitiesFromDevice();

        if (token.accessToken.isNotEmpty) {
          options.headers['Authorization'] = "Bearer ${token.accessToken}";
        }

        return handler.next(options);
      }),
    );
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions) async {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );
    return securedApi.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }

  Future<void> _regenerateAccessToken() async {
    Token token = tokenDb.fetchActivitiesFromDevice();
    Response response = await publicApi.post(
      'api/v1/auth/refresh/',
      data: {
        "refresh_token": token.refreshToken,
      },
    );

    String newAccessToken = response.data['data']['payload']['token'];
    String refreshToken = token.refreshToken;

    tokenDb.saveTokenToDevice(
      Token(
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      ),
    );

    log.i("Refreshed Tokens");
  }

  Future<void> login() async {
    Response response = await securedApi.post(
      'api/v1/auth/login/',
      data: {
        "username": 'jsmith',
        "password": 'test123',
      },
    );

    String accessToken = response.data['data']['payload']['token'];
    String refreshToken = response.data['data']['payload']['refresh_token'];

    tokenDb.saveTokenToDevice(
      Token(
        accessToken: accessToken,
        refreshToken: refreshToken,
      ),
    );
  }

  Future<void> getUser() async {
    try {
      Response response = await securedApi.get(
        'api/v1/auth/me/',
      );
      log.i(response);
    } on RetryException catch (error) {
      log.e(error.message);
    }
  }
}
