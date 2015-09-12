// ==================== custom project data start @include ==================== //

    if (token === null) {
        alert("对不起，本系统仅供内部使用！ ERROR::no token error!");
        setTimeout(function() {
            wx.closeWindow();
        }, 3000);
    }

    // avalon global stuff when app init
    avalon.illyGlobal = {

        viewani    : global_viewload_animation_name,
        token      : token,
        apiBaseUrl : apiBaseUrl,
        illyDomain : illy_domain,
        imagesBaseSrc: illy_images_base_src

    };

    // 定义一个顶层的vmodel，用来放置全局共享数据, 挂载在html元素上
    var root = avalon.define({
        $id: "root", // in html or body
        namespace: 'task', // module namespace, for global cachePrefix use
        currentState: '', // list question wrong info result...
        currentAction: '', // onBegin onLoad onBeforeUnload onUnload onError...
        currentIsVisited: false, // boolean flag
        title: '', // for title element or actionBar use
        footerInfo: '', // first in get the info, rendered in page footer
        back: function() {
            history.go(-1);
        }
    });

    // ==================== custom project data end @include ==================== //
