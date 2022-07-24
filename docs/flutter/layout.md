# 页面布局

## Container

Container 就是 Flutter 中的盒子模式

- Cintainer
  - padding：EdgeInsets.all(10.0)
    - fromLTRB(double left, double top, double right, double bottom)：指定四个方向的填充。 
    - all(double value) : 所有方向，均使用相同数值的填充。 
    - only({left, top, right ,bottom })：可以设置某个方向的填充（也可以同时指定多个方 向） 
    - symmetric({ vertical, horizontal })：用于设置对称方向的填充，
      -  vertical 值垂直方向， 
      - horizontal 指水平方向。
  - margin：参考padding
  - color Colors.颜色 
  - width 
    - 数字 
    - double.infinity 
  - height 
    - 数字 
    - double.infinity 
  - decoration 是 container 的修饰器，用来设置背景和边框 
    - BoxDecoration 
      - Color color, 颜色 
      - DecorationImage image, 图片 
      - BoxBorder border, 边框 
      - BorderRadiusGeometry borderRadius, 圆角 
      - List boxShadow, 阴影,可以指定多个 
      - Gradient gradient, 渐变 
      - BlendMode backgroundBlendMode, 背景混合模式 
      - BoxShape shape = BoxShape.rectangle, 形状
  - alignment 内容对齐方式 
    - Alignment 
      - bottomCenter:下部居中对齐。 
      - botomLeft: 下部左对齐。 
      - bottomRight：下部右对齐。 
      - center：纵横双向居中对齐。 
      - centerLeft：纵向居中横向居左对齐。
      - centerRight：纵向居中横向居右对齐。
      - topLeft：顶部左侧对齐。 
      - topCenter：顶部居中对齐。 
      - topRight： 顶部居左对齐。
  - transform 变形 
    - Matrix4 
      - translate：平移 
      - rotate：旋转 
      - scale：缩放 
      - skew：斜切

```dart
class ContainerDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text(
        'Hello Container',
        style: TextStyle(fontSize: 28.0),
      ),
      alignment: Alignment.bottomCenter,
      // width: 300.0,
      // height: 400.0,
      width: double.infinity,
      height: double.infinity,
      padding: EdgeInsets.all(10.0),
      margin: EdgeInsets.fromLTRB(10.0, 30.0, 0.0, 5.0),
      decoration: new BoxDecoration(
        color: Colors.lightGreen[200], // 背景色
        gradient: LinearGradient(// 设置渐变后，背景色失效
            colors: [Colors.lightBlue, Colors.greenAccent, Colors.purple]),
      // border: Border.all(
      // width: 20.0,
      // color: Colors.red
      // ),
        border: Border(
          top: BorderSide(width: 40.0, color: Colors.red),
          bottom: BorderSide(width: 20.0, color: Colors.yellow),
          right: BorderSide(width: 60.0, color: Colors.green),
        ),
      // borderRadius: BorderRadius.all(Radius.circular(50)),
      // borderRadius: BorderRadius.only(
      // topLeft: Radius.circular(30),
      // topRight: Radius.circular(30),
      // bottomLeft: Radius.circular(10),
      // bottomRight: Radius.circular(10),
      // )
      ),
    );
  }
}
```

## 线性布局

### Column

组件沿着列（Column）方向进行布局

- Column
  - Column 中的主轴方向是垂直方向
  - mainAxisAlignment：MainAxisAlignment 主轴对齐方式
  - crossAxisAlignment：CrossAxisAlignment 交叉抽对齐方式
  - children 声明内容

### Row

组件沿着行（Row）方向进行布局

- Row
  - Row 中的主轴方向是水平方向
  - mainAxisAlignment：MainAxisAlignment 主轴对齐方式
  - crossAxisAlignment：CrossAxisAlignment 交叉抽对齐方式

```dart
class ColumnRowDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.lightGreen,
      width: double.infinity,
      child: Column(
        // 主轴的对齐方式
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        // 交叉轴的对齐方式
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(Icons.access_alarms, size: 50),
          Icon(Icons.accessible_forward_rounded, size: 50),
          Icon(Icons.settings, size: 50),
          Icon(Icons.add_box, size: 50),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Icon(Icons.access_alarms, size: 50),
              Icon(Icons.accessible_forward_rounded, size: 50),
              Icon(Icons.settings, size: 50),
              Icon(Icons.add_box, size: 50),
            ],
          ),
        ],
      )
    );
  }
}
```

## 弹性布局 

### Flex 

- direction 设置主轴方向，可设置的值为 Axis.horizontal 和 Axis.vertical，交叉轴与主轴方向垂直。 
- mainAxisAlignment 子组件沿着主轴方向的对齐方式：
  - MainAxisAlignment.start：左对齐（默认值） 
  - MainAxisAlignment.end：右对齐
  - MainAxisAlignment.center：居中对齐
  - MainAxisAlignment.spaceBetween：两端对齐
  - MainAxisAlignment.spaceAround：空格环绕
  - MainAxisAlignment.spaceEvently：空格平均分布
- crossAxisAlignment 子组件在交叉轴的对齐方向 
  - CrossAxisAlignment.start：与交叉轴的起始位置对齐； 
  - CrossAxisAlignment.end：与交叉轴的结束位置对齐； 
  - CrossAxisAlignment.center：居中对齐； 
  - CrossAxisAlignment.stretch：填充整个交叉轴；
  -  CrossAxisAlignment.baseline：按照第一行文字基线对齐。 
- mainAxisSize 设置主轴的大小 
  - MainAxisSize.max：主轴的大小是父容器的大小； 
  - MainAxisSize.min：主轴的大小是其子组件大小之和。 
- verticalDirection 设置垂直方向上的子组件的排列顺序 
  - VerticalDirection.down：start 在顶部，end 在底部；
  -  VerticalDirection.up：start 在底部，end 在顶部。 
- textBaseline 设置文字对齐的基线类型 
  - TextBaseline.alphabetic：与字母基线对齐； 
  - TextBaseline.ideographic：与表意字符基线对齐； 

### Expanded 

- flex 声明所占比例 
- child 声明子组件

```dart
class FlexDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 验证 Expanded
        Row(
          children: [
            Container(
              color: Colors.lightBlue,
              height: 50,
              width: 50,
            ),
            Expanded(
              child: Container(
                color: Colors.lightGreen,
                height: 50,
              ),
            )
          ],
        ),
        Flex(
          direction: Axis.horizontal,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          // 声明水平方向的排列方式
          textDirection: TextDirection.rtl,
          children: [
            Icon(Icons.access_alarms, size: 50),
            Icon(Icons.accessible_forward_rounded, size: 50),
            Icon(Icons.settings, size: 50),
            Icon(Icons.add_box, size: 50),
          ],
        ),
        Flex(
          direction: Axis.horizontal,
          children: [
            Expanded(
              child: Container(
                color: Colors.tealAccent,
                height: 50,
              ),
              flex: 2,
            ),
            Expanded(
              child: Container(
                color: Colors.amberAccent,
                height: 50,
              ),
              flex: 1,
            )
          ],
        ),
        Container(
          height: 100,
          margin: EdgeInsets.all(50),
          child: Flex(
            direction: Axis.vertical,
            verticalDirection: VerticalDirection.up,
            children: [
              Expanded(
                child: Container(
                  color: Colors.tealAccent,
                  height: 50,
                ),
                flex: 2,
              ),
              // Spacer(
              //   flex: 1
              // ),
              Expanded(
                child: Container(
                  color: Colors.amberAccent,
                  height: 50,
                ),
                flex: 1,
              )
            ],
          ),
        ),
      ],
    );
  }
}
```

## 流式布局 

在介绍 Row 和 Colum 时，如果子组件超出屏幕范围，则会报溢出错误。而流式布局可以有效解决内容溢出。 

### Wrap 

- spacing：主轴方向子组件的间距 
- alignment: 主轴方向的对齐方式 
  - WrapAlignment 
- runSpacing：纵轴方向子组件的间距 
- runAlignment：纵轴方向的对齐方式 
  - WrapAlignment

```dart
class WrapDemo extends StatelessWidget {
  List<String> _list = [
    '曹操', '司马懿', '曹仁', '曹洪', '张辽', '许褚'
  ];

  List<Widget> _weiGuo() {
    return _list.map((item) => Chip(
      avatar: CircleAvatar(
        backgroundColor: Colors.pink,
        child: Text('魏'),
      ),
      label: Text(item),
    )).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Wrap(
          children: _weiGuo(),
          spacing: 18.0, // 水平方向的间距
          alignment: WrapAlignment.spaceAround, // 主轴方向的对齐方式
          runSpacing: 100, // 垂直方向的间距
          // runAlignment: WrapAlignment.spaceAround, // 交叉轴方向i的对齐方式
        ),

        Wrap(
          children: [
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('刘备'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('关羽'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('张飞'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('赵云'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('诸葛亮'),
            ),
            Chip(
              avatar: CircleAvatar(
                backgroundColor: Colors.blue,
                child: Text('蜀'),
              ),
              label: Text('黄忠'),
            ),
          ],
        ),
      ],
    );
  }
}
```

## 层叠布局

### Stack

- alignment：此参数决定如何去对齐没有定位（没有使用 Positioned）或部分定位的子组件。 所谓部分定位，在这里**特指没有在某一个轴上定位**：left、right 为横轴，top、bottom 为纵轴，只 要包含某个轴上的一个定位属性就算在该轴上有定位。 

- textDirection：和 Row、Wrap 的 textDirection 功能一样，都用于确定 alignment 对齐的参考 系。 

  textDirection 的值为 TextDirection.ltr，则 alignment 的 start 代表左，end 代表右，即从左往右 的顺序textDirection 的值为 TextDirection.rtl，则 alignment 的 start 代表右，end 代表左，即从 右往左的顺序 

- fit：此参数用于确定**没有定位**的子组件如何去适应 Stack 的大小。 StackFit.loose 表示使用子组件的大小，StackFit.expand 表示扩伸到 Stack 的大小。

- overflow：此属性决定如何显示超出 Stack 显示空间的子组件； 

  值为 Overflow.clip 时，超出部分会被剪裁（隐藏），值为 Overflow.visible 时则不会。

### Positioned 

Positioned 可以控制组件的位置，通过他可以随意摆放一个组件，有点像**绝对布局**。

left、top 、right、 bottom 分别代表离 Stack 左、上、右、底四边的距离。width 和 height 用于指定 需要定位元素的宽度和高度。

> 注意，Positioned 的 width、height 和其它地方的意义稍微有点区别，此处用于配合 left、top 、 right、 bottom 来定位组件。 
>
> 举个例子，在水平方向时，你只能指定 left、right、width 三个属性中的两个，如指定 left 和 width 后，right 会自动算出( left+width )，如果同时指定三个属性则会报错，垂直方向同理。

```dart
class StackDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        // 声明未定位的子组件的排序方式
        textDirection: TextDirection.rtl,
        // 声明未定位的子组件的对齐方式
        alignment: AlignmentDirectional.bottomEnd,
        children: [
          CircleAvatar(
            backgroundImage: NetworkImage('http://img12.360buyimg.com/n1/jfs/t1/133894/17/20175/388796/5fdb4134E17deda69/15535fe4303a1630.png'),
            radius: 200,
          ),
          Positioned(
            child: Container(
              color: Colors.red,
              padding: EdgeInsets.all(10),
              child: Text(
                '热卖',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20
                ),
              )
            ),
            top: 50,
            right: 40
          ),
          Text(
            'Hello',
            style: TextStyle(
              color: Colors.black,
              fontSize: 40
            ),
          )
        ],
      )
    );
  }
}
```

![image-20220724144720686](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724144720686.png)

## Card

Card 是 Flutter 中的卡片组件，功能与 Container 类似，用来声明局部页面布局 

- color 卡片背景色 

- shadowColor 阴影颜色 

- elevation 阴影高度 

- shape 边框样式 

  RoundedRectangleBorder 

- borderOnForeground 是否在 child 前绘制 border，默认为 true 

- margin 外边距 

- clipBehavior 裁切方式 

- child 子组件 

- semanticContainer 是否使用新的语义节点，默认为 true

ListTile 列表瓦片

- leading 头部组件
- title 标题
- subtitle 子标题

```dart
class CardDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Card(
          margin: EdgeInsets.all(30),
          color: Colors.purpleAccent[100],
          shadowColor: Colors.yellow, // 阴影颜色
          elevation: 20, // 阴影高度
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40),
            side: BorderSide(
              color: Colors.yellow,
              width: 3,
            ),
          ),
          child: Column(
            children: [
              ListTile(
                leading: Icon(
                  Icons.supervised_user_circle_rounded,
                  size: 50
                ),
                title: Text(
                  "张三",
                  style: TextStyle(
                    fontSize: 30
                  ),
                ),
                subtitle: Text(
                  "董事长",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              ),
              Divider(),
              ListTile(
                title: Text(
                  "电话：13333333333",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              ),
              ListTile(
                title: Text(
                  "地址：XXXXXXXX",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              )
            ],
          )
        ),
        Card(
          margin: EdgeInsets.all(30),
          child: Column(
            children: [
              ListTile(
                leading: Icon(
                  Icons.supervised_user_circle_rounded,
                  size: 50
                ),
                title: Text(
                  "李四",
                  style: TextStyle(
                    fontSize: 30
                  ),
                ),
                subtitle: Text(
                  "总经理",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              ),
              Divider(),
              ListTile(
                title: Text(
                  "电话：13333333333",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              ),
              ListTile(
                title: Text(
                  "地址：XXXXXXXX",
                  style: TextStyle(
                    fontSize: 20
                  ),
                ),
              )
            ],
          )
        )
      ],
    );
  }
}
```

![image-20220724145508157](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220724145508157.png)