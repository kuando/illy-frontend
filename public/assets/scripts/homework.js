define(["http://res.wx.qq.com/open/js/jweixin-1.0.0.js", "./lib/mmRouter/mmState", "./http"], function(wx) { // 此处wx对象必须手动导入内部，不同于其他模式工厂return的对象，内部直接可用。且导入时位置还必须在第一个。fuck...
    
    // screen splash show time config
    avalon.splashShowTime = 666; // ms, used in app.js

    // 挂载微信sdk到avalon以供全局调用
    avalon.wx = wx;
        
    // global loading timeout
    var global_loading_timeout = 5; // second, abort the loading when timeout, then auto back

    // title Map， 映射各种状态的action bar title
    var acTitle = {
        'list': "作业列表",
        'detail': '作业详情',
        'question': '题目详情',
        'result': '作业结果',
        'mistake': '错题列表',
        'wrong': '错题详情',
        'evaluation': '课堂表现'
    }

    // deal with bad network condition for wait too long, auto-back when time enough with tip
    var handleBadNetwork = function handleBadNetwork(delay) {
        var delay = global_loading_timeout * 1000 || 5000;
        var loader = document.querySelector('.loader');
        var badNetworkTimer = setTimeout(function() {
            alert('对不起，您的网络状态暂时不佳，请稍后重试！');
            // even can invoke the wx-sdk to close the page
            history.go(-1);
            loader && (loader.style.display = 'none'); // for strong, need ()
        }, delay);
        avalon.badNetworkTimer = badNetworkTimer;
    }

    //================= bootstrap the app =======================//

    /* global set start */
    
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

        apiBaseUrl : apiBaseUrl,

        question_view_ani: 'a-bounceinL'

    }

    // avalon global static method, get vm-object with vm-name
    avalon.getVM = function(vm) {
        return avalon.vmodels[vm];
    }

    // avalon global static method, get pure $model for server
    avalon.getPureModel = function(vm) {
        return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
    }

    // avalon global static method, get element
    avalon.$ = function(selector) {
        return document.querySelector(selector);
    }

    /* global set end */

    /* wxsdk start */

    var uri = location.href.split("#")[0];
    var url = encodeURIComponent(uri);

    $http.ajax({
        url: 'http://api.hizuoye.com/api/v1/public/sdk/signature',
        data: {
            url: url
        },
        beforeSend: function(xhr) {

        },
        headers: {
            'Authorization': 'Bearer ' + token
        },
        dataType: "json",
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
            })
        },
        error: function(res) {
            console.log("wx ajax error" + res);
        },
        ajaxFail: function(res) {
            console.log("wx ajaxFial" + res);
        }
    })

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
        alert("Woops, error comes..." + res);
    });

    /* wxsdk end */

    /* router start */

    // 定义一个顶层的vmodel，用来放置全局共享数据, 挂载在body元素上
    var root = avalon.define({
        $id: "root",
        currentPage: '',
        currentIsVisited: false,
        title: "标题", // 每一页action bar的标题    
        back: function() {
            history.go(-1);
        }
    });

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("app", { // app.js这个控制器接管整个应用控制权
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上, 会立即绘制list这个view
        views: {
            "splash@": {
                templateUrl: "assets/template/homework/splash.html", // 指定模板地址
            },
            "loading@": {
                templateUrl: "assets/template/loading.html", // 指定模板地址
            },
            "header@": {
                templateUrl: "assets/template/homework/header.html", // 指定模板地址
            },
            "": {
                templateUrl: "assets/template/homework/app.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/app.js", // 指定控制器地址
            }
            //,"footer@": { // 视图名字的语法请仔细查阅文档
                //templateUrl: "assets/template/footer.html", // 指定模板地址
            //}
        }
    })
    .state("app.list", { // 定义一个子状态
        url: "", // list the homework and can enter to do it
        views: {
            "": {
                templateUrl: "assets/template/homework/list.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/list.js" // 指定控制器地址
                //ignoreChange: function(changeType) { 
                    //return !!changeType;
                //} // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
            }
        }
    })
    .state("app.detail", { // 用来作为做题模块的总ctrl，抽象状态,加载完资源后会立即绘制info
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/template/homework/detail.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/detail.js" // 指定控制器地址
            }
        }
    })
    .state("app.detail.info", { // 作业信息面板，带homeworkId, 用于跳转到相应题目视图
        url: "detail/{homeworkId}/info", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/info.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/info.js" // 指定控制器地址
            }
        }
    })
    .state("app.detail.question", { // 作业，url较为复杂，某作业下的某题
        url: "detail/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/template/homework/question.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/question.js", // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.detail.result", { // 某次作业的结果
        url: "detail/{homeworkId}/result", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/result.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/result.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake", { // 用来作为错题ctrl，抽象状态,加载完资源后会立即绘制 mistakeList
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/template/homework/mistake.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistake.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake.list", { // mistake list
        url: "mistake/list", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/mistakeList.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistakeList.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake.wrong", { // mistake question
        url: "mistake/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/template/homework/wrong.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/wrong.js", // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.evaluation", { // 课堂表现评价列表
        url: "evaluation", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/evaluation.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/evaluation.js" // 指定控制器地址
            }
        }
    })
    //.state("app.report", { // 学业统计报告页面
    //    url: "report", // 
    //    views: {
    //        "": {
    //            templateUrl: "assets/template/homework/report.html", // 指定模板地址
    //            controllerUrl: "scripts/controller/homework/report.js" // 指定控制器地址
    //        }
    //    }
    //})

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
    var cachePage = [];
    // 每次view载入都会执行的回调，适合来做一些统一操作
    avalon.state.config({ 
        onError: function() {
            avalon.log("Error!, Redirect to index!", arguments);
            avalon.router.go("app.list");
        }, 
        onBeforeUnload: function() { // 太宽泛了，放到具体ctrl里处理
            // avalon.log("0 onBeforeUnload" + arguments);
        },
        onUnload: function() { // url变化时触发
            // avalon.log("1 onUnload" + arguments);
        },
        onBegin: function() {
            // avalon.log("2 onBegin" + root.currentPage);
            // 缓存来过的页面，不在显示loader
            var pageId = location.href.split("!")[1];
            cachePage.push(pageId);
            var loader = document.querySelector('.loader');
            var visited = false;
            for (var i = 0, len = cachePage.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
                if (cachePage[i] === pageId) {
                    visited = true;
                    avalon.vmodels.root.currentIsVisited = true;
                }
            }
            if (loader && !visited) { // 存在loader并且为未访问过得页面则show loader
                loader.style.display = '';
                handleBadNetwork();
            }
        },
        onLoad: function() { // 切换完成并成功
            //avalon.log("3 onLoad" + root.currentPage);
            // 根据state更新标题
            var state1 = mmState.currentState.stateName.split(".")[1]; // 第二个
            var state2 = mmState.currentState.stateName.split(".")[2]; // 第三个
            //root.currentPage = state1;
            state2 == void 0 ? root.currentPage = state1 : root.currentPage = state2;

            root.title = acTitle[state1 != void 0 ? state1 : state2];

            // next view loaded, remove loader && badNetworkHandler && add view-in animation
            var loader = document.querySelector('.loader');
            setTimeout(function() {
                loader && (loader.style.display = 'none'); // for strong, need ()
                avalon.badNetworkTimer && clearTimeout(avalon.badNetworkTimer);
            }, 200);
            var view = document.querySelector('[avalonctrl='+ root.currentPage + ']');
            view && view.classList.add(avalon.illyGlobal && avalon.illyGlobal.viewani); // for strong
        },
        onViewEnter: function(newNode, oldNode) {
            //avalon(oldNode).animate({
            //    marginLeft: "-100%"
            //}, 500, "easein", function() {
            //    oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
            //})
        } 
    });

    /* router end */

    return {
        init: function() { // init router and bootstrap the app
            avalon.log("init to bootstrap the app!");
            avalon.history.start({
                // basepath: "/mmRouter",
                fireAnchor: false
            });
            //go!!!!!!!!!
            avalon.scan();

            // performance listener, avalon take charge of everything and start to init the app
            var startTime = Date.now(); 
            avalon.appInitTime = startTime;
        }
    }

})

