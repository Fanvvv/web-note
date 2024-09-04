const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()

const config = require('../webpack.config.js')
const compiler = webpack(config)

// 使用 webpack-dev-middleware 中间件
app.use(webpackDevMiddleware(compiler, {}))

app.listen(8010, () => {
  console.log('server is running on http://localhost:8010')
})
