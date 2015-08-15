define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuo.com/api/v1/';
    var token = avalon.illyGlobal.token;

    //if (token === void 0) {
    //    avalon.log("Error, no token!");
    //    alert('对不起，系统错误，请退出重试！');
    //}

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-microsite-detail-';

    // resource prefix
    var resourcePrefix = 'http://resource.hizuoye.com/';

    // cache the view data
    var needCache = true;
    
    var detail = avalon.define({
        $id: "detail",
        visited: false,
        articleId: 1,
        title: "",
        image: '',
        content: "",
        created: "2015-07-03",

        shareCount: 88,
        visitCount: 88,
        likeCount: 0,

        isShared: false,
        updateShare: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'public/posts/' + detail.articleId + '/share',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function() {

                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            });
        },
        
        hasLiked: false,
        updateLike: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'public/posts/' + detail.articleId + '/like',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function() { 
                    var likeCount = detail.likeCount || 0;
                    detail.likeCount = ++likeCount;
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            });
        },
        like: function() {
            // http 
            detail.updateLike();
            // local
            avalon.setLocalCache(cachedPrefix + detail.articleId + '-like', 'hasLiked');     
            // ui
            detail.hasLiked = true;
        },

        fetchData: function() {
            if (detail.visited && needCache) {
                var localCache = avalon.getLocalCache(cachedPrefix + detail.articleId);
                detail.title = localCache.title;
                detail.image = resourcePrefix + localCache.image;
                detail.content = localCache.content;
                detail.created = localCache.created;
                detail.shareCount = localCache.shareCount;
                detail.visitCount = localCache.visitCount;
                detail.likeCount = localCache.like;
                return; // core!!! key!!! forget this will getCache and request which is the worst way!
            }
            $http.ajax({
                url: apiBaseUrl + "public/posts/" + detail.articleId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    detail.title = json.title;
                    detail.image = resourcePrefix + json.image;
                    detail.content = json.content;
                    detail.created = json.created;
                    detail.shareCount = json.shareCount;
                    detail.visitCount = json.visitCount;
                    detail.likeCount = json.like;
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
                            if (!detail.isShared) {
                                alert('差一点就分享成功了!');
                            }
                        }
                    });

                }
            });
        } // end of fetch data

    }); // end of define

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
            avalon.$('.gotop').onclick = function() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            };

            setTimeout(function() {
                var gotop = avalon.$('#gotop');
                gotop && (gotop.style.display = 'block'); /* jshint ignore:line */
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
                ++detail.likeCount; // 既然已经点过赞，那么就不用缓存的原始数据，而要加1
            } else {
                detail.hasLiked = false;
            }

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {  

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

