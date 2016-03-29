/**
 * 离线存储方案
 * @author jackieLin <dashi_lin@163.com>
 */
(function(window, undefined) {
    "use strict";
    
    var win = (typeof window != 'undefined' ? window : global);
    var localStorageName = 'localStorage';
    var store = require('../vendor/store/src/store');
    var md5 = require('md5');
    var Request = require('./request');
    var request = new Request();

    /**
     * {
     *  'key': {
     *      sign: 'md5',
     *      path: 'path'
     *  }
     * }
     */
    var config = window.config || require('./ls.config');
    
    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }
    
    /**
     * 获取所有配置信息
     */
    var updateAll = function() {
        var keys = Object.keys(config);
        // 遍历
        keys.forEach(function(v) {
            update.apply(null, [v]);
        });
    };
    
    /**
     * 清除掉没用的存储
     * @param {excludeList} 排除列表
     */
    var destroy = function(excludeList) {
        excludeList = excludeList || [];

        if(!excludeList.length) {
            // 清除全部存储
            store.clear();
        } else {
            store.forEach(function(key, val) {
                // 删除
                if(!key in excludeList) {
                    store.remove(key);
                }
            });   
        }

        return store.getAll();
    };
    
    /**
     * 线上 md5 与线下比较
     */
    var update = function(key) { 
        var value = store.get(key);
        // localStoarge 不存在
        if(!value) {
            // 线上获取信息
            requestUrl(key, function(content) {
                // 存储到 ls 中
                if(content) {
                    store.set(key, content);
                }
            });
        } else if(!compareMd5(value, config[key].sign)){
            // 线上获取信息
            requestUrl(key, function(content) {
                // 存储到 ls 中
                if(content) {
                    store.set(key, content);
                }
            });
        } else {
            // 比较相同
            execScript(value);
        }
    };
    
    /**
     * 执行 javascript
     * @param  {String} content 内容
     */
    var execScript = function(content) {
        if(!content) {
            return false;
        }
        
        try{
            new Function(content)();
        } catch(e) {
            console.log(e);
        }
    };

    /**
     * 加载资源
     * @param {String} key
     * @param {callback} 加载完回调
     */
    var requestUrl = function(key, callback) {
        if(!key) {
            return false;
        }
        
        request.get(config[key].path, function(content) {
            if(content) {
                execScript(content);
            }

            callback(content);
        });
    };

    /**
     * 通过 md5 比较
     * @return {Boolean} 比较结果
     */
    var compareMd5 = function(value, md5Val) {
        if(!value || !md5Val) {
            return false;
        }
                
        return md5(value) === md5Val;
    };
    
    /**
     * 配置
     */
    exports.config = function(config) {
        if(!config) {
            return false;
        }

        config = config;
    };

    exports.updateAll = updateAll;
    exports.destroy = destroy;

})(window);
