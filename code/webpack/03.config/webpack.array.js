const { merge } = require('webpack-merge')
const { resolve } = require('path')


// module.exports = [{
//   mode: 'production',
//   output: {
//     filename: 'dist-array-amd.js',
//     path: resolve(__dirname, 'dist'),
//     libraryTarget: 'amd',
//   },
//   name: 'amd',
//   entry: './src/index.js',
// }, {
//   mode: 'production',
//   output: {
//     filename: 'dist-array-umd.js',
//     path: resolve(__dirname, 'dist'),
//     libraryTarget: 'umd',
//   },
//   name: 'umd',
//   entry: './src/index.js',
// }]


const baseConfig = {
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
  },
  entry: './src/index.js',
}

module.exports = [
  merge(baseConfig, {
    output: {
      filename: 'merge-array-umd.js',
      libraryTarget: 'umd',
    },
    name: 'umd',
  }),
  merge(baseConfig, {
    output: {
      filename: 'merge-array-amd.js',
      libraryTarget: 'amd',
    },
    name: 'amd',
  })
]
