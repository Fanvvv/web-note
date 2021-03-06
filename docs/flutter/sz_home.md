# 首页

## 展示内容 

首页包含两部分内容： 

- 广告轮播 

  数据接口已经完成。想要展示轮播的话需要使用 [flutter_swiper_view](https://pub.dev/packages/flutter_swiper_view) 插件。 

- 课程列表 

## 广告轮播

安装 flutter_swiper_view

在 home 文件夹下创建 HomeSwiper.dart 文件

```dart
import 'package:flutter/material.dart';
import 'package:flutter_swiper_view/flutter_swiper_view.dart';

class HomeSwiper extends StatelessWidget {
  List adList;
  HomeSwiper({Key? key, required this.adList }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Swiper(
      itemCount: adList.length,
      itemBuilder: (context, index) {
        return Image.network(
          adList[index]['img'],
          fit: BoxFit.cover,
        );
      },
      pagination: SwiperPagination(), // 轮播图的指示点
      control: SwiperControl(), // 左右箭头导航
      autoplay: true,
      autoplayDelay: 3000,
    );
  }
}
```

在 Home.dart 中使用 HomeSwiper 组件

```dart
import 'HomeSwiper.dart';
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
      setState(() {
        adList = res.where((ad) => ad['status'] == 1).toList();
      });
      print(adList);
    });
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 400,
      child: HomeSwiper(adList: adList),
    );
  }
  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }
}
```

>在 initState 中发送完请求，需要使用 dispose 释放掉

## 课程列表

创建课程列表API，CourseAPI.dart

```dart
import 'package:dio/dio.dart';

class CourseAPI {
  final Dio _dio;

  CourseAPI(this._dio);

  /// 课程列表
  Future<dynamic> courseList() async {
    Response res = await _dio.get('/front/course/getAllCourse');

    List courseList = res.data['content'];
    return courseList;
  }
}
```

在API.dart文件中添加接口

```dart
import 'package:dio/dio.dart';
import 'initDio.dart';
import 'AdAPI.dart';
import 'CourseAPI.dart';

class API {
  late Dio _dio;

  API() {
    _dio = initDio();
  }

  /// 广告接口
  AdAPI get ad => AdAPI(_dio);

  /// 课程列表接口
  CourseAPI get course => CourseAPI(_dio);
}
```

在Home.dart组件请求数据，并使用HomeCourse组件

```dart
List courseList = [];

@override
void initState() {
  // 轮播图数据
  G.api.ad.adList().then((res) {
    setState(() {
      adList = res.where((ad) => ad['status'] == 1).toList();
    });
  });
  // 课程列表数据
  G.api.course.courseList().then((res) {
    setState(() {
      courseList = res;
    });
    print(courseList);
  });
  super.initState();
}
@override
Widget build(BuildContext context) {
  return CustomScrollView(
    slivers: [
      SliverToBoxAdapter(
        child: Container(
          height: 400.h,
          child: HomeSwiper(adList: adList),
        ),
      ),
      SliverPadding(
        padding: EdgeInsets.all(10),
        sliver: HomeCourse(courseList: courseList),
      ),
    ],
  );
}
```

编写 HomeCourse 组件

```dart
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeCourse extends StatefulWidget {
  List courseList = [];
  HomeCourse({Key? key, required this.courseList}) : super(key: key);

  @override
  State<HomeCourse> createState() => _HomeCourseState();
}

class _HomeCourseState extends State<HomeCourse> {
  @override
  Widget build(BuildContext context) {
    return SliverList(
        delegate: SliverChildBuilderDelegate(
          (BuildContext context, int index) {
            var course = widget.courseList[index];
            return GestureDetector(
              onTap: () {
                print('点击$index');
              },
              child: Container(
                padding: const EdgeInsets.all(10),
                child: Flex(
                  direction: Axis.horizontal,
                  children: [
                    Expanded(
                      flex: 1,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.network(
                          course['courseListImg'],
                          fit: BoxFit.cover,
                          height: 120,
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 3,
                      child: Container(
                        height: 120,
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: double.infinity,
                              child: Text(
                                course['courseName'],
                                style: const TextStyle(
                                  fontSize: 16
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Container(
                              width: double.infinity,
                              child: Text(
                                course['brief'],
                                style: const TextStyle(
                                  fontSize: 14
                                ),
                                overflow: TextOverflow.ellipsis,
                              )
                            ),
                            Row(
                              children: [
                                Container(
                                  color: Colors.grey[200],
                                  width: 200.w,
                                  padding: const EdgeInsets.all(5),
                                  child: Text(course['teacherDTO']['teacherName']),
                                ),
                                const SizedBox(width: 10),
                                Container(
                                  color: Colors.grey[200],
                                  width: 200.w,
                                  padding: const EdgeInsets.all(5),
                                  child: Text(
                                    course['teacherDTO']['description'],
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                Container(
                                  child: Text(
                                    '￥'+course['discounts'].toString(),
                                    style: const TextStyle(
                                      fontSize: 18,
                                      color: Colors.red,
                                      fontWeight: FontWeight.w500,
                                    )
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Container(
                                  child: Text(
                                    course['sales'].toString()+"人购买",
                                    style: const TextStyle(
                                      fontSize: 14,
                                    )
                                  ),
                                )
                              ],
                            ),
                          ],
                        ),
                      )
                    )
                  ],
                ),
              ),
            );
          },
          childCount: widget.courseList.length
        )
    );
  }
}
```

## 屏幕适配

做完轮播图会发现图片会看不全，需要适配

可以使用工具 [flutter_screenutil](https://pub.dev/packages/flutter_screenutil) 进行适配

安装最新版 flutter_screenutil

在 main.dart 入口文件中增加 ScreenUtilInit 组件的使用

```dart
import 'package:flutter_screenutil/flutter_screenutil.dart';
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      // 这里用的是 iPhone6 的 size
      designSize: Size(750, 1334),
      builder: (BuildContext context, child) => MaterialApp(
        title: 'Flutter学习',
        theme: ThemeData(
          primarySwatch: Colors.red,
        ),
        // home: Index(),
        debugShowCheckedModeBanner: false,
        onGenerateRoute: G.router.generator,
        initialRoute: '/',
      ),
    );
  }
}
```

在实际使用过程中，以 Flutter 1.2 为分割线，有两种不同的语法 

- Flutter 1.2 之前

```dart
width: ScreenUtil().setWidth(50);
height: ScreenUtil().setHeight(200);
```

- Flutter 1.2 之后

```dart
width: 50.w;
height: 200.h;
```

在 Home.dart 中设置轮播图的高度

```dart
return Container(
  height: 400.h,
  child: HomeSwiper(adList: adList),
);
```

