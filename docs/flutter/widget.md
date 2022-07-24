# Widget（组件）

## 组件概述

在 Flutter 中，一切的显示都是 Widget 。Widget 是一切的基础。Widget 和 Widget 之间通过 child: 进 行嵌套。一个 Flutter 组件，包含了组件的模板、样式和交互等内容，外部只要按照组件设定的属性、函 数及事件处理等进行调用即可，完全不用考虑组件的内部实现逻辑。你需要做的就是在 Widget 中堆积 你的布局。

- Center：定义居中部件

```dart
Center(
	child: // 部件
);
```

- Text：定义文本部件

```dart
Text(
	'hello',
	textDirection: TextDirection.ltr,
)
```

> 若不写textDirection会报错

- 自定义组件。为了增强代码的可读性，我们可以将部分代码分离出去。写成独立的 Widget。我们自定义的 Widget 需要继承 Flutter 提供的组件。这里有两种常用的组件
  - StatelessWidget。是无状态组件，状态不可变的 Widget
  - StatefulWidget。是有状态组件，持有的状态，可能在 Widget 生命周期改变。通俗的讲：如果我们想改变页面 中的数据的话，这个时候就需要用到 StatefulWidget

**自定义组件中，有一个关键的 build 方法。我们需要将独立的代码，放到 build 方法中**。上述 HelloWorld ，经过分离后的代码如下：

```dart
import 'package:flutter/material.dart';
void main() {
	runApp(Hello());
}
// 或简写为
// void main() => runApp(Hello());
// 创建一个继承自无状态部件的自定义部件
class Hello extends StatelessWidget {
    Widget build (BuildContext context) { // 实现一个build函数, 构建自身
        return Center( //返回一个部件
            child: Text(
                'Hello World!'，
                textDirection: TextDirection.ltr,
            )
        );
    }
}
```

## MaterialApp

参数对照表

| 字段                                                | 类型                             |
| --------------------------------------------------- | -------------------------------- |
| navigatorKey（导航主键）                            | GlobalKey                        |
| home（起始页）                                      | Widget                           |
| routes（路由列表）                                  | Map                              |
| initialRoute（初始路由名称）                        | String                           |
| onGenerateRoute（生成路由）                         | RouteFactory                     |
| onUnknownRoute（未知路由）                          | RouteFactory                     |
| navigatorObservers（导航观察器）                    | List                             |
| builder（构造器）                                   | TransitionBuilder                |
| title（应用标题）                                   | String                           |
| onGenerateTitle（生成应用标题）                     | GenerateAppTitle                 |
| color（颜色）                                       | Color                            |
| theme（主题配置）                                   | ThemeData                        |
| locale（本地化）                                    | Locale                           |
| localizationsDelegates（本地化委托代理）            | Iterable\<LocalizationsDelegate> |
| localeResolutionCallback（本地化分辨回调）          | LocaleResolutionCallback         |
| supportedLocales（应用支持区域）                    | Iterable                         |
| debugShowMaterialGrid（是否显示 Material 网格）     | bool                             |
| showPerformanceOverlay（显示性能监控叠层）          | bool                             |
| checkerboardRasterCacheImages（棋盘格光栅缓存图像） | bool                             |
| checkerboardOffscreenLayers（棋盘格层）             | bool                             |
| showSemanticsDebugger（显示语义调试器）             | bool                             |
| debugShowCheckedModeBanner（是否显示 DEBUG 横幅）   | bool                             |

## Scaffold

Scaffold 是 Flutter 应用的脚手架。用来搭建 Flutter 项目的基本布局结构

![image-20220723005004150](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220723005004150.png)

- appBar 显示在界面顶部的一个 AppBar，也就是 Android 中的 ActionBar 、Toolbar 
- body 当前界面的主体 Widget 
- floatingActionButton： 纸墨设计中所定义的 FAB，界面的主要功能按钮 
- persistentFooterButtons： 固定在下方显示的按钮，比如对话框下方的确定、取消按钮 
- drawer： 侧边栏控件 
- backgroundColor： 内容的背景颜色，默认使用的是 ThemeData.scaffoldBackgroundColor 的值 
- bottomNavigationBar： 显示在页面底部的导航栏 
- resizeToAvoidBottomPadding 类似于 Android 中的 android:windowSoftInputMode=”adjustResize”，控制界面内容 body 是否 重新布局来避免底部被覆盖了，比如当键盘显示的时候，重新布局避免被键盘盖住内容。默认值为 true

## 其他组件

### Cupertino

material.dart 提供了 Android 风格的组件；而 Cupertino 提供了 iOS 风格的组件。

Cupertino 详情：[https://flutter.dev/docs/development/ui/widgets/cupertino](https://flutter.dev/docs/development/ui/widgets/cupertino)

### SafeArea 

SafeArea 主要用来解决刘海屏的问题。