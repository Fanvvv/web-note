# 导航

## Drawer 导航

- Scaffold
  - drawer 左侧抽屉菜单
  - endDrewer 右侧抽屉菜单
- UserAccountsDrawerHeader
  - 抽屉头部组件
- AboutListTile
  - 关于弹窗

```dart
import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Drawer"),
        leading: Icon(Icons.menu),
        actions: [
          Icon(Icons.settings)
        ],
        elevation: 0.0,
        centerTitle: true,
      ),
      body: HomePage(),
      drawer: DrawerList(),
      endDrawer: DrawerList(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Text('Home'),
      ),
    );
  }
}

class DrawerList extends StatelessWidget {
  const DrawerList({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.all(0),
        children: [
          UserAccountsDrawerHeader(
            accountName: Text('初六'),
            accountEmail: Text('whoicliu@163.com'),
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('images/bg1.jpg'),
                fit: BoxFit.cover,
              )
            ),
            currentAccountPicture: CircleAvatar(
              backgroundImage: AssetImage('images/flutter.jpg'),
            ),
          ),
          ListTile(
            leading: Icon(Icons.settings),
            title: Text('设置'),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          Divider(thickness: 2,),
          ListTile(
            leading: Icon(Icons.account_balance),
            title: Text('余额'),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          Divider(thickness: 2,),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('我的'),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          Divider(thickness: 2,),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('回退'),
            onTap: () => Navigator.pop(context),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          AboutListTile(
            child: Text('关于'),
            applicationName: "你的应用名称",
            applicationVersion: "1.0.0",
            icon: CircleAvatar(
              child: Text('aaa')
            ),
            applicationLegalese: "应用法律条例",
            aboutBoxChildren: [
              Text('条例一：xxxx'),
              Text('条例二：xxxx'),
            ],
            applicationIcon: Image.asset(
              'images/flutter.jpg',
              width: 50,
              height: 50,
            )
          ),
          // Text('Drawer')
        ]
      ),
    );
  }
}
```

![image-20220724165252211](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724165252211.png)

## BottomNavigationBar 导航

BottomNavigationBar 是底部导航菜单。

- items：包含导航（BottomNavigationBarItem）的列表
- currentIndex：当前导航索引
- type：导航类型（BottomNavigationBarType）
- onTap()：导航的点击事件（一般会更新导航索引）

```dart
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  Home({Key key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final List<BottomNavigationBarItem> bottomNavItems = [
    BottomNavigationBarItem(
      backgroundColor: Colors.blue,
      icon: Icon(Icons.home),
      label: '首页',
    ),
    BottomNavigationBarItem(
      backgroundColor: Colors.green,
      icon: Icon(Icons.message),
      label: '消息',
    ),
    BottomNavigationBarItem(
      backgroundColor: Colors.amber,
      icon: Icon(Icons.shopping_cart),
      label: '购物车',
    ),
    BottomNavigationBarItem(
      backgroundColor: Colors.red,
      icon: Icon(Icons.person),
      label: '我',
    ),
  ];

  final pages = [
    Center(
      child: Text("Home", style: TextStyle(fontSize: 50)),
    ),
    Center(
      child: Text("Message", style: TextStyle(fontSize: 50)),
    ),
    Center(
      child: Text("Cart", style: TextStyle(fontSize: 50)),
    ),
    Center(
      child: Text("Profile", style: TextStyle(fontSize: 50)),
    ),
  ];

  int currentIndex;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    currentIndex = 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("底部导航"),
        leading: Icon(Icons.menu),
        actions: [
          Icon(Icons.settings)
        ],
        elevation: 0.0,
        centerTitle: true,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: bottomNavItems,
        currentIndex: currentIndex,
        type: BottomNavigationBarType.fixed,
        // type: BottomNavigationBarType.shifting,
        onTap: (index) {
          _changePage(index);
        }
      ),
      body: pages[currentIndex],
    );
  }

  void _changePage(int index) {
    if (index != currentIndex) {
      setState(() {
        currentIndex = index;
      });
    }
  }
}
```

![image-20220724165705185](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724165705185.png)

## Tab 导航

- DefaultTabController 整个Tab导航的容器
  - length 声明导航的数量
  - child 指定子组件
- TabBar 导航菜单
  - tabs 导航菜单数组
- TabBarView 导航页面
  - children 多个导航页面内容

```dart
import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  // 菜单数组
  final List<Widget> _tabs = [
    Tab(text: "首页", icon: Icon(Icons.home)),
    Tab(text: "添加", icon: Icon(Icons.add)),
    Tab(text: "搜索", icon: Icon(Icons.search)),
  ];

  // 页面数组
  final List<Widget> _tabViews = [
    Icon(Icons.home, size: 120, color: Colors.red),
    Icon(Icons.add, size: 120, color: Colors.green),
    Icon(Icons.search, size: 120, color: Colors.black),
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: _tabs.length, 
      child: Scaffold(
        appBar: AppBar(
          title: Text("Tab"),
          leading: Icon(Icons.menu),
          actions: [
            Icon(Icons.settings)
          ],
          elevation: 0.0,
          centerTitle: true,
          bottom: TabBar(
            tabs: _tabs,
            labelColor: Colors.yellow,
            unselectedLabelColor: Colors.black45,
            indicatorSize: TabBarIndicatorSize.tab,
            indicatorColor: Colors.yellow,
            indicatorWeight: 10,
          ),
        ),
        body: TabBarView(
          children: _tabViews
        ),
        bottomNavigationBar: TabBar(
          tabs: _tabs,
          labelColor: Colors.blue,
          unselectedLabelColor: Colors.black45,
        ),
      ),
    );
  }
}
```

![image-20220724164739113](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724164739113.png)