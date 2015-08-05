
define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-task-detail-';
    
    var detail = avalon.define({
        $id: "detail",
        taskId: 1,
        title: "",
        content: "",
        created: "2015-07-09",
        shareCount: 88,
        visitCount: 88,
        isShared: false,
        updateShare: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + '/api/v1/tasks/' + detail.taskId + '/share',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {

                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            })
        },
        fetchData: function() {
            if (detail.visited) {
                var local = JSON.parse(localStorage.getItem(cachedPrefix + detail.taskId));
                detail.title = local.title;
                detail.content = local.content;
                detail.created = local.created;
                detail.shareCount = local.shareCount;
                detail.visitCount = local.visitCount;
                return; // core!!! key!!! forget this will getCache and request!!!
            }
            $http.ajax({
                url: apiBaseUrl + "/api/v1/tasks/" + detail.taskId,
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
                    localStorage.setItem(cachedPrefix + detail.taskId, JSON.stringify(json));

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
                            // 可以进行下一步
                        }
                    });

                }
            })
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

            avalon.$('.gotop').onclick = function() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {

            detail.taskId = params.taskId;
            detail.visited = avalon.vmodels.root.currentIsVisited;
            detail.isShared = false; // overwrite it
            detail.fetchData();

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

