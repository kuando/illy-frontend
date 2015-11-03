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
    
    // 页面访问统计容器
    var CACHE_VISITED_PAGEID_CONTAINER = [];

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

    root.$watch('currentAction', function(currentAction) {
        // 统计时机 
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

        if (global_rendered_time === void 0) {
            global_rendered_time = 1000;
            avalon.illyWarning('no global_rendered_time set!');
        }

        setTimeout(function() { 
            hideLoader();
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, global_rendered_time);

    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            loadingBeginHandler();
        }

        // deal with not wait ajax page, like get data from parent vm
        if ( currentAction === 'onLoad' ) {
            if (root.currentDataDone || root.currentIsVisited) {
                loadingEndHandler();
            }
        }
    });

    /** 
     * 201511031617
     * 框架并不能支持异步数据获取情况检测，也就是ajax获取数据
     * 的结果需要自己监听状态，然后为框架添加一个生命周期标记
     * 命名为currentDataDone，对于不需要的页面跳转，比如从父
     * vm获取部分数据来渲染页面也符合逻辑，并在onload就及时
     * loadingEndHandler，整体顺畅实现整个页面生命周期管理。
     *
     * 但是，对于更细致的数据比如图片究竟是否获取完成就只能
     * 加delay来勉强应对大多数情况了,在单页应用这种页面复用
     * 来说，就会出现新页面相同位置保存旧页面的图片数据，有
     * 一定的用户体验不好的地方。
     */

    // ajax data done, invoking loadingEndHandler
    root.$watch('currentDataDone', function(rendered) {
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
