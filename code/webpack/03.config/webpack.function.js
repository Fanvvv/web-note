const { resolve, join } = require('path')

module.exports = function (env, argv) {
  console.log('==========================')
  console.log(env, argv)
  console.log('==========================')
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval-source-map',
    entry: './src/index.js',
    output: {
      filename: 'dist-function.js',
      path: resolve(__dirname, 'dist')
    }
  }
}

// npx webpack --env app.type=miniapp --mode=production
// module.exports = function (env, argv) {
//   return {
//     mode: argv.mode ? "production" : "development",
//     entry: './src/index.js',
//     devtool: argv.mode ? "source-map" : "eval",
//     output: {
//       filename: "[name].js",
//       path: path.join(__dirname, `./dist/${env.app.type}`)
//     }
//   }
// }
