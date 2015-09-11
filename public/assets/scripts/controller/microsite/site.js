define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;
    if (token === null) {
        avalon.illyGlobal.noTokenHandler();
    }

    // defaultAvatarUrl
    var defaultAvatarUrl = 'http://resource.hizuoye.com/images/avatar/children/default1.png?imageView2/1/w/200/h/200';

    // site ctrl take charge of everything...
    var site = avalon.define({ 
        $id: "site",
        illy_domain: avalon.illyGlobal.illyDomain,
        illy_images_base: avalon.illyGlobal.imagesBaseSrc,
        categoriesNames: [], // cached auto nature
        categoryId: '',  // for list.html ui-state-active use
        fetchAllCategoriesNames: function() {
            $http.ajax({
                url: apiBaseUrl + 'categories',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(res) {
                    res.unshift({_id: 'hots', 'name': '热门文章'});
                    site.categoriesNames = res; // cached auto nature
                },
                error: function(res) {
                    avalon.illyError('site fetchAllCategoriesNames ajax error!', res);
                },
                ajaxFail: function(res) {
                    avalon.illyError('site fetchAllCategoriesNames ajax failed!', res);
                }
            });
        },
        renderNavigator: function() { // only invoke once
            setTimeout(function() {
                // 0. init
                $('#nav').navigator();
                // 1 add fixed
                $('.left-fixed').addClass('fixed-navigator');
                $('#nav li').removeClass('ui-state-active');
            }, 32); // enough time for strong
        },
        displayName: '',
        avatar: defaultAvatarUrl,
        schoolName: '',
        score: 88,
        studentCount: 100,
        getUserInfo: function() {
            $http.ajax({
                url: apiBaseUrl + "profile",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    site.avatar = json.avatar !== void 0 ? json.avatar : defaultAvatarUrl;
                    site.displayName = json.displayName;
                    site.score = json.score;
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
                    site.schoolName = json.school;
                    avalon.vmodels.root.footerInfo = json.school + ' © ' + new Date().getFullYear();
                    site.studentCount = json.studentCount || 100;
                }
            });
        },

        /* common start */
        appMessage: 'I am message from app ctrl',
        gMaskShow: false,
        /* common end */
        /* alert start */
        gAlertShow: false,
        showAlert: function(message, hideDelay) {
            site.appMessage = message; // set message
            site.gMaskShow = true;
            site.gAlertShow = true;
            if (hideDelay !== void 0) {
                setTimeout(function() {
                    site.hideAlert();
                }, hideDelay * 1000);
            }
        },
        hideAlert: function() {
            site.gMaskShow = false;
            site.gAlertShow = false;
        },
        iKnowClick: function() {
            site.hideAlert();
        }
        /* alert end */
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };

        // 仅执行一次，抓取所有栏目名，供以后使用
        site.fetchAllCategoriesNames();

        // 进入视图
        var navigatorInitDelay = 80;
        $ctrl.$onEnter = function() {

            // clear old local cache
            avalon.clearLocalCache('illy-microsite-');

            // add listener for index view's navigator
            avalon.vmodels.root.$watch("currentState", function(newVal, oldVal) { /* jshint ignore:line */ 
               if (newVal === 'index') {
                   setTimeout(function() {
                       $('#nav li').removeClass('ui-state-active');
                   }, navigatorInitDelay + 100 );
               }

               if (newVal === 'detail') {
                   avalon.$('.left-fixed').style.display = 'none';
               } else {
                   avalon.$('.left-fixed').style.display = 'block';
               }
            });

            site.getUserInfo();
            site.getSchoolInfo();

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            // 貌似到不了这里，因为执行不到这里，或者关掉页面了（那就更执行不到了）
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

