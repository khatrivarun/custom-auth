class RetryException implements Exception {
  final String message;

  RetryException({
    required this.message,
  });
}
