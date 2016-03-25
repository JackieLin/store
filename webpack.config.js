/**
 * @author jackie Lin <dashi_lin@163.com>
 * webpack 主要配置
 */
'use strict';
var path = require('path');

var argv = process.argv;
var isPack = false;

// 正式环境
if(argv.indexOf('-p') !== -1 || argv.indexOf('--pack') !== -1) {
    isPack = true;
}

module.exports = {
    // 上下文
    context: __dirname,
    entry: {
        'store': './src/store'
    },

    output: {
        libraryTarget: 'umd',
        path: __dirname + "/dist",
        filename: isPack ? "[name].min.js" : "[name].js"
    },

    module: {
        loaders: [{
            test: /.*\/src\/.*\.js$/,
            exclude: /node_modules/,
            loader: 'uglify'
        }]
    },
    
    'uglify-loader': {
        mangle: false
    },

    resolve: {
        extensions: ['', '.js']
    }
    // externals: {
    //     'mocha': 'mocha'
    // }
};
