# 按钮

Flutter 1.22 版本新增了3个按钮，TextButton、OutlinedButton、ElevatedButton，虽然以前的 Button 没有被废弃，但还是建议使用新的 Button。以前的按钮调整为统一的外观比较麻烦，因此以前 经常使用自定义的按钮，而新增的按钮解决了此类问题，可以非常方便的设置整体外观

| **1.22**版本前的按钮 | **主题**    | **1.22**版本后的按钮 | **主题**            |
| -------------------- | ----------- | -------------------- | ------------------- |
| FlatButton           | ButtonTheme | **TextButton**       | TextButtonTheme     |
| OutlineButton        | ButtonTheme | **OutlinedButton**   | OutlinedButtonTheme |
| RaisedButton         | ButtonTheme | **ElevatedButton**   | ElevatedButtonTheme |

外观上并没有很大的不同，但 TextButton、OutlinedButton、ElevatedButton 将外观属性集合为一个 **ButtonStyle**，非常方便统一控制。 建议使用 **TextButton** 替换 FlatButton、**OutlinedButton** 替换 OutlineButton、**ElevatedButton** 替换 RaisedButton。

TextButton、OutlinedButton、ElevatedButton 的使用方式一致，这里只介绍 TextButton

## TextButton

```dart
const TextButton({
  Key key,
  @required VoidCallback onPressed, // 按键回调 - 必填项
  VoidCallback onLongPress, // 长按回调
  ButtonStyle style, // 按钮样式
  FocusNode focusNode, // 焦点事件捕获与监听对象
  ButtonStyle（按钮样式）
  其中属性对应的值，通过 MaterialStateProperty 组件来设置。
  clipBehavior（剪切内容）
  Clip.hardEdge（剪辑，但不应用抗锯齿）
  Clip.antiAlias（剪辑具有抗锯齿功能）
  Clip.antiAliasWithSaveLayer（在剪辑后立即剪辑具有抗锯齿和 saveLayer）
  Clip.none（不剪辑 - 默认值）
  TextButton 的代码示例
  bool autofocus = false, // 自动获取焦点
  Clip clipBehavior = Clip.none, // 剪切
  @required Widget child, // 子组件 - 必填项
  }) : super(
  key: key,
  onPressed: onPressed,
  onLongPress: onLongPress,
  style: style,
  focusNode: focusNode,
  autofocus: autofocus,
  clipBehavior: clipBehavior,
  child: child,
);
```

ButtonStyle（按钮样式）

```dart
const ButtonStyle({
  this.textStyle, // 文本样式,设置文字的大小和粗细
  this.backgroundColor, // 背景色
  this.foregroundColor, // 前景色，即文本的颜色和图标的颜色
  this.overlayColor, // 水波纹颜色
  this.shadowColor, // 阴影颜色
  this.elevation, // 阴影高度
  this.padding, // 内间距
  this.minimumSize, // 设置按钮的大小
  this.side, // 边框设置
  this.shape, // 外边框样式 - 会覆盖side
  this.mouseCursor, // 鼠标指针的光标进入或悬停在此按钮的[InkWell]上时
  this.visualDensity, // 视觉密度 - 按钮布局的紧凑程度
  this.tapTargetSize, // 配置按钮被按下区域的最小尺寸
  this.animationDuration, // 动画变化的持续时间
  this.enableFeedback, // 检测到的手势是否应该提供听觉和/或触觉反馈
});
```

其中属性对应的值，通过 MaterialStateProperty 组件来设置。

- clipBehavior（剪切内容） 
  - Clip.hardEdge（剪辑，但不应用抗锯齿）
  - Clip.antiAlias（剪辑具有抗锯齿功能） 
  - Clip.antiAliasWithSaveLayer（在剪辑后立即剪辑具有抗锯齿和 saveLayer） 
  - Clip.none（不剪辑 - 默认值）

TextButton 的代码示例

```dart
TextButton(
  onPressed: () {
  	// Respond to button press
  },
  child: Text('TextButton'),
  style: ButtonStyle(
    // 文本样式
    textStyle: MaterialStateProperty.all(TextStyle(
    fontSize: 18,
    color: Colors.red
   	)),
    // 前景色
    foregroundColor: MaterialStateProperty.resolveWith((states) {
      if (states.contains(MaterialState.pressed)) {
        ////按下时的颜色
        return Colors.red;
      }
      //默认状态使用灰色
      return Colors.black;
    },
  ),
  // 背景色
  backgroundColor: MaterialStateProperty.resolveWith((states) {
    // 设置按下时的背景颜色
    if (states.contains(MaterialState.pressed)) {
    	return Colors.yellow;
    }
    //默认不使用背景颜色
    return Colors.white;
  }),
  // 阴影颜色
  shadowColor: MaterialStateProperty.all(Colors.yellow),
  // 阴影高度
  elevation: MaterialStateProperty.all(20),
  // 设置水波纹颜色
  overlayColor: MaterialStateProperty.all(Colors.purpleAccent),
  // 设置按钮大小
  minimumSize: MaterialStateProperty.all(Size(150, 80)),
  // 设置边框
  side: MaterialStateProperty.all(BorderSide(color: Colors.red, width: 1)),
  // 设置按钮形状
  shape: MaterialStateProperty.all(StadiumBorder(
    side: BorderSide(
      color: Colors.red,
      width: 1,
      style: BorderStyle.solid
      ),
    )),
  )
),
```

## OutlinedButton 

轮廓按钮 - 同 TextButton 

## ElevatedButton 

凸起按钮 - 同 TextButton 

## 图标按钮 

- IconButton

```dart
IconButton(
  icon: Icon(Icons.access_alarms),
  onPressed: () {
  	// Respond to button press
  },
)
```

- TextButton.icon()

```dart
TextButton.icon(
  onPressed: () {
  	// Respond to button press
  },
  icon: Icon(Icons.zoom_in_rounded),
  label: Text('Text Button'),
)
```

- OutlinedButton.icon()

```dart
OutlinedButton.icon(
  onPressed: () {
  	// Respond to button press
  },
  icon: Icon(Icons.zoom_in_rounded),
  label: Text('Outlined Button'),
)
```

- ElevatedButton.icon()

```dart
ElevatedButton.icon(
  onPressed: () {
  	// Respond to button press
  },
  icon: Icon(Icons.zoom_in_rounded),
  label: Text('Elevated Button'),
)
```

## ButtonBar 

ButtonBar 并不是一个单独的按钮控件，而是末端对齐的容器类控件，当在水平方向上没有足够空间时 候，按钮将整体垂直排列，而不是换行。

```dart
ButtonBar(
  children: <Widget>[
    ElevatedButton(),
    ElevatedButton(),
    ElevatedButton(),
    ElevatedButton(),
  ],
)
```

## FloatingActionButton 

浮动按钮