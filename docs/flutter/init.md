# 初始化项目

## 创建项目

可以使用命令进行创建

```bash
flutter create <项目名>
```

## 启动模拟器

- 可通过命令行启动模拟器

```bash
# 查看已安装的模拟器
flutter emulators

# 启动模拟器 flutter emulators --launch <emulator id>
flutter emulators --launch Pixel_3a_API_30
```

- 可通过 Android Studio 启动模拟器
- 可通过 VS Code 启动模拟器

## 项目目录

```bash
flutter_app
├── android # 安卓目录
├── build # 构建目录
├── ios # iOS 目录
├── lib # 开发目录（相当于 src 目录）
| ├── main.dart # 入口文件（相当于 index.js）
├── test # 测试目录
├── .gitignore # Git 提交时，设置忽略文件内容
├── pubspec.lock # 项目依赖锁定信息（相当于 npm 中的 package-lock.json）
└── pubspec.yaml # 项目依赖配置（相当于 npm 中的 package.json）
```

## 入口文件

Flutter 项目的入口文件是 lib/main.dart，在入口文件中有一个入口方法。

> 初始化的代码太复杂，这里我写了一个简单的示例代码

```dart
import 'package:flutter/material.dart';
void main() {
	runApp(Center(
		child: Text(
			'Hello World!'，
			textDirection: TextDirection.ltr,
		)
	));
}
```

- UI 库 material

```dart
import 'package:flutter/material.dart';
```

Material 是一种标准的移动端和 Web 端的 UI 框架，是一套 Google 的设计规范，Flutter 项目以 Material 为 UI 基础。

官网：[https://www.material.io/](https://www.material.io/)

中文网：[https://material-io.cn/](https://material-io.cn/)

- 入口方法

```dart
// 入口方法
void main() {
	// 具体内容
}
```

- 根函数 runApp()

```dart
void main(){
	runApp(
		// 具体组件
	);
}
```

runApp 函数接收给定的组件（Widget），并使其成为组件树的根。框架强制根组件覆盖整个屏 幕，这意味着 'Hello World!' 文本，在屏幕上居中显示。

## 修改国内镜像源

修改镜像源只需要改一次，再次启动时，无需再改 

国内特有的问题，防止启动应用时，访问不到 google 等国外资源

在运行 flutter 项目之前，需要先修改运行项目必须的资源路径。需要改两个文件 

- flutter项目/android/build.gradle 
- Flutter SDK 包下的 flutter.gradle 文件 

修改文件 flutter项目/android/build.gradle ，把 google() 和 jcenter() 这两行去掉。改为阿里的链接。

阿里云镜像详情：[https://maven.aliyun.com/mvn/guide](https://maven.aliyun.com/mvn/guide)

```
maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/jcenter' }
maven { url 'https://maven.aliyun.com/repository/public' }
```

> 修改后，保存

修改 Flutter SDK 包下的 flutter.gradle 文件。

同上，将google() 和 jcenter() 这两行去掉。改为阿里的链接。

## 启动项目

修改镜像源后，可以使用命令启动项目

```bash
flutter run
```

