/**
 * @author jackie Lin <dashi_lin@163.com>
 * webpack 主要配置
 */
'use strict';
var path = require('path');

module.exports = {
    // 上下文
    context: __dirname,
    entry: {
        // 测试
        'test': 'mocha!./test/test'
    },
    module: {
        loaders: [{
            test: /\.coffee?$/,
            exclude: /node_modules/,
            loader: 'coffee-loader'
        }]
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.coffee']
    },

    output: {
        libraryTarget: 'umd',
        path: __dirname + "/dist",
        filename: "[name].js"
    }
};
