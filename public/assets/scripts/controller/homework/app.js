define([], function() {

    // global config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;

    // token
    var token = avalon.illyGlobal.token;
    if (token === null) {
        avalon.vmodels.root.noTokenHandler();
    }

    var resourcePrefix = 'http://resource.hizuoye.com/';

    // defaultAvatarUrl
    var defaultAvatarUrl = 'http://resource.hizuoye.com/images/avatar/children/default1.png?imageView2/1/w/200/h/200';

    // app ctrl take charge of everything...
    var app = avalon.define({

        $id: "app",
        illy_images_base: avalon.illyGlobal.imagesBaseSrc,

        /* common start */
        appMessage: 'I am message from app ctrl',
        gMaskShow: false,
        /* common end */

        /* comfirm start */
        yesOrNo: null,
        gConfirmShow: false,
        showConfirm: function(message) {
            app.appMessage = message; // set message
            app.gMaskShow = true;
            app.gConfirmShow = true;
        },
        hideConfirm: function() {
            app.yesOrNo = null;
            app.gMaskShow = false;
            app.gConfirmShow = false;
        },
        yesClick: function() {
            app.yesOrNo = true;
            app.hideConfirm();
        },
        noClick: function() {
            app.yesOrNo = false;
            app.hideConfirm();
        },
        /* confirm end */

        /* alert start */
        gAlertShow: false,
        showAlert: function(message, hideDelay) {
            app.appMessage = message; // set message
            app.gMaskShow = true;
            app.gAlertShow = true;
            if (hideDelay !== void 0) {
                setTimeout(function() {
                    app.hideAlert();
                }, hideDelay * 1000);
            }
        },
        hideAlert: function() {
            app.gMaskShow = false;
            app.gAlertShow = false;
        },
        iKnowClick: function() {
            app.hideAlert();
        },
        /* alert end */

        schoolName: '',
        studentCount: 100,
        displayName: '',
        avatar: defaultAvatarUrl,
        getUserInfo: function() {
            $http.ajax({
                url: apiBaseUrl + "profile",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    if (json.avatar !== void 0) {
                        app.avatar = resourcePrefix + json.avatar + '?imageView2/2/w/200/h/200';
                    } else {
                        app.avatar = defaultAvatarUrl;
                    }
                    app.displayName = json.displayName;
                    app.score = json.score;
                }
            });
        },
        getSchoolInfo: function() {
            $http.ajax({
                url: apiBaseUrl + "school",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    app.schoolName = json.school;
                    avalon.vmodels.root.footerInfo = json.school + ' © ' + new Date().getFullYear();
                    app.studentCount = json.studentCount || 100;
                }
            });
        }
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {
            //avalon.log("app.js says i am in onEnter fn, do some common init stuff...");
            // now, remove the loading tip  before bootstrap the app
            //var before_app_loader = '#loading-before-app';
            //document.querySelector(before_app_loader).style.display = 'none';
            //avalon.log("文字提示消失，页面开始由app ctrl接管 --> " + Date.now());
            
            // performance listener, almost rendered the page...
            var endTime = Date.now();
            avalon.appRenderedTime = endTime;
            avalon.appTotalTime = avalon.appRenderedTime - avalon.appInitTime;
            // only first in will log
            (avalon.appTotalTime < 15000) && avalon.log('total of avalon rendered the page: ' + avalon.appTotalTime); /* jshint ignore:line */
            app.getUserInfo();
        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log("app.js onRendered fn");
            
            // if rendered fast and less than 888ms, will show completely, else, show 1s
            //var splashShowTime = avalon.appTotalTime < 888 ? (avalon.splashShowTime) : 666;
            //setTimeout(function() { // 公共总控制器渲染完成，此时取消全局splash
            //    document.querySelector('#splash').style.display = 'none';
            //    //alert(1);
            //}, splashShowTime); // 太短了？？？ 要不要弄固定时长？
            //avalon.log("splash 消失！首页渲染基本完成 --> " + Date.now());
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("app.js says i am in onBeforeUnload fn"); // 貌似到不了这里，因为是抽象视图
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

