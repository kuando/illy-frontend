define(["http://res.wx.qq.com/open/js/jweixin-1.0.0.js", './lib/mmRouter/mmState', './http'], function(wx) {

    // 挂载微信sdk到avalon以供全局调用
    avalon.wx = wx;

    // splash show time config
    var splash_show_time = 6; // ms
    avalon.splashShowTime = splash_show_time;

    // global loading timeout
    var global_loading_timeout = 5; // second, abort the loading when timeout, then auto back

    // global action bar title map
    var acTitle = {
        'list': '任务列表',
        'rank': '排行榜',
        'mall': '积分商城',
        'article': '活动详情',
        'activity': '活动详情',
        'me': '个人中心'
    };

    // deal with bad network condition for wait too long, auto-back when time enough with tip
    var handleBadNetwork = function handleBadNetwork(delay) {
        delay = global_loading_timeout * 1000 || 5000;
        var loader = document.querySelector('.loader');
        var badNetworkTimer = setTimeout(function() {
            alert('对不起，您的网络状态暂时不佳，请稍后重试！');
            // even can invoke the wx-sdk to close the page
            history.go(-1);
            // for strong, need ()
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        }, delay);
        avalon.badNetworkTimer = badNetworkTimer;
    };

    //================= main to bootstrap the app =======================//

    /* global-set start */
    
    // global view change animation, animation.css
    var g_viewload_animation = "a-bounceinR"; 

    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global apiBaseUrl
    var apiBaseUrl = 'http://api.hizuoye.com/api/v1/';

    // avalon global cache stuff when app init
    avalon.illyGlobal = {
        viewani    : g_viewload_animation,
        token      : token,
        apiBaseUrl : apiBaseUrl
    };

    // avalon global static method, get vm-object with vm-name
    avalon.getVM = function(vm) {
        return avalon.vmodels[vm];
    };

    // avalon global static method, get pure $model for server
    avalon.getPureModel = function(vm) {
        return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
    };

    // avalon global static method, get element
    avalon.$ = function(selector) {
        return document.querySelector(selector);
    };

    /**
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

    /**
     * setLocalCache
     * @param itemName {String}
     * @param source   {String} (json-like)
    */
    var setLocalCache = function setLocalCache(itemName, source) {
        source = JSON.stringify(source);
        localStorage.setItem && localStorage.setItem( itemName, source ); /* jshint ignore:line */
    };

    /**
     * getLocalCache
     * @param itemName {String}
     * return result   {Object} (json-from-api)
    */
    var getLocalCache = function getLocalCache(itemName) {
        return localStorage.getItem && JSON.parse( '' + localStorage.getItem(itemName) );
    };

    // 挂载
    avalon.clearLocalCache = clearLocalCache;
    avalon.setLocalCache = setLocalCache;
    avalon.getLocalCache = getLocalCache;

    /* global-set end */

    /* wxsdk start */

    var uri = location.href.split("#")[0];
    var url = encodeURIComponent(uri);

    $http.ajax({
        method: "",
        url: 'http://api.hizuoye.com/api/v1/public/sdk/signature',
        data: {
            url: url
        },
        success: function(jsonobj) {
            var appId = jsonobj.appid;
            var timestamp = jsonobj.timestamp;
            var nonceStr = jsonobj.nonceStr;
            var signature = jsonobj.signature;
            // config the wx-sdk
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        },
        error: function(res) {
            console.log("wx ajax error" + res);
        },
        ajaxFail: function(res) {
            console.log("wx ajaxFail" + res);
        }
    });

    //wx.ready(function() {
    //    // do all thing here, except user trigger functions(can put in outside)
    //    wx.checkJsApi({
    //        jsApiList: ['startRecord'], // apis to check
    //            success: function(res) {
    //                alert(parse(res));
    //                // key --- value, if usable, true, then false
    //                // e.g. {"checkResult": {"chooseImage": true}, "errMsg": "checkJsApi:ok"}
    //            }
    //    });
    //});

    wx.error(function(res) {
        alert("Woops, error comes when WeChat-sdk signature..." + res);
    });

    /* wxsdk end */

    /* router start */

    // 定义一个顶层的vmodel，用来放置全局共享数据
    var root = avalon.define({
        $id: "root",
        currentPage: "", // spec-stateName
        currentIsVisited: false, // useful for most child view
        title: "", // 每一页action bar的标题   
        footerInfo: 'kuando Inc', // first in get the info, rendered in page footer
        back: function() {
            history.go(-1);
        }
    });

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("task", { // task.js这个控制器接管整个应用控制权
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上, 会立即绘制index这个view
        views: {
            "splash@": {
                templateUrl: "assets/template/task/splash.html", // 指定模板地址
            },
            "loading@": {
                templateUrl: "assets/template/loading.html", // 指定模板地址
            },
            //"header@": {
                //templateUrl: "assets/template/task/header.html", // 指定模板地址
            //},
            "": {
                templateUrl: "assets/template/task/task.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/task.js", // 指定控制器地址
            },
            "footer@": { // 视图名字的语法请仔细查阅文档
                templateUrl: "assets/template/footer.html", // 指定模板地址
            }
        }
    })
    .state("task.list", { // 任务列表
        url: "",
        views: {
            "": {
                templateUrl: "assets/template/task/list.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/list.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail", { // 
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/template/task/detail.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/detail.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail.article", { // task, typeof article 
        url: "article/{taskId}/score/{scoreAward}", // 
        views: {
            "": {
                templateUrl: "assets/template/task/article.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/article.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail.activity", { // task, typeof activity 
        url: "activity/{taskId}/score/{scoreAward}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/template/task/activity.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/activity.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail.staticActivity", { // static version of activity for outer user
        url: "staticActivity/{taskId}",
        views: {
            "": {
                templateUrl: "assets/template/task/static-activity.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/static-activity.js" // 指定控制器地址
            }
        }
    })
    .state("task.rank", { // 排行榜
        url: "rank",
        views: {
            "": {
                templateUrl: "assets/template/task/rank.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/rank.js" // 指定控制器地址
            }
        }
    })
    .state("task.mall", { // 积分商城
        url: "mall",
        views: {
            "": {
                templateUrl: "assets/template/task/mall.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/mall.js" // 指定控制器地r
            }
        }
    })
    .state("task.me", { // 积分商城
        url: "me",
        views: {
            "": {
                templateUrl: "assets/template/task/me.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/me.js" // 指定控制器地址
            }
        }
    });

    /*
     *  @interface avalon.state.config 全局配置
     *  @param {Object} config 配置对象
     *  @param {Function} config.onBeforeUnload 开始切前的回调，this指向router对象，第一个参数是fromState，第二个参数是toState，return false可以用来阻止切换进行
     *  @param {Function} config.onAbort onBeforeUnload return false之后，触发的回调，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onUnload url切换时候触发，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onBegin  开始切换的回调，this指向mmState对象，参数同onBeforeUnload，如果配置了onBegin，则忽略begin
     *  @param {Function} config.onLoad 切换完成并成功，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onViewEnter 视图插入动画函数，有一个默认效果
     *  @param {Node} config.onViewEnter.arguments[0] 新视图节点
     *  @param {Node} config.onViewEnter.arguments[1] 旧的节点
     *  @param {Function} config.onError 出错的回调，this指向对应的state，第一个参数是一个object，object.type表示出错的类型，比如view表示加载出错，object.name则对应出错的view name，object.xhr则是当使用默认模板加载器的时候的httpRequest对象，第二个参数是对应的state
    */

    // 缓存访问过得页面，为了更好的loading体验，性能嘛? 先mark一下!!!
    var cache = [];
    avalon.state.config({ // common callback, every view renderd will listenTo and do something.
        onError: function() {
            avalon.log("Error!, Redirect to index!", arguments);
            avalon.router.go("site.index"); 
        }, // 打开错误配置
        onBeforeUnload: function() {
            // avalon.log("0 onBeforeUnload" + arguments);
        },
        onUnload: function() { 
            // avalon.log("1 onUnload" + arguments);
        },
        onBegin: function() {
            // avalon.log("2 onBegin" + root.currentPage);
            // 缓存来过的页面，不再显示loader
            var pageId = location.href.split("!")[1];
            cache.push(pageId);
            var loader = document.querySelector('.loader');
            var visited = false;
            var curid = location.href.split("!")[1];
            for (var i = 0, len = cache.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
                if (cache[i] === curid) {
                    visited = true;
                }
            }
            if (loader && !visited) { // 存在loader并且为未访问过得页面则show loader, 同时处理网络状况太差的情况
                loader.style.display = '';
                handleBadNetwork();
            }
            root.currentIsVisited = visited; // 页面是否加载过，挂载在root节点上
        },
        onLoad: function() { 

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            // avalon.log("3 onLoad" + root.currentPage);
            var state = mmState.currentState.stateName.split(".");
            var state1 = state[1];
            var state2 = state[2];
            if (state2 !== void 0) { state1 = state2; }

            // set root current state
            root.currentPage = state1;
            
            // set title of action bar
            root.title = acTitle[state1];

            // next view loaded, remove loader && badNetworkHandler && add view-in animation
            var loader = document.querySelector('.loader');
            setTimeout(function() {
                // for strong, need ()
                loader && (loader.style.display = 'none'); /* jshint ignore:line */
                avalon.badNetworkTimer && clearTimeout(avalon.badNetworkTimer); /* jshint ignore:line */
            }, 200);
            var view = document.querySelector('[avalonctrl='+ root.currentPage + ']');
            // for strong
            view && view.classList.add(g_viewload_animation); /* jshint ignore:line */
        },
        onViewEnter: function(newNode, oldNode) { /* jshint ignore:line */
            //avalon(oldNode).animate({
            //    marginLeft: "-100%"
            //}, 500, "easein", function() {
            //    oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
            //})
        } // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide
    });

    /* router end */

    return {
        init: function() { // init and bootstrap site
            avalon.log("init to rendered the page");
            avalon.history.start({
                // basepath: "/mmRouter",
                fireAnchor: false
                //,routeElementJudger: function(ele, href) {
                //    avalon.log(arguments);
                //    //href = '#!/detail/aaaaa';
                //    //avalon.log(href);
                //    //return href;
                //}
            });
            //go!!!!!!!!!
            avalon.scan();
        }
    };

});

