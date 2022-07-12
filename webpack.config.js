const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    externalsType: 'script',
    externals: {
        ya: [
            'https://api-maps.yandex.ru/2.1/?lang=en_US',
            'ymaps',
        ]
    },
    mode: 'production',
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist'),
        clean: true,
    },
    devServer: {
        index: 'index.html',
        overlay: true,
        contentBase: path.join(__dirname, "dist"),
        port: 8080,
        hot: true,
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'Final project #1 Yandex maps API',
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        })
    ],
    watch: true,
};

