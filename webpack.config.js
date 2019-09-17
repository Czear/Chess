const path = require('path')

module.exports = {
    mode: "development",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "webpack-output"),
        filename: "bundle.js",
        publicPath: '/webpack-output/',
    },
    devServer: {
        publicPath: '/webpack-output/',
        watchContentBase: true,    
        compress: true,
    },
    watch: true,
}