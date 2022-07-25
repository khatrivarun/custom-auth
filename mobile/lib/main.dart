import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/constants/hive.constant.dart';
import 'package:mobile/constants/logger.constant.dart';
import 'package:mobile/models/token/token.model.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();

  log.i("Attempting to open secure box");

  const secureStorage = FlutterSecureStorage();
  final String? encryptionKeyCheck = await secureStorage.read(key: hiveKey);

  if (encryptionKeyCheck == null) {
    final newKey = Hive.generateSecureKey();
    await secureStorage.write(
      key: hiveKey,
      value: base64UrlEncode(newKey),
    );
  }

  final key = await secureStorage.read(key: hiveKey);
  final encryptionKey = base64Url.decode(key!);

  log.i("Encryption Key: $encryptionKey");

  Hive.registerAdapter<Token>(TokenAdapter());
  await Hive.openBox<Token>(
    tokenBox,
    encryptionCipher: HiveAesCipher(
      encryptionKey,
    ),
  );

  log.i("Secure Box Opened");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
