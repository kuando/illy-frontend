define([], function() {

    var header = avalon.define({
        $id: "header",  
        headerShow: false, // for header.html
        backBtnShow: true, // for header.html
        backHomeBtnShow: true, // for header.html
        back: function() { // has default back and can custom it
            history.go(-1);
        }
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.vmodels.root.$watch('currentState', function(currentState) {
                if (currentState !== void 0) {

                    // headerShow logic 
                    if (currentState !== 'index') {
                        header.headerShow = true;
                    } else {
                        header.headerShow = false;
                    }


                }
            }); // end of header.currentState watcher
        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
           
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

