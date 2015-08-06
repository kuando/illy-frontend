define([], function() {

    // site ctrl take charge of everything...
    var site = avalon.define({
        $id: "site"
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
            // text-loading && splash done...
            setTimeout(function() {
                document.querySelector('#splash').style.display = 'none';
            }, avalon.splashShowTime)
            document.querySelector('#loading-before-site').style.display = 'none';

        }
        // 进入视图
        $ctrl.$onEnter = function() {

            // clear old local cache
            avalon.clearLocalCache('illy-microsite-index-');
            avalon.clearLocalCache('illy-microsite-list-');
            avalon.clearLocalCache('illy-microsite-detail-');

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            // 貌似到不了这里，因为执行不到这里，或者关掉页面了（那就更执行不到了）
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

