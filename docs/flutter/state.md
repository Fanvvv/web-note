# 状态管理

- Flutter 中的组件，按状态划分：

  - StatelessWidget（无状态组件）无状态组件，可以理解为将外部传入的数据转化为界面展示的内容，只会渲染一次。 在需要实现一个 StatelessWidget 组件的时候，声明一个类需要通过 extends 继承 StatelessWidget，然后实现 build 方法，就可以创建一个无状态组件。

    > 注意： 如果无状态组件里面有子组件，并且子组件是有状态的，则子组件的内容是可以通过 setState 来更改的。无状态组件影响的仅仅是自己是无状态的，不回影响他的父组件和子组件。
    >
    > **无状态Widget是不能调用 setState 函数**

  - StatefulWidget（状态组件）

- 按状态作用域划分

  - 组件内私有状态（StatelessWidget）
  - 跨组件状态共享（InheritedWidget、Provider）
  - 全局状态（Redux | fish-redux、Mobx......）

- 状态组件的组成

  - StatelessWidget（组件本身不可变 - @immutable）
  - State（将变化的状态放在 State 中维护）

## StatefulWidget

有状态组件，是定义交互逻辑和业务数据，可以理解为具有动态可交互的内容界面，会根据数据的 变化进行多次渲染。 

因为 StatefulWidget 是不可变（@immutable）组件。因此，Flutter 将状态单独放到 State 组件 中进行维护。所以，在 Flutter 中声明状态组件需要写两个类：

- StatefullWidget
- State

代码详情：

> 通过 setState() 函数来设置状态

```dart
class MyState extends StatefulWidget {
  @override
  _MyStateState createState() => _MyStateState();
}
class _MyStateState extends State<MyState> {
  int _num = 0;
  void _increment() {
    // 用来修改状态的关键函数
    setState(() {
    	_num++;
  	});
 	}
  void _decrement() {
    setState(() {
    	_num--;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          ElevatedButton(
            onPressed: _decrement,
            child: Text('-')
          ),
          Padding(
            padding: EdgeInsets.all(20),
            child: Text('$_num')
          ),
          ElevatedButton(
            onPressed: _increment,
            child: Icon(Icons.add)
          )
        ],
      )
    );
  }
}
```

## DataTable
有些组件，在使用过程中涉及到状态管理。这里以 DataTable 为例。

```dart
// 准备用户的数据结构（包含哪些字段）
class User {
  String name;
  int age;
  bool selected;
  User(this.name, this.age, {this.selected = false});
}
// 声明状态组件
class UserList extends StatefulWidget {
  UserList({Key key}) : super(key: key);
  @override
  _UserListState createState() => _UserListState();
}
class _UserListState extends State<UserList> {
  // 声明数据
  List<User> data = [
    User('张三', 18),
    User('张三丰', 218, selected: true),
    User('张翠山', 30),
    User('张无忌', 60),
  ];
	var _sortAscending = true;
  // 动态组装数据
  List _getUserRows() {
    List<DataRow> dataRows = [];
    for (int i = 0; i < data.length; i++) {
      dataRows.add(
      DataRow(
        selected: data[i].selected,
        onSelectChanged: (selected) {
          // 通过 setState 来设置当前记录，是否被选中
          setState(() {
            data[i].selected = selected;
          });
        },
        cells: [
          DataCell(Text('${data[i].name}')),
          DataCell(Text('${data[i].age}')),
          DataCell(Text('男')),
          DataCell(Text('---')),
        ]
      )
    );
	}
	return dataRows;
}
@override
Widget build(BuildContext context) {
  return Container(
    child: SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        sortColumnIndex: 1,
        sortAscending: _sortAscending,
        dataRowHeight: 100,
        horizontalMargin: 20,
        columnSpacing: 100,
        columns: [
          DataColumn(label: Text('姓名')),
          DataColumn(
            label: Text('年龄'),
            numeric: true,
            onSort: (int columnIndex, bool asscending) {
              setState(() {
                _sortAscending = asscending;
                if (asscending) {
                  // 升序：数据越大，越往后
                  data.sort((a, b) => a.age.compareTo(b.age));
                } else {
                  // 降序：数据越小，越往后
                  data.sort((a, b) => b.age.compareTo(a.age));
                }
              });
            }
          ),
          DataColumn(label: Text('性别')),
          DataColumn(label: Text('简介')),
        ],
        rows: _getUserRows(),
      )
  	),
  );
}
}
```

![image-20220723161303295](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723161303295.png)

## InheritedWidget 

InheritedWidget 是 Flutter 内置的，跨组件状态管理的方案。 

我们知道 Flutter 中的组件是树状结构（类似 DOM 树）。而组件就是 Dart 类。因此，我们可以通过构造函数的方式。进行跨组件的状态（参数）传递。例如：

但是，通过构造函数方式传递状态，有一个明显的缺陷。例如，上图中的组件 B 和 C 不需要状态。但作 为中间的组件，仍然需要传递状态。而且实际项目中的树状结构要更复杂。因此，我们需要一个更优的 跨组件状态管理方案 - InheritedWidget。InheritedWidget 的基本逻辑是： 在 InheritedWidget 中声明状态数据。然后在**需要使用状态的** InheritedWidget 的**后代组件**中，访问 InheritedWidget 中的状态数据。

- What：提供了沿树向下，共享数据的功能 

  即子组件可以获取父组件（InheritedWidget 的子类）的数据 

- Why： 依赖构造函数传递数据的方式不能满足业务需求。所以，需要一个新的，更好的跨组件数据传输方案 

- How： BuildContext.dependOnInheritedWidgetOfExactType()

## 生命周期

在原生 Android 、原生 iOS 、前端 React 或者 Vue 都存在生命周期的概念，在 Flutter 中一样存在生命 周期的概念，其基本概念和作用相似。 Flutter 中说的生命周期，也是指有状态组件，对于无状态组件生 命周期只有 build 这个过程，也只会渲染一次，而有状态组件则比较复杂，下面我们就来看看有状态组 件的生命周期过程。

- StatelessWidget（无状态组件的生命周期）
  -  createElement 
  - build 
- StatefulWidget（有状态组件的生命周期）
  -  createState 建立状态组件时，会被调用，只调用一次。 
  - initState 初始化状态时调用，只调用一次。 
  - didChangeDependencies initState 后，会被调用。 
  - InheritedWidget 发生变化时，会被调用。 
  - build 组件渲染时调用 
  - reassemble 主要是开发阶段使用，在 debug 模式下，每次热重载都会调用该函数。 
  - didUpdateWidget 
    - build 后，会被调用。 
    - hot reload 后，會被调用。 
    - 如果父组件 setState，子组件的 didUpdateWidget 也会被调用。 
  - setState 通过 setState，会触发 build，重新渲染组件。
  - deactivate 在元素树中，状态组件的位置发生了变化，需要暂时移除状态组件时，会被调用，例如：页面切换。
  - dispose 状态组件永远销毁时，才会被调用。

整个过程分为四个阶段： 

1. 初始化阶段，包括两个生命周期函数 createState 和 initState； 
2. 创建阶段，也可以称组件出生阶段，包括 didChangeDependencies 和 build；
3. 更新阶段 ，这个阶段有可能是因为 didChangeDependencies、setState 或者 didUpdateWidget 而引发的组件重新 build ，在组件运行过程中会多次被触发，**这也是优化过程中需要着重注意的点**；
4. 销毁阶段，deactivate 和 dispose。

## Provider

Flutter 中的状态管理组件有很多。例如：Redux | fish-redux、Mobx、Scoped Model、BLoC、 Provider。 

- Scoped Model : 最早的状态管理方案。 
- Redux：现在国内用的最多，因为咸鱼团队一直在用，还出了自己 fish_redux。 
- Mobx：是一个经久考验的状态管理库。 
- BLoC：个人觉的比 Redux 简单，而且好用，特别是一个页面里的状态管理，用起来很爽。 
- **Provider**：是在 Google 的一个项目，刚出现不久，他是 Google 的亲儿子，用起来也是相当的爽。 

这里介绍 Google 推荐的 **Provider**。 

**Provider 其实是对 InheritedWidget 的封装**。相比于直接使用 InheritedWidget，使用 Provider 有很 多好处，比如说简化资源的分配与处置，支持懒加载等等。 

Provider 为我们提供了一些不同类型的 Provider。

| **名称**                | **描述**                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Provider                | 最基础的 Provider。它携带一个值，并将这个值暴露，无论这个值是什么。 |
| ListenableProvider      | 为 Listenable 对象而创建的 Provider。ListenableProvider  会监听对象的变化，只要 ListenableProvider 的 listner  被调用，  ListenableProvider 就会重新构建依赖于该  Provider 的控件。 |
| ChangeNotifierProvider  | ChangeNotifierProvider 是一种特殊的 ListenableProvider，它基于ChangeNotifier，并且在有需要的时候，它会自动调用ChangeNotifier.dispose。 |
| ValueListenableProvider | 监听 ValueListenable 并只会暴露 ValueListenable.value.       |
| StreamProvider          | 监听一个 Stream，并且对外暴露最新提交的值。                  |
| FutureProvider          | 携带一个 Future，当 Future 完成时，它会更新依赖于它的控件。  |

Provider 详情：[https://pub.dev/packages/provider](https://pub.dev/packages/provider)

### 使用步骤

- 安装 Provider

在 pubspec.yaml 中，添加 Provider 依赖。

```yaml
dependencies:
flutter:
sdk: flutter
//
provider: ^4.3.3
```

安装依赖

```bash
flutter pub get
```

> VS Code 中，保存 pubspec.yaml 会自动安装依赖

- 创建数据模型

```dart
// 1. 创建数据模型
class LikesModel extends ChangeNotifier {
  int _counter = 0;
  int get counter => _counter;
  incrementCounter() {
    // 累加
    _counter++;
    // 通过 UI 更新
    notifyListeners();
  }
}
```

- 注册数据模型（创建 Provider）

```dart
class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 2. 创建 Provider （注册数据模型）
    return ChangeNotifierProvider(
      create: (BuildContext context) => new LikesModel(),
        child: MyHomePage(),
      ),
    );
  }
}
```

- 在子组件中使用数据模型 

  通过上下文可以获取数据模型中的数据；也可以通过 **Provider.of<数据模型>** 获取指定数据模型中的数据。

```dart
class MyHomePage extends StatelessWidget {
  const MyHomePage({Key key}) : super(key: key);
  @override

  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // 3. 在子组件中使用数据模型
          Text(
          	'${context.watch<LikesModel>().counter}'
          ),
          TextButton(
            // 3. 在子组件中使用数据模型
            onPressed: Provider.of<LikesModel>(context).incrementCounter,
            child: Icon(Icons.thumb_up)
          )
        ],
      ),
    );
  }
}
```

### Provider 原理

![image-20220723162604444](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723162604444.png)

![image-20220723162655310](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723162655310.png)