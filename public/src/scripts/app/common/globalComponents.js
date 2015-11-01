// ==================== app components area start @include ==================== // 

    /**
     *  components: order is important
     *
     *  getCurrentState(base)
     *  doIsVisitedCheck(base)
     *
     *  loading
     *  resetScrollbar
     *  badNetworkHandler
     *  setTitle
     *
     */

    // getCurrentState component start //
    
    var getCurrentState = function getCurrentState() {
        var state1 = mmState.currentState.stateName.split(".")[1]; // 第二个
        var state2 = mmState.currentState.stateName.split(".")[2]; // 第三个
        if (state2 === void 0) {
            return state1;
        } else {
            return state2;
        }
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onLoad') {
            root.currentState = getCurrentState();
        }
    });

    // getCurrentState component end //
    
    // visitedChecker component start //
    
    var doIsVisitedCheck = function doIsVisitedCheck(cacheContainer, callback) {

        if (typeof cacheContainer === 'function') {
            callback = cacheContainer;
            cacheContainer = void 0;
        }

        var pageId = location.href.split("!")[1];
        cacheContainer = cacheContainer || CACHE_VISITED_PAGEID_CONTAINER;
        cacheContainer.push(pageId);
        var isVisited = false;
        for (var i = 0, len = cacheContainer.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
            if (cacheContainer[i] === pageId) {
                isVisited = true;
                break;
            }
        }
        if (callback && typeof callback === 'function') {
            callback();
        }

        return isVisited;

    };

    // 页面访问统计容器
    var CACHE_VISITED_PAGEID_CONTAINER = [];
    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            root.currentIsVisited = doIsVisitedCheck();
        }
    });

    // visitedChecker component end //
     
    // loading component start //

    var loadingBeginHandler = function loadingBeginHandler(loader, callback) {

        if (typeof loader === 'function') { // deal with only one arguments and is callback
            callback = loader;
            loader = void 0;
        }

        loader = global_loader_dom || document.querySelector(global_loader_className);

        var showLoader = function() {
            loader && (loader.style.display = ''); /* jshint ignore:line */
        };

        // loader show logic
        var always_show_loader = global_always_show_loader === true ? true : false;
        if (always_show_loader) {
            showLoader();
        } 
        if (!always_show_loader && !root.currentIsVisited) {
            showLoader();
        }

        if (callback && typeof callback === 'function') {
            callback();
        }

    };

    var loadingEndHandler = function loadingEndHandler(loader, callback) {

        if (typeof loader === 'function') { // deal with only one arguments and is callback
            callback = loader;
            loader = void 0;
        }

        loader = global_loader_dom || document.querySelector(global_loader_className);

        var hideLoader = function() {
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        };

        //var done = false; // 互斥标记,callback仅执行一次
        //setTimeout(function() {
        //    if (!done) {
        //        hideLoader();
        //        if (callback && typeof callback === 'function') {
        //            callback();
        //        }
        //        done = true;
        //    }
        //}, 128); // wait js to exec and rendered the page

        if (global_loading_delay === void 0) {
            global_loading_delay = 1000;
            avalon.illyWarning('no global_loading_delay set!');
        }

        setTimeout(function() { // for strong
            //if (!done) {
                hideLoader();
                if (callback && typeof callback === 'function') {
                    callback();
                }
                //avalon.illyWarning('time not enough to rendered page!');
                //alert('网络情况貌似不佳，请退出重试！');
                //done = true;
            //}
        }, global_loading_delay);

    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            loadingBeginHandler();
        }
        if ( currentAction === 'onLoad' ) {
            if (root.currentRendered || root.currentIsVisited) {
                loadingEndHandler();
            }
        }
    });

    /** 
     *  201511011800
     *  微网站由于太多请求，每篇文章就是一个，所以为了更好的体验
     *  需要精准控制页面loading end 时机，于是手写了大量的状态代码
     *  在ajax success回调里，这样不管在高低网速下都能精确loading end
     *  但是坏处就是手写以及太多地方更改了root里的总状态量，造成隐患，
     *  是项目的一个实验特性，效果很好。
     *
     *  对于其他模块，一般一次大的请求以后就是用数据了，或者有其他ui方面
     *  的保护(比如task模块的文章内页，进去是个遮罩，就隐藏了不好的体验)
     *  不需要这么精细，只需要给个大概的时间来渲染页面即可，可在全局配置
     *  global_loading_delay变量来指定页面渲染时间。
     *
     *  而且在网速快的情况下就更可以给个大概量即可。
     *
     *  最好的解决方案应该是ajax底层模块success回调来自动做状态变更？
     *
     */

    root.$watch('currentRendered', function(rendered) {
        if (rendered === true) {
            loadingEndHandler();
        }
    });

    // loading component end // 
     
    // resetScrollbar component start //
    
    var resetScrollbarWhenViewLoaded = function resetScrollbarWhenViewLoaded() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    if (global_always_reset_scrollbar === true) {
        root.$watch('currentAction', function(currentAction) {
            if (currentAction === 'onLoad') {
                resetScrollbarWhenViewLoaded();
            }
        });
    }
    // resetScrollbar component end // 
     
    // badNetworkHandler component start // 
    
    // deal with bad network condition for wait too long, auto-back when time enough with tip
    var bindBadNetworkHandler = function bindBadNetworkHandler(timeout) {

        // remove old handler first
        badNetworkTimer && (clearTimeout(badNetworkTimer)); / * jshint ignore:line */

        timeout = global_loading_timeout;
        var loader = global_loader_dom || document.querySelector(global_loader_className);

        var badNetworkTimer = setTimeout(function() {
            alert('对不起，您的网络状态暂时不佳，请稍后重试！');
            // even can invoke the wx-sdk to close the page
            history.go(-1);
            // for strong, need ()
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        }, timeout);

        avalon.badNetworkTimer = badNetworkTimer;

    };

    var unbindBadNetworkHandler = function unbindBadNetworkHandler(timer) {
        timer = timer || avalon.badNetworkTimer;
        timer && clearTimeout(timer); /* jshint ignore:line */
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            bindBadNetworkHandler();
        }
        if (currentAction === 'onLoad') {
            unbindBadNetworkHandler();
        }
    });

    // badNetworkHandler component end //
    
    // setTitle component start //
    
    var setPageTitle = function setPageTitle(titleMap) {
        titleMap = titleMap || ACTIONBAR_TITLE_MAP;
        var currentState = root.currentState;
        root.title = titleMap[currentState];
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onLoad') {
            setPageTitle();
        }
    });

    // setTitle component end // 

    // ==================== app components area end @include ==================== //
