# 登录

- 写登录接口
- 写 UserProvider 存放用户数据
- 在Index页面判断是否登录，如果没登录跳转到登录页
- 登录功能书写

## 登录接口

新建 UserAPI.dart 文件

```dart
import 'package:dio/dio.dart';

class UserAPI {
  final Dio _dio;

  UserAPI(this._dio);

  /// 登录
  Future<dynamic> login({ required String phone, required String password }) async {
    FormData formData = FormData.fromMap({
      'phone': phone,
      'password': password
    });
    print(phone);
    print(password);
    Response res = await _dio.post('/front/user/login', data: formData);

    if (res.data != null) {
      return res.data['content'];
    } else {
      return false;
    }
  }
}
```

在 API.dart 文件中添加登录接口

```dart
import 'package:dio/dio.dart';
import 'initDio.dart';
import 'AdAPI.dart';
import 'CourseAPI.dart';
import 'UserAPI.dart';

class API {
  late Dio _dio;

  API() {
    _dio = initDio();
  }

  /// 广告接口
  AdAPI get ad => AdAPI(_dio);

  /// 课程列表接口
  CourseAPI get course => CourseAPI(_dio);

  /// 登录
  UserAPI get user => UserAPI(_dio);
}
```

## UserProvider

新建 UserProvider.dart 文件

```dart
import 'dart:convert';
import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  bool _isLogin = false;
  Map _user = {};

  bool get isLogin => _isLogin;
  Map get user => _user;

  doLogin(data) {
    if (data != false) {
      _isLogin = true;
      _user = json.decode(data);

      notifyListeners();
    }
  }

  doLogout() {
    _isLogin = false;
    _user = {};

    notifyListeners();
  }
}
```

入口文件 main.dart 中新增 provider

```dart
import 'providers/UserProvider.dart';

runApp(
  MultiProvider(providers: [
    ChangeNotifierProvider(create: (_) => CurrentIndexProvider()),
    ChangeNotifierProvider(create: (_) => UserProvider())
  ],
  child: MyApp(),
  ),
);
```

## 判断是否登录

Index 页面读取 userProvider，进入学习或个人中心页面判断是否登录，没登录则跳转到 Login 页面

```dart
import '../providers/UserProvider.dart';
@override
Widget build(BuildContext context) {
  int currentIndex = context.watch<CurrentIndexProvider>().currentIndex;
  UserProvider userProvider = context.watch<UserProvider>();
  return Scaffold(
    appBar: AppBar(
      title: pages[currentIndex]['appBar'],
      elevation: 0.0,
      centerTitle: true,
    ),
    bottomNavigationBar: BottomNavigationBar(
      items: bottomNavItems,
      currentIndex: currentIndex,
      selectedItemColor: Colors.red,
      type: BottomNavigationBarType.fixed,
      onTap: (index) async {
        if (index == 1 || index == 2) {
          if (userProvider.isLogin == false) {
            print('跳转到登录页面');
            G.router.navigateTo(context, '/login');
            return;
          } else {
            print('用户已登录，可以访问页面');
          }
        }
        context.read<CurrentIndexProvider>().changeIndex(index);
      },
    ),
    body: pages[currentIndex]['page'],
  );
}
```

## 登录页面编写

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/UserProvider.dart';
import '../../utils/Global.dart';

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late String _phone;
  late String _password;

  @override
  Widget build(BuildContext context) {
    UserProvider userProvider = context.watch<UserProvider>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('登录页'),
        centerTitle: true,
      ),
      body: Container(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(
                      hintText: '手机号'
                    ),
                    validator: (value) {
                      RegExp reg = RegExp(r'^\d{11}$');
                      if (!reg.hasMatch(value!)) {
                        return '手机号不合法';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _phone = value!;
                    },
                  ),
                  TextFormField(
                    obscureText: true,
                    decoration: const InputDecoration(
                        hintText: '密码'
                    ),
                    validator: (value) {
                      if (value != null && value.isEmpty) {
                        return value.length < 6 ? '密码长度不够' : null;
                      }
                    },
                    onSaved: (value) {
                      _password = value!;
                    },
                  )
                ],
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      if ((_formKey.currentState as FormState).validate()) {
                        _formKey.currentState?.save();

                        var res = await G.api.user.login(phone: _phone, password: _password);
                        if (res != false) {
                          userProvider.doLogin(res); // 修改用户登录状态
                          G.router.pop(context);
                        } else {
                          _formKey.currentState?.reset();
                        }
                      }
                    },
                    child: const Text('登录'),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      _formKey.currentState?.reset();
                    },
                    child: const Text('重置'),
                  ),
                )
              ],
            )
          ],
        ),
      )
    );
  }
  @override
  void dispose() {
    super.dispose();
  }
}
```

