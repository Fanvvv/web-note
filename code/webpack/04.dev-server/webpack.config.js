const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'dist.js',
    path: resolve(__dirname, 'dist')
  },
  devServer: {
    compress: true,
    port: 8010,
    open: true,
    hot: true, // 开启热更新
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js|jsx$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        presets: [
          ['@babel/preset-env'],
          ['@babel/preset-react']
        ],
        plugins: [
          ['react-refresh/babel']
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new VueLoaderPlugin(),
    new ReactRefreshWebpackPlugin()
  ]
}
