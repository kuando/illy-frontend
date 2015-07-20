define([], function() {

    // review in 201507221009 
    
    // app ctrl take charge of everything...
    var app = avalon.define({
        $id: "app"
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log("app.js onRendered fn");
            setTimeout(function() { // 公共总控制器渲染完成，此时取消全局splash
                document.querySelector('#splash').style.display = 'none';
                //alert(1);
            }, 16) // 太短了？？？ 要不要弄固定时长？
            avalon.log("splash 消失！首页渲染基本完成 --> " + Date.now());
        }
        // 进入视图
        $ctrl.$onEnter = function() {
            //avalon.log("app.js says i am in onEnter fn, do some common init stuff...");
            // now, remove the loading tip  before bootstrap the app
            var before_app_loader = '#loading-before-app';
            document.querySelector(before_app_loader).style.display = 'none';
            avalon.log("文字提示消失，页面开始由app ctrl接管 --> " + Date.now());
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("app.js says i am in onBeforeUnload fn"); // 貌似到不了这里，因为是抽象视图
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

