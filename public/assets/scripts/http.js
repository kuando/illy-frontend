/*******************************************************
  > File Name: http.js
  > Author: IndexXuan
  > Mail: indexxuan@gmail.com
  > Created Time: 2015年07月10日 星期五 15时34分30秒
 ******************************************************/

(function(global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get $http.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var $http = require("$http")(window);
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("$http requires a window with a document")
            }
            return factory(w)
        }
    } else {
        factory(global)
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

    // inner function 
    function noop() {}

    // inner key method, {} === {} is not ok, so must have this method, fuck
    function isEmptyObject(obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    }

    // inner function, setHeaders from user settings.
    // as named... ,dropped in 20150718
    //{
    //    key: "val",
    //    key1: "val1"
    //}
    // == >
    // key=val&key1=val1
    function jsonToquerystring(data) {
        var querystring = "";
        var keys = Object.keys(data);
        var str = "";
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            str += keys[i] + '=' + data[key] + "&";
        }
        querystring = str.substring(0, str.length - 1);

        return querystring;
    }

    // inner function, deal with GET with data options
    function parseUrl(url, data) {
        // 统一追加data到url上（注意data是否为空，且url是否已经有querystring）
        if ( isEmptyObject(data) ) {
            //return url.replace(/\?/, ""); // plain url
            return url + "?cache=" + Math.random();
        } else {
            var hasQueryString = url.indexOf("?") >= 0 && url.indexOf("=") >= 0;
            if (hasQueryString) {
                url = url + "&" + jsonToquerystring(data);
            } else { // no querystring
                if (url.indexOf("?") < 0) {
                    url = url + "?" + jsonToquerystring(data);
                } else {
                    url = url + jsonToquerystring(data);
                }
            }
        }
        // default no-cache
        return url.indexOf("?") < 0 ? url + "?cache=" + Math.random() : url + "&cache=" + Math.random(); // at least return a url
    }

    // can extend to deal with old ie
    function parseJSON(str) {
        return JSON.parse(str + ""); // more safe
    }

    // set headers
    function setHeaders(xhr, headers) {
        // set others, if exists.
        if ( !isEmptyObject(headers) ) {
            var keys = Object.keys(headers);
            for (var x = 0, len = keys.length; x < len; x++) {
                var key = keys[x];
                var val = headers[key]; // vars must in '[]' expression... fuck
                xhr.setRequestHeader(keys[x], val); // key -- val
            }
        }
    }

    // inner function to getXHR, can extend to deal with old ie
    var getXHR = function getXHR() {
        var xhr = new XMLHttpRequest(); 
        return xhr;
    }

    // ajax main function
    var request = function request(method, url, data, beforeSend, headers, success, error, ajaxFail) {

        // deal with user settings
        var xhr = getXHR();
        method = method.toUpperCase();
        data = data || {};
        beforeSend = beforeSend || noop;
        headers = headers || {};
        success = success || noop;
        error = error || noop;
        ajaxFail = ajaxFail || noop;
        xhr.open(method, method === 'GET' ? parseUrl(url, data)  : url, true); // mark!!!!!!
        xhr.onreadystatechange = function() {
            //console.log(xhr);
            //此函数执行多次，即状态多变就多次进入
            //if (xhr.readyState === 4 && xhr.status === 200) {
            //    success(parseJSON(xhr.responseText));
            //}
            if (xhr.readyState == 4) {
                if (xhr.status === 200) {
                    success(parseJSON(xhr.responseText));
                } else {
                    error(parseJSON(xhr.responseText));
                }
            }
        }
        beforeSend(xhr); // useful when use
        //xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.setRequestHeader('Content-Type', "application/json"); // update in 20150718
        setHeaders(xhr, headers);
        //xhr.send(method !== "GET" ? jsonToquerystring(data) : null);
        xhr.send(method !== "GET" ? JSON.stringify(data) : null); // update in 20150718
        xhr.onerror = function() {
            ajaxFail(xhr.response);
        }

    }

    // export object
    var $http = { // dataType must be json
        'get': function(settings) {
            request('GET', settings.url, settings.data, settings.beforeSend, settings.headers, settings.success, settings.error, settings.ajaxFail);
        },
        'post': function(settings) {
            request('POST', settings.url, settings.data, settings.beforeSend, settings.headers, settings.success, settings.error, settings.ajaxFail);
        },
        'ajax': function(settings) {
            request(settings.method || "GET", settings.url, settings.data, settings.beforeSend, settings.headers, settings.success, settings.error, settings.ajaxFail);
        }
    }

    // Register as a named AMD module, since $http can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase $http is used because AMD module names are
    // derived from file names, and $http is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of $http, it will work.

    // Note that for maximum portability, libraries that are not $http should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. $http is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    if (typeof define === "function" && define.amd) {
        define("$http", [], function() {
            return $http;
        })
    }
    // Map over $http in case of overwrite
    var _http = window.$http;
    $http.noConflict = function(deep) {
        if (deep && window.$http === $http) {
            window.$http = _http;
        }
        return $http;
    }
    // Expose $http identifiers, even in AMD
    // and CommonJS for browser emulators
    if (noGlobal === void 0) {
        window.$http = $http;
    }
    //console.table($http);
    return $http;

}))

// usage, arguments must be full
//$http.ajax({
//    method: "", // default GET
//    url: "http://api.example.com/api/v1/categories/1",
//    data: {

//    },
//    beforeSend: function(xhr) {
//    
//    },
//    headers: { // default Authorization Bearer 

//    },
//    cache: true, // if type get, default do it 
//    dataType: "json", // the only type for now
//    success: function(res) {
//        console.log(res);
//    },
//    error: function(res) {
//        console.error(res);
//    },
//    ajaxFail: function(res) {
//        console.error(res);
//    }
//})

