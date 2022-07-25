import 'package:logger/logger.dart';

final Logger log = Logger(
  printer: PrettyPrinter(
    methodCount: 0,
    errorMethodCount: 10,
    lineLength: 75,
    colors: true,
    printEmojis: true,
    printTime: true,
  ),
);
