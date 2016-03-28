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
        this.httpRequest.onerror = function() {
            self.getScript(self._url);
        };

        this.httpRequest.onreadystatechange = (function(context) {
            return function() {
                if(context.httpRequest.readyState === 4) {
                    if(context.httpRequest.status === 200) {
                        // success
                        context._success.apply(context, [context.httpRequest.responseText]);
                    } else {
                        // retry
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
        script.src = url;
        document.head.appendChild(script);
        this._success.apply(this, []);
    };


    /**
     * url 是否跨域
     * @see https://github.com/jquery/jquery/blob/93a8fa6bfc1c8a469e188630b61e736dfb69e128/src/ajax.js#L535
     */
    Request.prototype.isCrossDomain = function(url) {
        crossDomain = null;

        if(!url) {
            return false;
        }

        var urlAnchor = document.createElement( "a" );

        try {
            urlAnchor.href = url;

            // Support: IE8-11+
            // Anchor's host property isn't correctly set when s.url is relative
            urlAnchor.href = urlAnchor.href;
        } catch ( e ) {

            // If there is an error parsing the URL, assume it is crossDomain,
            // it can be rejected by the transport if it is invalid
            crossDomain = true;
        }

        return crossDomain;
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
        this.httpRequest.open('GET', url, true);
        this.httpRequest.send(null);
    };

    return Request;

}(window, undefined));


