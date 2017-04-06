/**
 * Created by wangtieshou on 2017/4/6.
 */

var webpack = require('webpack');
var path    = require("path");

var config = {
    context  : __dirname + '/src',
    entry    : {
        editor: [
            './editor.js',
        ]
    },
    output   : {
        publicPath: '/dist',
        path      : path.join(__dirname, '/dist'),
        filename  : '[name].js'
    },
    devServer: {
        hot : true,
        port: 7777
    },

    module : {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
            {
                test: /\.scss$/,
                use : [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
    plugins: []

};

module.exports = config;