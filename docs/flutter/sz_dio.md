# 接口调用

## Dio

安装Dio：[https://pub.dev/packages/dio](https://pub.dev/packages/dio)

报错： **Insecure HTTP is not allowed by platform** 

原因：平台不支持不安全的 HTTP 协议，即不允许访问 HTTP 域名的地址。 

- Android 解决

```xml
<uses-permission android:name="android.permission.INTERNET" /> <!-- 添加这
一行 -->
<application
android:label="flutter_app"
android:usesCleartextTraffic="true" <!-- 添加这一行 -->
android:icon="@mipmap/ic_launcher">
```

- iOS 解决 

  打开 ios/Runner/Info.plist。添加如下代码：

```
<key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
  </dict>
```

Dio 手册：[https://github.com/flutterchina/dio/blob/master/README-ZH.md](https://github.com/flutterchina/dio/blob/master/README-ZH.md)

## 初始化 Dio

我们把所有接口操作相关的代码都集中放到 api 目录下。例如：

```bash
lib
|--api
|----initDio.dart 初始化 Dio
|----AdAPI.dart 广告 API
|----CourseAPI.dart 课程 API
|----UserAPI.dart 用户 API
|----OrderAPI.dart 订单 API
|----API.dart 所有 API（包括用户，订单，课程，广告等）
```

接下来，我们来创建具体的文件。首先，创建 lib/api/initDio.dart

```dart
// dio 4.0
import 'package:dio/dio.dart';

Dio initDio() {
  BaseOptions _baseOptions = BaseOptions(
    baseUrl: 'http://edufront.lagounews.com/',
    connectTimeout: 5000,
  );

  // 初始化
  Dio dio = Dio(_baseOptions);

  // 添加拦截器
  dio.interceptors.add(
    InterceptorsWrapper(
      // 请求拦截
      onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
        return handler.next(options);
      },
      // 响应拦截
      onResponse: (Response response, ResponseInterceptorHandler handler) {
        if (response.data == null || response.data['state'] != 1) {
          print('响应失败：'+response.data['message']);
          response.data = null;
        }
        return handler.next(response);
      },
      onError: (DioError error, ErrorInterceptorHandler handler) {
        return handler.next(error);
      }
    )
  );
  return dio;
}
```

## 使用 Dio 

获取首页广告列表 

创建 lib/api/AdAPI.dart

```dart
import 'package:dio/dio.dart';

class AdAPI {
  final Dio _dio;

  AdAPI(this._dio);

  /// 广告列表
  Future<dynamic> adList({ String spaceKeys = '999' }) async {
    Response res = await _dio.get('/front/ad/getAllAds',
      queryParameters: {
        "spaceKeys": spaceKeys
      }
    );

    List adList = res.data['content'][0]['adDTOList'];
    return adList;
  }
}
```

创建 lib/api/API.dart

```dart
import 'package:dio/dio.dart';
import 'initDio.dart';
import 'AdAPI.dart';

class API {
  late Dio _dio;

  API() {
    _dio = initDio();
  }

  /// 广告接口
  AdAPI get ad => AdAPI(_dio);
}
```

**为了操作方便，我们可以把常用内容统一放到一个全局文件中**。 

例如，创建 lib/utils/Global.dart。然后，把我们写好的接口放到 Global.dart 中。

```dart
import 'package:flutter/material.dart';
import '../api/API.dart';

class G {
  /// 初始化 API
  static final API api = API();

}
```

在首页中调用接口 adList()

```dart
import '../../utils/Global.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List adList = [];
  @override
  void initState() {
    G.api.ad.adList().then((res) {
      print(res);
    });
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

