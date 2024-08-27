const { resolve } = require('path')

// 支持的形态
// module.exports = {
//   entry: {
//     // 字符串形态
//     home: './home.js',
//     // 数组形态
//     shared: ['react', 'react-dom', 'redux', 'react-redux'],
//     // 对象形态
//     personal: {
//       import: './personal.js',
//       filename: 'pages/personal.js',
//       dependOn: 'shared',
//       chunkLoading: 'jsonp',
//       asyncChunks: true
//     },
//     // 函数形态
//     admin: function() {
//       return './admin.js';
//     }
//   },
// };

// dependOn
// module.exports = [{
//   mode: 'development',
//   output: {
//     filename: 'entry.[name].js',
//     path: resolve(__dirname, 'dist'),
//   },
//   entry: {
//     main: "./src/index.js",
//     // foo: "./src/foo.js",
//     foo: { import: "./src/foo.js", dependOn: "main" },
//   }
// }]

// runtime
module.exports = [{
  mode: 'development',
  output: {
    filename: 'entry-runtime.[name].js',
    path: resolve(__dirname, 'dist'),
  },
  entry: {
    main: { import: "./src/index.js", runtime: "common-runtime" },
    foo: { import: "./src/foo.js", runtime: "common-runtime" },
  }
}]
