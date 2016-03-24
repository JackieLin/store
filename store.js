/**
 * 离线存储方案
 * @author jackieLin <dashi_lin@163.com>
 */
(function(window, undefined) {
    "use strict";

    var win = (typeof window != 'undefined' ? window : global);
    var localStorageName = 'localStorage';
    var store = require('./vendor/store/src/store');
    
    /**
     * {
     *  'key': {
     *      sign: 'md5',
     *      path: 'path'
     *  }
     * }
     */
    var config = require('./ls.config');
    
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
    var updateAll = function(callback) {
        var keys = Object.keys(config);
        // 遍历
        keys.forEach(function(v) {
            callback.apply(null, [v]);
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
            request(key, function() {
                // 回调
            });
        } else if(!compareMd5(value, config[key].sign)){
            // 线上获取信息
            request(key, function() {

            });
        }
    };
    
    /**
     * 加载资源
     * @param {String} key
     * @param {callback} 加载完回调
     */
    var request = function(key, callback) {
        if(!key) {
            return false;
        }
        
        var path = config[key].path;
        var script = document.createElement('script');
        script.async = true;
        script.src = path;
        script.onload = callback;
        document.head.appendChild(script);
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

    exports.updateAll = updateAll;
    exports.destroy = destroy;

})(window);
