const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './src/index.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // 使用 umd 模式，具有更好的兼容性
        library: {
            name: 'myLib',
            type: 'umd',
        }
    },
    // devtool: 'source-map',
    // devtool: 'eval-source-map',
    // devtool: 'inline-source-map',
    // devtool: 'cheap-source-map',
    devtool: 'cheap-module-source-map',
    externals: {
        // 将 lodash 作为一个外部依赖，不打包到最终的 bundle 中
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_',
        },
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
