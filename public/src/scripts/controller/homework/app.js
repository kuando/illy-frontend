define([], function() {

    // global config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;

    // token
    var token = avalon.illyGlobal.token;

    // resourcePrefix
    var resourcePrefix = avalon.illyGlobal.resourceBaseUrl;

    // defaultAvatarUrl
    var defaultAvatarUrl = resourcePrefix + 'images/avatar/children/default1.png?imageView2/1/w/200/h/200';

    //var slidersUrlPrefix = './assets/images';

    //var listSliders = [
    //    {
    //        image: slidersUrlPrefix + '/hw-list-slider2.png',
    //        title: 'mistakeList',
    //        href: '#!/mistake/list'
    //    }
    //];

    //var mistakeListSliders = [
    //    {
    //        image: slidersUrlPrefix + '/hw-list-slider1.png',
    //        title: 'homework',
    //        href: '#!/'
    //    },
    //    {
    //        image: slidersUrlPrefix + '/hw-list-slider2.png',
    //        title: 'homework',
    //        href: '#!/'
    //    }
    //];

    // app ctrl take charge of everything...
    var app = avalon.define({

        $id: "app",
        $skipArray: ["illly_domain", "illy_images_base"],
        illy_domain: avalon.illyGlobal.illyDomain,
        illy_images_base: avalon.illyGlobal.imagesBaseSrc,
        illy_resource_base: avalon.illyGlobal.resourceBaseUrl,
        //sliders: [],
        //renderSlider: function() {
        //    setTimeout(function() {
        //        $('.illy-container #slider').slider({
        //            loop: true,
        //            ready: function() {
        //                setTimeout(function() {
        //                    avalon.$('.illy-container #slider').style.visibility = 'visible';
        //                }, 16); // 1 frame
        //            },
        //            'done.dom': function() {

        //            }
        //        });
        //    }, 132);
        //},

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

    //avalon.vmodels.root.$watch('currentState', function(newState) {
    //    if (newState !== 'list' && newState !== 'mistakeList') { // view-only
    //        avalon.$('.illy-container #slider').style.display = 'none';
    //    } else {
    //        if (newState === 'list') {
    //            setTimeout(function() {
    //                avalon.vmodels.app.sliders = listSliders;
    //            }, 64);
    //        }
    //        if (newState === 'mistakeList') {
    //            setTimeout(function() {
    //                avalon.vmodels.app.sliders = mistakeListSliders;
    //            }, 64);
    //        }
    //    }
    //});

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {
            
            app.getUserInfo();

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            var renderedTime = Date.now();
            setTimeout(function() {
                avalon.illyInfo('avalon rendered totalTime: ' , renderedTime - avalon.appInitTime);
            }, 888);
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            // clear old local cache
            avalon.clearLocalCache('illy-homework-');
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

