# Tab 导航

## 准备三个页面 

在 lib 下，新建 pages 目录，用来存放页面 

- 首页（选课）- Home.dart 

- 学习 - Study.dart 

- 我的 - Mine.dart

```bash
lib
|--pages
|----home
|------Home.dart 首页（选课）
|----study
|------Study.dart 学习
|----mine
|------Mine.dart 我的
```

> 可以在页面中临时写一些内容，用来区分不同的页面。

**准备底部导航菜单，分别跳转到上述三个页面**

在 lib/pages 下创建 Index.dart

```dart
import 'package:flutter/material.dart';
import 'home/Home.dart';
import 'study/Study.dart';
import 'mine/Mine.dart';

class Index extends StatefulWidget {
  const Index({Key? key}) : super(key: key);

  @override
  State<Index> createState() => _IndexState();
}

class _IndexState extends State<Index> {
  final List<BottomNavigationBarItem> bottomNavItems = [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: '选课'),
    BottomNavigationBarItem(icon: Icon(Icons.message), label: '学习'),
    BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
  ];

  final pages = [
    {
      "appBar": AppBar(
        title: Text('首页'),
        elevation: 0.0,
        centerTitle: true,
      ),
      "page": Home()
    },
    {
      "appBar": AppBar(
        title: Text('学习中心'),
        elevation: 0.0,
        centerTitle: true,
      ),
      "page": Study()
    },
    {
      "appBar": AppBar(
        title: Text('个人中心'),
        elevation: 0.0,
        centerTitle: true,
      ),
      "page": Mine()
    },
  ];

  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
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
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
      ),
      body: pages[currentIndex]['page'],
    );
  }
}
```

