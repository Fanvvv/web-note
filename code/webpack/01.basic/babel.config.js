module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: 'last 2 version',
      useBuiltIns: 'usage',
      corejs: 3
    }],
    ['@babel/preset-typescript']
  ],
}
