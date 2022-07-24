# 文本

## Text

```dart
Text(
    'Hello',
    textDirection: TextDirection.ltr, 
    style: TextStyle(
        fontSize: 40.0, color: Colors.yellow,
        fontWeight: FontWeight.bold
    ),
    textAlign: TextAlign.left, maxLines: 3,
    overflow: TextOverflow.ellipsis,
),
```

- TextDirection 
  - TextDirection.ltr： 从左向右的文本 
  - TextDirection.rtl： 从右向左的文本 
- TextStyle 
  - color： 字体颜色  
  - fontSize： 字体大小  
  - fontWeight： 字体粗细  
  - fontStyle： normal 或者 italic
  - fontFamily： 字体  
  - letterSpacing： 字母间隙  
  - wordSpacing： 单词间隙

| **属性**                            | **说明**                                                     |
| :---------------------------------- | ------------------------------------------------------------ |
| Color color                         | 文本颜色。如果指定了foreground，则此值必须为 null。          |
| TextDecoration decoration           | 绘制文本装饰:下划线（TextDecoration.underline）上划线  （TextDecoration.overline）删除线  （TextDecoration.lineThrough）无（TextDecoration.none） |
| Color  decorationColor              | 绘制文本装饰的颜色。                                         |
| TextDecorationStyle decorationStyle | 绘制文本装饰的样式:画一条虚线 TextDecorationStyle.dashed画一条虚线 TextDecorationStyle.dotted画两条线  TextDecorationStyle.double画一条实线  TextDecorationStyle.solid画一条正弦线(波浪线)  TextDecorationStyle.wavy |
| FontWeight fontWeight               | 绘制文本时使用的字体粗细:FontWeight.bold 常用的字体重量比正常重。即w700FontWeight.normal 默认字体粗细。即w400FontWeight.w100  薄，最薄FontWeight.w200 特轻FontWeight.w300 轻FontWeight.w400  正常/普通/平原FontWeight.w500 较粗FontWeight.w600 半粗体FontWeight.w700 加粗FontWeight.w800 特粗FontWeight.w900  最粗 |
| FontStyle fontStyle                 | 字体变体：FontStyle.italic 使用斜体FontStyle.normal 使用直立 |
| TextBaseline textBaseline           | 对齐文本的水平线:TextBaseline.alphabetic：文本基线是标准的字  母基线TextBaseline.ideographic：文字基线是表意字基线；如果字符本身超出了alphabetic 基线，那么ideograhpic基线位置在字符本身的底部。 |
| String fontFamily                   | 使用的字体名称                                               |
| double fontSize                     | 字体大小(pt、sp)，默认为14个逻辑像素(14pt、14sp)             |
| double  letterSpacing               | 水平字母之间的空间间隔（逻辑像素为单位）。可以使用负值来让字母更接近。 |
| double wordSpacing                  | 单词之间添加的空间间隔（逻辑像素为单位）。可以使用负值来使单词更接近。 |
| double height                       | 文本行与行的高度，作为字体大小的倍数（取值1~2，如1.2）       |
| Locale locale                       | 此属性很少设置，用于选择区域特定字形的语言环境               |
| Paint background                    | 文本背景色                                                   |
| Paint foreground                    | 文本的前景色，不能与color共同设置                            |

- TextAlign 
  - center： 文本居中 
  - left： 左对齐 
  - right： 右对齐 
  - start： 开始处对齐，类似于左对齐。 
  - end： 结尾处对齐
- maxLines 设置最多显示的行数 
  - overflow clip： 直接切断，剩下的文字就没有了。 
  - ellipsis： 在后边显示省略号。 
  - fade： 溢出的部分会进行一个渐变消失的效果，当然是上下的渐变，不是左右的。

## RichText 和 TextSpan 

RichText 和 TextSpan 可以为一段文本指定多个样式。

```dart
RichText(
    text: TextSpan(
        text: '你好',
        style: TextStyle(
        	color: Colors.red
        ),
        children: [
            TextSpan(
                text: '世界',
                style: TextStyle(
                    color: Colors.blue
                )
            )
        ]
    ),
)
```

## 自定义字体

- 导入字体文件 

字体文件可以网上找到，例如：[https://fonts.google.com/](https://fonts.google.com/) 

选择需要的字体文件，然后下载

下载解压后，放入项目中的 fonts 文件夹中

- 在 pubspec.yaml 中声明字体

```yaml
flutter:
  # ......
  fonts:
    # family 属性决定了字体的名称，你将会在 TextStyle 的 fontFamily 属性中用到。
    - family: SourceSansPro
      fonts:
        - asset: fonts/Source_Sans_Pro/SourceSansPro-Black.ttf
        - asset: fonts/Source_Sans_Pro/SourceSansPro-BlackItalic.ttf
          # weight 属性指定了文件中字体轮廓的字重为 100 的整数倍
          weight: 400
          # style 属性指定文件中字体的轮廓是否为 italic 或 normal
          style: normal
```

- 设置默认字体

```dart
MaterialApp(
  title: 'Custom Fonts',
  // 设置整个应用的默认字体
  theme: ThemeData(fontFamily: 'SourceSansPro'),
  home: MyHomePage(),
);
```

- 在 Widget 中使用字体

```dart
Text(
  'Roboto Mono sample',
  style: TextStyle(fontFamily: 'SourceSansPro'), // 为具体的组件设置字体
);
```

## Icon

Icon 用来声明图标，Icons 是Flutter 中的图标组件

```dart
Icon(
  Icons.ac_unit_rounded,
  color: Colors.green,
  size: 40,
)
```

在线预览：[https://material.io/resources/icons](https://material.io/resources/icons)

## Color

- Color（自定义颜色） 
  - Flutter 中通过 ARGB 来声明颜色 
  - const Color(0xFF42A5F5); // 16进制的ARGB = 透明度 + 六位十六进制颜色 
  - const Color.fromARGB(0xFF, 0x42, 0xA5, 0xF5); 
  - const Color.fromARGB(255, 66, 165, 245); 
  - const Color.fromRGBO(66, 165, 245, 1.0); // O = Opacity 
- Colors（英文字母声明的颜色）
  - Colors.red