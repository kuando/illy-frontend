define([], function() {

    // get config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;
    
    // get config, token
    var token = avalon.illyGlobal.token; 

    // override the global back method, only with btn in header
    var back = function back() {

        // tip user whether drop current done! every view change condition should put flag and return
        if ( !result.isDone && result.isDoing ) {

            result.dropCurrentDoneComfirm();

            var app = avalon.vmodels.app; 
            app.$watch("yesOrNo", function(value) { /* [, oldValue] */
                if (value === true) {
                    avalon.router.go('app.list');
                    return ;
                } 
                else {
                    app.$unwatch("yesOrNo");
                }
            });

        } else {
            avalon.router.go('app.list');
            return ;
        }

    };

    // 作业详情控制器
    var result = avalon.define({

        $id: "result",
        current: 'list'
    }); // end of define

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {
            // 抽象视图，啥也不做,放到具体视图里做,但会执行
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

