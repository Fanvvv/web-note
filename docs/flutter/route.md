# 路由

管理多个页面时有两个核心概念和类：Route 和 Navigator。 一个 route 是一个屏幕或页面的抽象， Navigator 是管理 route 的 Widget。Navigator 可以通过 route 入栈和出栈来实现页面之间的跳转。 Navigator 提供了一系列方法来管理路由栈，其中最常用的两个方法是push()和pop()，它们的含义如 下。 

- push()：将给定的路由入栈，返回值是一个Future对象，用以接收路由出栈时的返回数据。 
- pop()：将栈顶路由出栈，返回结果为页面关闭时返回给上一个页面的数据。

## 匿名路由

基本用法仅适用于页面较少的场景。

```dart
// 跳转：
Navigator.push()
// 退出：
Navigator.pop()
```

具体代码实现：

```dart
import 'package:flutter/material.dart';
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
    	title: 'Flutter Demo',
    	home: Home(),
      debugShowCheckedModeBanner: false,
    );
  }
}
class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
      	title: Text('首页'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('跳转到商品页'),
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => Product())
          )
        ),
      ),
    );
  }
}
class Product extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
      	title: Text('商品页'),
      ),
      body: Center(
        child: ElevatedButton(
        	child: Text('返回首页'),
        		onPressed: () => Navigator.pop(context)
        	),
      ),
    );
}
```

![image-20220723134541535](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723134541535.png)

![image-20220723134559698](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723134559698.png)

> 跳转页面使用的是 Navigator.push() 方法，该方法可以将一个新的路由添加到由 Navigator 管理 的路由对象的栈顶。而创建新的路由对象使用的是 MaterialPageRoute，MaterialPageRoute 是 PageRoute 的子类，定义了路由创建及切换时过渡动画的相关接口及属性。

## 命名路由

所谓命名路由，就是给页面起一个别名，然后使用页面的别名就可以打开它，使用此种方式来管理路 由，使得路由的管理更加清晰直观。 要想通过别名来指定页面切换，必须先给应用程序 MaterialApp 提供一个页面名称映射规则，即**路由表。路由表是一个Map的结构，其中key对应页面名字，value则是对应的页面**，如下所示：

```dart
MaterialApp(
  // ... // 其他配置
  routes:{ // 注册路由（路由表）
    'first': (context) => FirstPage(),
    'second': (context) => SecondPage(),
  },
  initialRoute: 'first', // 初始路由页面
);
```

使用命名路由

```dart
// 跳转
Navigator.pushNamed(context, 'second') // second 表示页面别名
// 返回
Navigator.pop(context)
```

### 未知路由

如果打开一个不存在的路由页面。可以跳转到一个统一的错误页面（相当于 Web 端的 404）。在注册路 由表时，Flutter 提供了一个 UnknownRoute 属性，用来对未知的路由标识符，进行统一的页面跳转处 理，如下所示：

```dart
MaterialApp(
  // ... // 其他配置
  routes:{},
  onUnknownRoute: (RouteSettings setting) => MaterialPageRoute(builder: (context) => UnknownPage()), // 错误路由处理，返回UnknownPage
);

class UnknownPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('404'),
      ),
      body: Center(
        child: Text('未知页面')
      ),
    );
  }
}
```

## 动态路由

动态路由是指通过 onGenerateRoute 属性指定的路由，可以根据访问路径进行动态匹配和拦截。

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // 通过 onGenerateRoute 生成动态路由
      onGenerateRoute: (settings) {
        // Handle '/'
        if (settings.name == '/') {
        	return MaterialPageRoute(builder: (context) => HomeScreen());
        }
        // Handle '/details/:id'
        var uri = Uri.parse(settings.name);
        if (uri.pathSegments.length == 2 &&
          uri.pathSegments.first == 'details') {
          var id = uri.pathSegments[1];
          return MaterialPageRoute(builder: (context) => DetailScreen(id: id));
        }
        return MaterialPageRoute(builder: (context) => UnknownScreen());
      },
    );
  }
}
```

## 路由传参

### 普通路由传参

```dart
Navigator.push(context,
  MaterialPageRoute(builder: (context) {
    return BlogDetail(
      id: blogItem['id'],
    );
  })
);
```

接收参数

```dart
class BlogDetail extends StatefulWidget {
  // 构造函数
  BlogDetail({Key key, @required this.id}) : super(key: key);
  final int id;
}
```

### 命名路由传参

```dart
Navigator.pushNamed(
  context,
  "/homePage",
  arguments: {'title': "命令路由传递过来的title"}
);
```

接收参数

```dart
class HomePage extends StatelessWidget {
  final Map arguments;
  HomePage({Key key, this.arguments});
  String title = arguments['title'];
  // ......
}
```

