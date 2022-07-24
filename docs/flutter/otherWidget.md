# 第三方库组件

## 常用的库

Flutter 中，常用的第三方组件。

| **库**                     | **功能**               |
| -------------------------- | ---------------------- |
| **dio**                    | **网络框架**           |
| **shared_preferences**     | **本地数据缓存**       |
| **fluttertoast**           | **toast**              |
| **flutter_redux**          | **redux**              |
| **device_info**            | **设备信息**           |
| **connectivity**           | **网络链接**           |
| **flutter_markdown**       | **markdown** **解析**  |
| **json_annotation**        | **json** **模板**      |
| **json_serializable**      | **json** **模板**      |
| **url_launcher**           | **启动外部浏览器**     |
| **iconfont**               | **字库图标**           |
| **share**                  | **系统分享**           |
| **flutter_spinkit**        | **加载框样式**         |
| **get_version**            | **版本信息**           |
| **flutter_webview_plugin** | **全屏的** **webview** |
| **sqflite**                | **数据库**             |
| **flutter_statusbar**      | **状态栏**             |
| **flutter_svg**            | **svg**                |
| **photo_view**             | **图片预览**           |
| **flutter_slidable**       | **侧滑**               |
| **flutter_cache_manager**  | **缓存管理**           |
| **path_provider**          | **本地路径**           |
| **permission_handler**     | **权限**               |
| **scope_model**            | **状态管理和共享**     |
| **lottie**                 | **svg** **动画**       |
| **flare**                  | **路径动画**           |

## dio

dio 是一个强大的 Dart Http 请求库，支持 Restful API、FormData、拦截器、请求取消、Cookie 管 理、文件上传/下载、超时、自定义适配器等。

详情：[https://pub.dev/packages/dio](https://pub.dev/packages/dio)

使用

```dart
import 'package:dio/dio.dart';
/// More examples see
/// https://github.com/flutterchina/dio/tree/master/example
main() async {
  var dio = Dio();
  Response response = await dio.get('https://google.com');
  print(response.data);
}
```

## flutter_swiper

flutter_swiper 是 Flutter 中最好的轮播组件。它可以实现多种轮播效果。同时适配 Android 和 iOS。

使用

```dart
final List<String> imgs = [
  'images/1.jpg',
  'images/2.jpg',
  'images/3.jpg',
];

Container(
  height: 200,
  child: Swiper(
    itemBuilder: (BuildContext context, int index) {
      return Image.asset(
        imgs[index],
        fit: BoxFit.cover,
    	);
  	},
    itemCount: imgs.length,
    pagination: SwiperPagination(), // 如果不填则不显示指示点
    control: SwiperControl(), // 如果不填则不显示左右按钮
  ),
)
```

### 常用属性

| **参数**        | **默认值**                     | **描述**                                      |
| --------------- | ------------------------------ | --------------------------------------------- |
| scrollDirection | Axis.horizontal                | 滚动方向，设置为Axis.vertical如果需要垂直滚动 |
| loop            | true                           | 无限轮播模式开关                              |
| index           | 0                              | 初始的时候下标位置                            |
| autoplay        | false                          | 自动播放开关                                  |
| onIndexChanged  | void onIndexChanged(int index) | 下标改变的时候调用                            |
| onTap           | void onTap(int index)          | 当用户点击某个轮播的时候调用                  |
| duration        | 300.0                          | 动画时间，单位是毫秒                          |
| pagination      | null                           | 设置 SwiperPagination() 展示默认分页指示器    |
| control         | null                           | 设置 SwiperControl() 展示默认分页按钮         |

### 分页指示器 

分页指示器继承自 SwiperPlugin, SwiperPlugin 为 Swiper 提供额外的界面。设置为 SwiperPagination() 展示默认分页.

| **参数**  | **默认值**                 | **描述**                                                     |
| --------- | -------------------------- | ------------------------------------------------------------ |
| alignment | Alignment.bottomCenter     | 如果要将分页指示器放到其他位置，那么可以修改这个参数         |
| margin    | const EdgeInsets.all(10.0) | 分页指示器与容器边框的距离                                   |
| builder   | SwiperPagination.dots      | 目前已经定义了两个默认的分页指示器样式： SwiperPagination.dots 、SwiperPagination.fraction ，都可以做进一步的自定义. |

### 控制按钮 

控制按钮组件也是继承自 SwiperPlugin ,设置 new SwiperControl() 展示默认控制按钮.

| **参数**     | **默认值**                     | **描述**             |
| ------------ | ------------------------------ | -------------------- |
| iconPrevious | Icons.arrow_back_ios           | 上一页的IconData     |
| iconNext     | Icons.arrow_forward_ios        | 下一页的IconData     |
| color        | Theme.of(context).primaryColor | 控制按钮颜色         |
| size         | 30.0                           | 控制按钮的大小       |
| padding      | const EdgeInsets.all(5.0)      | 控制按钮与容器的距离 |

### 控制器（SwiperController）

SwiperController 用于控制 Swiper 的 index 属性, 停止和开始自动播放. 通过 SwiperController() 创建一个SwiperController实例，并保存，以便将来能使用。

| **方法**                                      | **描述**                         |
| --------------------------------------------- | -------------------------------- |
| void move(int index, {bool  animation: true}) | 移动到指定下标，设置是否播放动画 |
| void next({bool animation: true})             | 下一页                           |
| void previous({bool animation:  true})        | 上一页                           |
| void startAutoplay()                          | 开始自动播放                     |
| void stopAutoplay()                           | 停止自动播放                     |

### 自动播放

| **参数**                     | **默认值** | **描述**                            |
| ---------------------------- | ---------- | ----------------------------------- |
| autoplayDely                 | 3000       | 自动播放延迟毫秒数.                 |
| autoplayDisableOnInteraction | true       | 当用户拖拽的时候，是否停止自动播放. |

## shared_preferences

SharedPreferences轻量级存储类，以键值对的形式保存设置，属性和数据。在Flutter平台我们使用 shared_preferences库来同时支持Android 和iOS。 

详情：[https://pub.dev/packages/shared_preferences](https://pub.dev/packages/shared_preferences)

使用

- 增 setString(key, value) 
- 删 remove(key) clear() 
- 改 更改就是重新设置数据。 setString(key, value) 
- 查 getString(key)

```dart
class SharedPreferencesDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ElevatedButton(
            onPressed: _incrementCounter, 
            child: Text('递增')
          ),
          ElevatedButton(
            onPressed: _decrementCounter, 
            child: Text('递减')
          ),
          ElevatedButton(
            onPressed: _removeCounter, 
            child: Text('删除')
          ),
          ElevatedButton(
            onPressed: _addMyContent, 
            child: Text('设置字符串')
          ),
          ElevatedButton(
            onPressed: _getMyContent, 
            child: Text('获取字符串')
          ),
          ElevatedButton(
            onPressed: _clearContent, 
            child: Text('清空')
          ),
        ],
      )
    );
  }

  _incrementCounter() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int counter = (prefs.getInt('counter') ?? 0) + 1;
    print('Pressed $counter times.');
    await prefs.setInt('counter', counter);
  }

  _decrementCounter() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int counter = prefs.getInt('counter') ?? 0;
    if (counter > 0) {
      counter--;
    }
    print('Pressed $counter times.');
    await prefs.setInt('counter', counter);
  }

  _removeCounter() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('counter');
    int counter = (prefs.getInt('counter') ?? 0) + 1;
    print('Pressed $counter times.');
  }

  _addMyContent() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('hi', 'Hello World');
    String content = prefs.getString('hi') ?? "";
    print('设置字符串的内容是 $content');
  }

  _getMyContent() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String content = prefs.getString('hi') ?? "";
    print('获取字符串的内容是 $content');
  }

  _clearContent() async {
    // 获取保存实例
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
```

