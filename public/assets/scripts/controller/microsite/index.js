define([], function() {

    var index = avalon.define({
        $id: "index",
        sliders: [],
        hots: [],
        categories: []
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            avalon.log("index.js onRendered fn");
            $('#slider').slider(); // exist the dom and can be invoked this fn to render the slider
        }
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.log("index.js onEnter callback");
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("index.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

