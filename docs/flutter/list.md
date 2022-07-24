# 列表

## SingleChildScrollView

类似于Android中的 `ScrollView `，它只能接收一个子组件。 

- scrollDirection 滚动方向 
- padding 内边距 
- physics 结束拖动时效果响应 
  - ClampingScrollPhysics：Android 下微光效果 
  - BouncingScrollPhysics：iOS 下弹性效果 
- child 子组件
- reverse 此属性本质上是决定可滚动组件的初始滚动位置是在“头”还是“尾”，取 false 时，初始滚动 位置在“头”，反之则在“尾” 。

```dart
class SingleChildScrollViewDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 验证水平滚动
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: EdgeInsets.all(10),
          reverse: true,
          child: Row(
            children: [
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮一')
              ),
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮二')
              ),
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮三')
              ),
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮四')
              ),
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮五')
              ),
              OutlinedButton(
                onPressed: () {},
                child: Text('按钮六')
              ),
            ]
          ),
        ),
        // 垂直方向的滚动
        SingleChildScrollView(
          scrollDirection: Axis.vertical,
          padding: EdgeInsets.all(10),
          reverse: true,
          physics: BouncingScrollPhysics(),
          child: Column(
            children: List.generate(
              100, 
              (index) => OutlinedButton(
                onPressed: () {},
                child: Text('按钮$index')
              ),
            )
          ),
        )
      ],
    );
  }
}
```

![image-20220724150558514](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724150558514.png)

## ListView 

ListView 是最常用的可滚动组件之一，它可以沿一个方向线性布局所有子组件，我们看看 ListView 的默认构造函数定义：

```dart
ListView({
...
// 可滚动widget公共参数
Axis scrollDirection = Axis.vertical,
bool reverse = false,
ScrollController controller,
bool primary,
ScrollPhysics physics,
EdgeInsetsGeometry padding,
// ListView各个构造函数的共同参数
double itemExtent,
bool shrinkWrap = false,
bool addAutomaticKeepAlives = true,
bool addRepaintBoundaries = true,
double cacheExtent,
// 子widget列表
List<Widget> children = const <Widget>[],
})
```

通过构造函数中的 children 传入所有的子组件有一个问题：默认会创建出所有的子Widget。(性能差)

- ListView.builder 

  ListView.builder 适用于子 Widget 比较多的场景，该构造函数将创建子 Widget 交给了一个抽象的 方法，交给 ListView 进行管理，ListView 会在真正需要的时候去创建子Widget，而不是一开始就 全部初始化好。 

  - itemCount 列表项的数量，如果为空，则表示ListView为无限列表 
  - itemBuilder 列表项创建的方法 

- ListView.separated ListView.separated 会生成带有分割器的列表 

- ListView.custom 支持自定义生成列表

- ListTitle

  - leading 图标
  - title 标题
  - subtitle 子标题
  - trailing 尾部图标
  - selected 选中的元素

```dart
class ListViewDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          ListViewBasic(),
          ListViewHorizontal(),
          ListViewBuilderDemo(),
          ListViewSeperatedDemo(),
        ]
      )
    );
  }
}

class ListViewBasic extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      child: ListView(
        scrollDirection: Axis.vertical,
        children: [
          ListTile(
            leading: Icon(Icons.access_alarm, size: 50),
            title: Text('access_alarm'),
            subtitle: Text('子标题'),
            trailing: Icon(Icons.keyboard_arrow_right),
          ),
          ListTile(
            leading: Icon(Icons.ac_unit, size: 50),
            title: Text('ac_unit'),
            subtitle: Text('子标题'),
            trailing: Icon(Icons.keyboard_arrow_right),
            selected: true,
            selectedTileColor: Colors.red[100],
          ),
          ListTile(
            leading: Icon(Icons.add_photo_alternate_rounded, size: 50),
            title: Text('add_photo_alternate_rounded'),
            subtitle: Text('子标题'),
            trailing: Icon(Icons.keyboard_arrow_right),
          ),
          ListTile(
            leading: Icon(Icons.fact_check_outlined, size: 50),
            title: Text('fact_check_outlined'),
            subtitle: Text('子标题'),
            trailing: Icon(Icons.keyboard_arrow_right),
          ),
        ]
      )
    );
  }
}

class ListViewHorizontal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          Container(
            width: 160,
            color: Colors.amber,
          ),
          Container(
            width: 160,
            color: Colors.blueAccent,
          ),
          Container(
            width: 160,
            color: Colors.black87,
          ),
          Container(
            width: 160,
            color: Colors.grey,
          ),
        ],
      )
    );
  }
}

class ListViewBuilderDemo extends StatelessWidget {
  final List<Widget> users = new List<Widget>.generate(20, (index) => OutlinedButton(
    onPressed: () {}, 
    child: Text('姓名 $index')
  ));

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      child: ListView.builder(
        itemCount: users.length,
        itemExtent: 30,
        padding: EdgeInsets.all(10),
        itemBuilder: (context, index) {
          return users[index];
        },
      )
    );
  }
}

class ListViewSeperatedDemo extends StatelessWidget {
  final List<Widget> products = List.generate(20, (index) => ListTile(
    leading: Image.asset('images/flutter.jpg'),
    title: Text('商品标题 $index'),
    subtitle: Text('子标题'),
    trailing: Icon(Icons.keyboard_arrow_right),
  ));

  @override
  Widget build(BuildContext context) {
    Widget dividerOdd = Divider(
      color: Colors.blue,
      thickness: 2
    );

    Widget dividerEven = Divider(
      color: Colors.red,
      thickness: 2
    );

    return Column(
      children: [
        ListTile(
          title: Text('商品列表'),
        ),
        Container(
          height: 200,
          child: ListView.separated(
            itemCount: products.length,
            itemBuilder: (context, index) {
              return products[index];
            },
            // 分隔器的构造器
            separatorBuilder: (context, index) {
              return index%2 == 0 ? dividerEven : dividerOdd;
            },
          )
        ),
      ],
    );
  }
}
```

![image-20220724152452454](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724152452454.png)

## GridView 

GridView 可以构建一个二维网格列表

GridView 和 ListView 的大多数参数都是相同的。**唯一需要关注的是 gridDelegate 参数**，类型是 SliverGridDelegate，其中 SliverGridDelegate 其实是一个抽象类，而且一共有两个实现类： 

- SliverGridDelegateWithFixedCrossAxisCount：用于固定列数的场景； 
  - crossAxisCount：指定列数
  - mainAxisSpacing：主轴方向的间距
  - crossAxisSpacing：交叉轴的间距
  - childAspectRatio：子元素的宽高比例
- SliverGridDelegateWithMaxCrossAxisExtent：声明子组件的宽度，列数自适应；
  - maxCrossAxisExtent：交叉轴上最大的扩展（子组件的宽度）
  - mainAxisSpacing：主轴方向的间距
  - crossAxisSpacing：交叉轴的间距
  - childAspectRatio：子元素的宽高比例

另外，还有一个属性需要注意，就是 physics，它的类型是 ScrollPhysics

首先介绍 ScrollPhysics ，在 Flutter 官方的介绍中， ScrollPhysics 的作用是 **确定可滚动控件的物理特性**， 常见的有以下四大金刚： 

- BouncingScrollPhysics ：允许滚动超出边界，但之后内容会**反弹**回来。 
- ClampingScrollPhysics ： 防止滚动超出边界，**夹住** 。 
- AlwaysScrollableScrollPhysics ：始终**响应**用户的滚动。 
- NeverScrollableScrollPhysics ：**不响应**用户的滚动。

使用 GridView 

1. GridView 默认构造函数可以类比于 ListView 默认构造函数，适用于**有限个数子元素**的场景，因为 GridView 组件会一次性全部渲染 children 中的子组件； 
2. GridView.count 命名构造函数是 GrdiView 使用 SliverGridDelegateWithFixedCrossAxisCount 的 简写（语法糖），效果完全一致； 
3. GridView.extent 命名构造函数式 GridView 使用 SliverGridDelegateWithMaxCrossAxisExtent 的 简写（语法糖），效果完全一致。 
4. GridView.builder 命名构造函数可以类比于 ListView.builder，适用于**长列表**的场景，因为 GridView 组件会根据子组件是否出现在屏幕内而动态创建销毁，减少内存消耗，更高效渲染；

![image-20220724154354275](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724154354275.png)

不使用语法糖

```dart
class GridViewDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(10),
      child: 
      // GridView(
      //   gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
      //     crossAxisCount: 2, // 指定列数
      //     mainAxisSpacing: 20, // 主轴方向的间距
      //     crossAxisSpacing: 10, // 交叉轴的间距
      //     childAspectRatio: 1.5, // 子组件的宽高比例
      //   ),
      //   children: [
      //     Container(color: Colors.tealAccent),
      //     Container(color: Colors.amberAccent),
      //     Container(color: Colors.redAccent),
      //     Container(color: Colors.blueGrey),
      //     Container(color: Colors.purpleAccent),
      //     Container(color: Colors.lightGreenAccent),
      //     Container(color: Colors.lightGreen),
      //     Container(color: Colors.black54),
      //     Container(color: Colors.yellowAccent),
      //     Container(color: Colors.grey),
      //     Container(color: Colors.deepOrangeAccent),
      //   ],
      // ),
      GridView(
        gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 190, // 子组件的宽度
          mainAxisSpacing: 30,
          crossAxisSpacing: 10,
          childAspectRatio: 0.8,
        ),
        children: [
          Container(color: Colors.tealAccent),
          Container(color: Colors.amberAccent),
          Container(color: Colors.redAccent),
          Container(color: Colors.blueGrey),
          Container(color: Colors.purpleAccent),
          Container(color: Colors.lightGreenAccent),
          Container(color: Colors.lightGreen),
          Container(color: Colors.black54),
          Container(color: Colors.yellowAccent),
          Container(color: Colors.grey),
          Container(color: Colors.deepOrangeAccent),

        ],
      )
    );
  }
}
```

使用语法糖

```dart
class GridViewCountDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: GridView.count(
        children: List.generate(10, (index) => 
          Image.asset('images/flutter.jpg')
        ),
        crossAxisCount: 2,
        mainAxisSpacing: 20,
        crossAxisSpacing: 20,
        padding: EdgeInsets.symmetric(horizontal: 40),
        childAspectRatio: 1.5,
      ),
    );
  }
}

class GridViewExtendDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: GridView.extent(
        children: List.generate(10, (index) => 
          Image.asset('images/flutter.jpg')
        ),
        maxCrossAxisExtent: 100, // 子组件的宽度
        mainAxisSpacing: 20,
        crossAxisSpacing: 20,
        padding: EdgeInsets.symmetric(horizontal: 40),
        // childAspectRatio: 1.5,
      ),
    );
  }
}

class GridViewBuilderDemo extends StatelessWidget {
  final List<dynamic> _tiles = [
    Container(color: Colors.tealAccent),
    Container(color: Colors.amberAccent),
    Container(color: Colors.redAccent),
    Container(color: Colors.blueGrey),
    Container(color: Colors.purpleAccent),
    Container(color: Colors.lightGreenAccent),
    Container(color: Colors.lightGreen),
    Container(color: Colors.black54),
    Container(color: Colors.yellowAccent),
    Container(color: Colors.grey),
    Container(color: Colors.deepOrangeAccent),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      child: GridView.builder(
        padding: EdgeInsets.symmetric(horizontal: 40),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 20,
          crossAxisSpacing: 20,
          childAspectRatio: 1.0
        ),
        itemCount: _tiles.length,
        itemBuilder: (context, index) {
          return _tiles[index];
        },
        physics: BouncingScrollPhysics(), // 反弹效果
        // physics: ClampingScrollPhysics(), // 夹住的效果
        // physics: AlwaysScrollableScrollPhysics(), // 滚动
        // physics: NeverScrollableScrollPhysics(), // 禁止滚动
      ),
    );
  }
}
```

