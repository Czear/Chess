const path = require('path')

module.exports = {
    mode: "development",
    entry: "./main.js",
    watch: true,
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
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
}