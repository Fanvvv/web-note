const { resolve } = require('path')
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
    path: resolve(__dirname, './dist')
  },
  module: {
    rules: [{
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
    }, {
      test: /\.less$/i,
      use: [
        // 根据运行环境判断使用那个 loader
        (process.env.NODE_ENV === 'development' ?
          'style-loader' :
          MiniCssExtractPlugin.loader),
        'css-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin()
  ]
})
