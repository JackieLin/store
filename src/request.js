/**
 * 简单的 ajax 获取信息
 * @author jackieLin <dashi_lin@163.com>
 */
module.exports = (function(window){
    window = window || global;
    
    /**
     * 主类
     */
    var Request = function() {
        this.httpRequest = null;
        this._success = function(){};
        this._url = '';
        // 重试次数
        this._retry = 3;
        // 当前操作，get 还是 post
        this._operate = null;
        
        // 初始化
        if(window.XMLHttpRequest) {
            // Mozilla, Safari, IE7+ ...
            this.httpRequest = new XMLHttpRequest();
        } else if(window.ActiveXObject) {
            // IE 6 and older
            this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        this.watch();
    };
    
    /**
     * 监听事件
     */
    Request.prototype.watch = function() {
        var self = this;
    
        this.httpRequest.onreadystatechange = (function(context) {
            return function() {
                if(context.httpRequest.readyState === 4) {
                    if(context.httpRequest.status === 200) {
                        // success
                        context._success.apply(context, [context.httpRequest.responseText]);
                    } else {
                        // retry
                        if(context._retry > 0) {
                            context._retry--;
                            context._operate.apply(context, [context._url]);
                        } else {
                            context._retry = 3;
                            // 采用 script 方式获取数据
                            context.getScript(self._url);
                        }
                    }
                }
            };
        })(this);
    };

    /**
     * script 标签写入
     */
    Request.prototype.getScript = function(url) {
        var script = document.createElement('script');
        var self = this;
        script.src = url;
        document.head.appendChild(script);
        script.onload = function() {
            self._success.apply(self, []);
        };
    };


    Request.prototype.setRequestHeader = function() {
        if(!this.httpRequest) {
            return false;
        }

        this.httpRequest.setRequestHeader.apply(this, arguments);
    };
    
    /**
     * 获取内容
     * @param {string} url 连接内容
     */
    Request.prototype.get = function(url, callback) {
        if(callback) {
            this._success = callback;
        }
        
        this._url = url;
        this._operate = this.get;

        this.httpRequest.open('GET', url, true);
        this.httpRequest.send(null);
    };

    return Request;

}(window, undefined));


