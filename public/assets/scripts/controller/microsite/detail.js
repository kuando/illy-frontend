define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuo.com/api/v1/';
    var token = avalon.illyGlobal.token;
    if (token == void 0) {
        avalon.log("Error, no token!");
        alert('对不起，系统错误，请退出重试！');
    }

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-microsite-detail-';

    // cache the view data
    var needCache = true;
    
    var detail = avalon.define({
        $id: "detail",
        visited: false,
        articleId: 1,
        title: "",
        content: "",
        created: "2015-07-09",
        shareCount: 88,
        visitCount: 88,
        isShared: false,
        hasLiked: false,
        updateShare: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'posts/' + detail.articleId + '/share',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    avalon.log(res);
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            });
        },
        updateLike: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'posts/' + detail.articleId + '/like',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    avalon.log(res);
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            });
        },
        fetchData: function() {
            if (detail.visited && needCache) {
                var localCache = avalon.getLocalCache(cachedPrefix + detail.articleId);
                detail.title = localCache.title;
                detail.content = localCache.content;
                detail.created = localCache.created;
                detail.shareCount = localCache.shareCount;
                detail.visitCount = localCache.visitCount;
                return; // core!!! key!!! forget this will getCache and request which is the worst way!
            }
            $http.ajax({
                url: apiBaseUrl + "posts/" + detail.articleId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    detail.title = json.title;
                    detail.content = json.content;
                    detail.created = json.created;
                    detail.shareCount = json.shareCount;
                    detail.visitCount = json.visitCount;
                    avalon.setLocalCache(cachedPrefix + detail.articleId, json);

                    wx.onMenuShareTimeline({
                        title: detail.title, // 分享标题
                        link: '', // 分享链接
                        imgUrl: document.getElementsByTagName('img')[0].src, // 分享图标
                        success: function () { 
                            // 不管成功与否，前台界面至少先更新
                            detail.shareCount++;
                            detail.isShared = true;
                            detail.updateShare();
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                            alert('差一点就能完成任务拿积分了!');
                        }
                    });

                }
            });
        }, // end of fetch data
        like: function() {
            // http 
            detail.updateLike();
            // local
            avalon.setLocalCache(cachedPrefix + detail.articleId + '-like', 'hasLiked');     
            // ui
            detail.hasLiked = true;
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
            // outer user will no header to go in inner system
            if (avalon.getVM('index') == void 0) { avalon.$('.yo-header').style.display = 'none'; }

            avalon.$('.gotop').onclick = function() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            };

            setTimeout(function() {
                avalon.$('#gotop').style.display = 'block';
            }, 3000);

        };
        // 进入视图
        $ctrl.$onEnter = function(params) {

            detail.articleId = params.articleId;
            detail.visited = avalon.vmodels.root.currentIsVisited;
            detail.isShared = false; // overwrite it
            detail.fetchData();

            var isLiked = avalon.getLocalCache(cachedPrefix + detail.articleId + '-like');
            if (isLiked === 'hasLiked') {
                detail.hasLiked = true;
            } else {
                detail.hasLiked = false;
            }

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

