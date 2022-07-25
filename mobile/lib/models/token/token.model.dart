import 'package:hive/hive.dart';

part 'token.model.g.dart';

@HiveType(typeId: 1)
class Token {
  @HiveField(0, defaultValue: '')
  final String accessToken;

  @HiveField(1, defaultValue: '')
  final String refreshToken;

  Token({
    required this.accessToken,
    required this.refreshToken,
  });

  @override
  String toString() {
    return "Token { refreshToken: $refreshToken, accessToken: $accessToken}";
  }
}
