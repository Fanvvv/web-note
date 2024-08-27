const baseConfig = require("./webpack.common")
const { merge } = require("webpack-merge")

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3002,
    hot: true,
  }
})
