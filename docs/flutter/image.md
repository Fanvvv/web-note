# 图片

## 属性

```dart
const Image({
  ...
  this.width, // 图片的宽
  this.height, // 图片高度
  this.color, // 图片的混合色值
  this.colorBlendMode, // 混合模式
  this.fit, // 缩放模式
  this.alignment = Alignment.center, // 对齐方式
  this.repeat = ImageRepeat.noRepeat, // 重复方式
  ...
})
```

colorBlendMode 和 color 属性配合使用，能让图片改变颜色。 fit 属性可以控制图片的拉伸和压缩，常用属性如下：

- BoxFit.fill: 全图显示，图片会被拉伸，并充满父容器。 
- BoxFit.contain: 全图显示，显示原比例，可能会有空隙。 
- BoxFit.cover：显示可能拉伸，可能裁切，充满（图片要充满整个容器，还不变形）。 
- BoxFit.fitWidth：宽度充满（横向充满），显示可能拉伸，可能裁切。 
- BoxFit.fitHeight ：高度充满（竖向充满）,显示可能拉伸，可能裁切。 
- BoxFit.scaleDown：效果和 contain 差不多，但是此属性不允许显示超过源图片大小，可小不可大。 

repeat 平铺 

- ImageRepeat.repeat : 横向和纵向都进行重复，直到铺满整个画布。 
- ImageRepeat.repeatX: 横向重复，纵向不重复。 
- ImageRepeat.repeatY：纵向重复，横向不重复。

## Image.asset

加载资源图片

1. 在工程根目录下创建一个 images目录 ，并将图片avatar.png拷贝到该目录。
2. 在 pubspec.yaml 中的 flutter 部分添加如下内容：

```yaml
assets:
	- images/avatar.png
```

> 注意：由于 yaml 文件对缩进严格，所以必须严格按照每一层两个空格的方式进行缩进，此处 assets前面应有两个空格。

3. 加载该图片

```dart
Image(
  image: AssetImage("images/avatar.png"),
  width: 100.0
);
```

Image也提供了一个快捷的构造函数 Image.asset 用于从asset中加载、显示图片：

```dart
Image.asset("images/avatar.png",
	width: 100.0,
)
```

## Image.network

访问网络图片时，需要给应用赋予访问网络的权限。具体来说：

> 如果不设置，会收到如下报错 
>
> 报错: Insecure HTTP is not allowed by platform 
>
> 原因：平台不支持不安全的 HTTP 协议，即不允许访问 HTTP 域名的地址。

- Android 解决

打开 android/app/src/main/AndroidManifest.xml

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

网络资源图片

```dart
Image(
  image: NetworkImage("https://dummyimage.com/300X300/DDFFBB"),
  width: 100.0,
)
```

Image 也提供了一个快捷的命名构造函数 Image.network 用于从网络加载、显示图片：

```dart
Image.network(
  "https://dummyimage.com/300X300/DDFFBB",
  width: 100.0,
)
```

