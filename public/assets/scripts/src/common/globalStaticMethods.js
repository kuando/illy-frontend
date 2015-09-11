// ==================== static method start, @included  ==================== //

    avalon.getVM = function(vm) {
        return avalon.vmodels[vm];
    };

    avalon.getPureModel = function(vm) {
        return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
    };

    avalon.$ = function(selector) {
        return document.querySelector(selector);
    };

    var index = 0;
    /**
     * illyLog
     *
     * @param type {String}
     * @param msg {String}
     * @param res {String | Object}
     * @param saveToLocalStorage {Boolean}
     *
     */
    var illyLog = function illyLog(type, msg, res, style, saveToLocalStorage) {
        var root = avalon.vmodels.root;
        var namespace = root.namespace;
        var currentVM = root.currentState;
        res = res || '';
        if (typeof res !== 'string') {
            res = JSON.stringify(res);
        }
        console.log('%c' + type.toUpperCase() + ': ' + namespace + ' ' + currentVM + ' ' + msg +  '! '+ res, style); 
        if (saveToLocalStorage) {
            localStorage.setItem(namespace + ' ' + currentVM + ' log ' + index, msg + ' ' + res);
            index++;
        }
    };

    avalon.illyError = function(msg, res) {
        illyLog('error', msg, res, global_errorLog_style, false);
    };

    avalon.illyInfo = function(msg, res) {
        illyLog('info', msg, res, global_infoLog_style, true);
    };

    /**
     * getLocalCache
     * @param itemName {String}
     * return result   {Object} (json-from-api)
    */
    var getLocalCache = function getLocalCache(itemName) {
        return localStorage.getItem && JSON.parse( '' + localStorage.getItem(itemName) );
    };

    /**
     * setLocalCache
     * @param itemName {String}
     * @param source   {String} (json-like)
    */
    var setLocalCache = function setLocalCache(itemName, source) {
        source = JSON.stringify(source);
        localStorage.setItem && localStorage.setItem( itemName, source ); /* jshint ignore:line */
    };

    /*
     * clearLocalCache
     * @param prefix {string}
     * clear the cache item includes the given prefix
    */
    var clearLocalCache = function clearLocalCache(prefix) {
        for (var key in localStorage) {
            if (key.indexOf(prefix) >= 0) {
                localStorage.removeItem(key);
            }
        }
    };

    // 挂载
    avalon.getLocalCache = getLocalCache;
    avalon.setLocalCache = setLocalCache;
    avalon.clearLocalCache = clearLocalCache;

    // ==================== static method end, @included ==================== //
