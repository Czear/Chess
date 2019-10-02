const path = require('path')
dashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    mode: "development",
    entry: "./main.ts",
    watch: true,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: '/dist/',
    },
    devServer: {
        publicPath: '/dist/',
        watchContentBase: true,
        compress: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.svg$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [new dashboardPlugin()],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@Assets': path.resolve(__dirname, 'Assets/'),
            '@Scripts': path.resolve(__dirname, 'Scripts/')
        }
      }
}