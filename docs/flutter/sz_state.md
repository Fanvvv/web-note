# 状态管理

## Provider

- 安装 Provider

[https://pub.dev/packages/provider/install](https://pub.dev/packages/provider/install)

- 创建数据模型

```dart
import 'package:flutter/material.dart';

class CurrentIndexProvider with ChangeNotifier {
  int _currentIndex = 0;

  int get currentIndex => _currentIndex;

  changeIndex(int index) {
    _currentIndex = index;

    notifyListeners();
  }
}
```

- 注册数据模型
  - 注册单个数据模型

```dart
ChangeNotifierProvider(
  create: (BuildContext context) => new UserProvider(),
  child: MyApp(),
);
```

- 注册多个数据模型 
  - 有些时候，我们需要多个数据模型，此时，我们可以使用 MultiProvider 来注册多个数据模型

```dart
runApp(
  MultiProvider(providers: [
    ChangeNotifierProvider.value(value: CurrentIndexProvider())
  ],
  child: MyApp(),
  ),
);
```

Provider5.0 使用

```dart
runApp(
  MultiProvider(providers: [
    ChangeNotifierProvider(create: (_) => CurrentIndexProvider())
  ],
  child: MyApp(),
  ),
);
```

- 在具体组件中使用 Provider 中的数据

  访问 Provider 时，有两种方式：监听和取消监听 

  - 监听 监听方法只能用来 [StatelessWidget.build] 和 [State.build] 中使用。监听值发生变化时，会重建组件。

  ```dart
  Provider.of<T>(context) // 语法糖是： context.watch<T>(context)
  ```

  - 取消监听 取消监听，不能在 [StatelessWidget.build] 或 [State.build] 中使用；换句话说，它可以在上 述两个方法之外的所有方法中使用。监听值发生变化时，不会重建组件。
  
  ```dart
  Provider.of<T>(context, listen: false) // 语法糖是： context.read<T>
  (context)
  ```

访问数据

```dart
Provider.of<CurrentIndexProvider>(context).currentIndex;

// 5.0
context.watch<CurrentIndexProvider>().currentIndex
```

访问方法

```dart
// 取消监听
Provider.of<CurrentIndexProvider>(context, listen:
false).changeIndex(index);

// 5.0
context.read<CurrentIndexProvider>().changeIndex(index)
```

