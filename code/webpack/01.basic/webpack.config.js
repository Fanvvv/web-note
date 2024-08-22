const { resolve } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = () => ({
  mode: 'none',
  entry: {
    main: './src/index.js',
    component: './src/component.js'
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, './dist'),
    // assetModuleFilename: 'images/[name].[ext]',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 添加 autoprefixer 插件
                // plugins: [require("autoprefixer")],
              },
            },
          }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          // 根据运行环境判断使用那个 loader
          (process.env.NODE_ENV === 'development' ?
            'style-loader' :
            MiniCssExtractPlugin.loader),
          'css-loader',
          'less-loader'
        ]
      },
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'images'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
        // use: 'ts-loader'
      },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'], // 可以省略后缀 ./a.ts -> ./a
  }
})
