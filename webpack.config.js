const path = require('path')

module.exports = {
    mode: "development",
    entry: "./main.ts",
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
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: [ 'babel-loader', 'ts-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
          '@Scripts': path.resolve(__dirname, 'Scripts/')
        }
      }
}