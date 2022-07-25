import 'package:hive/hive.dart';
import 'package:mobile/constants/hive.constant.dart';
import 'package:mobile/constants/logger.constant.dart';
import 'package:mobile/models/token/token.model.dart';

class TokenDb {
  final Box<Token> _tokenDb = Hive.box<Token>(tokenBox);

  static final TokenDb _singleton = TokenDb._internal();

  factory TokenDb() {
    return _singleton;
  }

  TokenDb._internal();

  void saveTokenToDevice(Token token) {
    log.i("Saving Token to Hive DB");
    _tokenDb.put(tokens, token);
    log.i("Saved Token to Hive DB");
  }

  Token fetchActivitiesFromDevice() {
    log.i("Fetching Token from Hive DB");
    return _tokenDb.get(
      tokens,
      defaultValue: Token(
        accessToken: '',
        refreshToken: '',
      ),
    )!;
  }
}
