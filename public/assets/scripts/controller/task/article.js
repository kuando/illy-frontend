define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = avalon.illyGlobal.token;

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-task-article-';
    
    var article = avalon.define({
        $id: "article",
        taskId: 1,
        scoreAward: 0,
        title: "",
        content: "",
        created: "2015-07-09",
        shareCount: 88,
        visitCount: 88,
        isShared: false,
        updateShare: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'tasks/' + article.taskId + '/share',
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
            if (article.visited) {
                var local = avalon.getLocalCache(cachedPrefix + article.taskId);
                article.title = local.title;
                article.content = local.content;
                article.created = local.created;
                article.shareCount = local.shareCount;
                article.visitCount = local.visitCount;
                return; // core!!! key!!! forget this will getCache and request!!!
            }
            $http.ajax({
                url: apiBaseUrl + "tasks/" + article.taskId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    article.title = json.title;
                    article.content = json.content;
                    article.created = json.created;
                    article.shareCount = json.shareCount;
                    article.visitCount = json.visitCount;
                    //localStorage.setItem(cachedPrefix + article.taskId, JSON.stringify(json));
                    avalon.setLocalCache(cachedPrefix + article.taskId, json);

                    wx.onMenuShareTimeline({
                        title: article.title, // 分享标题
                        link: '', // 分享链接
                        imgUrl: document.getElementsByTagName('img')[0].src, // 分享图标
                        success: function () { 
                            // 不管成功与否，前台界面至少先更新
                            article.shareCount++;
                            article.isShared = true;
                            article.updateShare();
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                            alert('差一点就能完成任务拿积分了!');
                        }
                    });

                }
            });
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

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

            article.taskId = params.taskId;
            article.scoreAward = params.scoreAward;
            article.visited = avalon.vmodels.root.currentIsVisited;
            article.isShared = false; // overwrite it
            article.fetchData();

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

