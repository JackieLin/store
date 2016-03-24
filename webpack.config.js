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
        'store': './store'
    },
    // module: {
    //     loaders: [{
    //         test: /\.jsx?$/,
    //         exclude: /node_modules/,
    //         loader: 'babel',
    //         query: {
    //             presets: ['react', 'es2015']
    //         }
    //     }]
    // },

    resolve: {
        extensions: ['', '.js', '.json']
    },

    output: {
        libraryTarget: 'umd',
        path: __dirname + "/dist",
        filename: "[name].js"
    }
    // externals: {
    //     'mocha': 'mocha'
    // }
};
