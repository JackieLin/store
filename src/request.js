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

        this.httpRequest.onerror = function() {
            
        };
    };
    
    /**
     * url 是否跨域
     */
    Request.prototype.crossDomain = function(url) {
        if(!url) {
            return false;
        }
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
        
        this.httpRequest.open('GET', url, true);
        this.httpRequest.send(null);
    };

    return Request;

}(window, undefined));


