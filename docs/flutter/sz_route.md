# Fluro 路由

首页完成后，我们需要点击课程列表，跳转到课程详情页。并且，需要动态传递参数，来动态获取详情页的内容。此时，我们需要声明详情页的路由。之前我们学过 Flutter 内置的路由方案（Navigator）。 

这里我们介绍一款企业级的路由框架 - [Fluro](https://pub.dev/packages/fluro)

## 安装

```yaml
dependencies:
	fluro: ^2.0.3
```

## 声明路由处理器

将所有路由文件，统一放到 lib/routes 中

```bash
lib
|--routes
|----RoutesHandler.dart 路由处理器
|----Routes.dart 路由
```

创建 lib/routes/RoutesHandler.dart

```dart
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';

import '../pages/unknown/unknownPage.dart';
import '../pages/Index.dart';
import '../pages/study/Study.dart';
import '../pages/mine/Mine.dart';
import '../pages/user/Login.dart';

/// 空页面
var unknownHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return unKnownPage();
  }
);

/// 首页
var indexHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return Index();
  }
);

// 学习中心
var studyHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return Study();
  }
);

/// 个人中心
var mineHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return Mine();
  }
);

/// 登录页
var loginHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
      return Login();
    }
);
```

## 声明路由

创建 lib/routes/Routes.dart

```dart
import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';

import 'RoutesHandler.dart';

class Routers {
  static void configureRoutes(FluroRouter router) {
    router.define('/', handler: indexHandler);
    router.define('/study', handler: studyHandler);
    router.define('/mine', handler: mineHandler);
    router.define('/login', handler: loginHandler);
    router.notFoundHandler = unknownHandler; // 404 页面
  }
}
```

然后把路由相关的内容，也放到 lib/utils/Global.dart 中

```dart
import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';

class G {
  /// Fluro 路由
  static late final FluroRouter router;
}
```

在入口文件（lib/main.dart）中初始化 router

```dart
import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import 'routes/Routes.dart';
import 'utils/Global.dart';

void main() {
  + FluroRouter router = FluroRouter();
  + Routers.configureRoutes(router);
  + G.router = router;
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter学习',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      // home: Index(),
      debugShowCheckedModeBanner: false,
      + onGenerateRoute: G.router.generator,
      + initialRoute: '/',
    );
  }
}
```

## 使用路由 

我的跳转到登录页

```dart
import 'package:flutter/material.dart';
import '../../utils/Global.dart';

class Mine extends StatelessWidget {
  const Mine({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        child: Text('跳转到登录页'),
        onPressed: () {
          G.router.navigateTo(context, '/login');
        },
      )
    );
  }
}
```