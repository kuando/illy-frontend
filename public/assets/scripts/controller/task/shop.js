define([], function() {

    // get config
    var apiBaseUrl = ( avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl) || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;
    
    var detail = avalon.define({
        $id: "shop",
        lists: []
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

